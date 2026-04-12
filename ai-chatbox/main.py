import os
import uuid
import pypdf
from fastapi import FastAPI, Request, UploadFile, File, Depends, HTTPException
from fastapi.responses import HTMLResponse, StreamingResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
import google.generativeai as genai

from database import engine, Base, get_db
import models
from prompts import SYSTEM_PROMPTS
from dotenv import load_dotenv

load_dotenv()

# Make sure tables are created
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Chatbox", description="Minimal AI Web App using FastAPI & Gemini")

# Initialize required directories
os.makedirs("static", exist_ok=True)
os.makedirs("templates", exist_ok=True)
os.makedirs("uploads", exist_ok=True)

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

API_KEY = os.getenv("GEMINI_API_KEY", "")
if API_KEY:
    genai.configure(api_key=API_KEY)

@app.get("/", response_class=HTMLResponse)
async def index(request: Request, db: Session = Depends(get_db)):
    # Render main page with Jinja2
    sessions = db.query(models.ChatSession).order_by(models.ChatSession.created_at.desc()).all()
    return templates.TemplateResponse("index.html", {
        "request": request, 
        "sessions": sessions,
        "modes": SYSTEM_PROMPTS.keys(),
        "api_key_set": bool(API_KEY)
    })

@app.post("/api/sessions")
async def create_session(request: Request, db: Session = Depends(get_db)):
    # Create a new chat session using a unique UUID
    data = await request.json()
    mode = data.get("mode", "default")
    session_id = str(uuid.uuid4())
    new_session = models.ChatSession(id=session_id, mode=mode, title="New Chat")
    db.add(new_session)
    db.commit()
    return {"session_id": session_id, "mode": mode}

@app.get("/api/sessions/{session_id}")
async def get_session_messages(session_id: str, db: Session = Depends(get_db)):
    # Get metadata and messages for a specific session
    session = db.query(models.ChatSession).filter(models.ChatSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    messages = db.query(models.ChatMessage).filter(models.ChatMessage.session_id == session_id).order_by(models.ChatMessage.id).all()
    return {
        "title": session.title,
        "mode": session.mode,
        "messages": [{"role": m.role, "content": m.content} for m in messages]
    }

@app.delete("/api/sessions/{session_id}")
async def delete_session(session_id: str, db: Session = Depends(get_db)):
    # Delete a session and its associated messages
    db.query(models.ChatMessage).filter(models.ChatMessage.session_id == session_id).delete()
    db.query(models.ChatSession).filter(models.ChatSession.id == session_id).delete()
    db.commit()
    return {"status": "success"}

@app.post("/api/chat/{session_id}")
async def chat(session_id: str, request: Request, db: Session = Depends(get_db)):
    # Primary API Endpoint for streaming chat responses
    data = await request.json()
    user_message = data.get("message", "")
    
    if not API_KEY:
        return JSONResponse(status_code=400, content={"error": "GEMINI_API_KEY environment variable missing. Please configure it in your .env file."})

    msg = models.ChatMessage(session_id=session_id, role="user", content=user_message)
    db.add(msg)
    
    # Auto-generate title on first message
    session = db.query(models.ChatSession).filter(models.ChatSession.id == session_id).first()
    if session and session.title == "New Chat":
        session.title = (user_message[:30] + "...") if len(user_message) > 30 else user_message
    db.commit()

    # Retrieve memory/history for context-aware responses
    history = db.query(models.ChatMessage).filter(models.ChatMessage.session_id == session_id).order_by(models.ChatMessage.id).all()
    system_prompt = SYSTEM_PROMPTS.get(session.mode if session else "default", SYSTEM_PROMPTS["default"])
    
    # Map roles for Gemini (user/model) and ENSURE they strictly alternate (merging consecutive roles)
    formatted_history = []
    
    for h in history[:-1]:  # skip the new message to append it cleanly
        r = "user" if h.role == "user" else "model"
        
        # Prevent Google API Crash from consecutive same roles
        if formatted_history and formatted_history[-1]["role"] == r:
            formatted_history[-1]["parts"][0] += f"\n\n{h.content}"
        else:
            formatted_history.append({"role": r, "parts": [h.content]})
            
        
    try:
        # Utilizing gemini-1.5-pro for higher reasoning capabilities
        model = genai.GenerativeModel('gemini-1.5-pro', system_instruction=system_prompt)
        chat_session = model.start_chat(history=formatted_history)
        
        async def stream_generator():
            full_response = ""
            try:
                # Streaming token-by-token
                response = chat_session.send_message(user_message, stream=True)
                for chunk in response:
                    text_chunk = chunk.text
                    if text_chunk:
                        full_response += text_chunk
                        yield text_chunk
            except Exception as e:
                yield f"\n\n**Error:** {str(e)}"
            finally:
                # Once complete, save the combined assistant message into DB
                db_session = next(get_db())
                assistant_msg = models.ChatMessage(session_id=session_id, role="model", content=full_response)
                db_session.add(assistant_msg)
                db_session.commit()

        return StreamingResponse(stream_generator(), media_type="text/plain")
        
    except Exception as e:
         return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/api/upload/{session_id}")
async def upload_pdf(session_id: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Endpoint to Handle PDF Uploads and Contextualize them
    if not file.filename.endswith('.pdf'):
         raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    try:
        file_path = f"uploads/{file.filename}"
        with open(file_path, "wb") as f:
            f.write(await file.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file securely: {str(e)}")
        
    text = ""
    try:
        # Extract text via PyPDF
        pdf_reader = pypdf.PdfReader(file_path)
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read PDF: {str(e)}")
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
            
    # Inject into the DB as a prompt without direct user interaction needed
    safe_text = text[:80000] # Safe limit for standard tokens
    context_msg = f"I've uploaded a document named '{file.filename}'. Context extracted:\n\n{safe_text}"
    
    msg = models.ChatMessage(session_id=session_id, role="user", content=context_msg)
    db.add(msg)
    
    ack_msg = models.ChatMessage(session_id=session_id, role="model", content=f"Document '{file.filename}' processed successfully. I've retained it in my memory. How can I help you query or analyze it?")
    db.add(ack_msg)
    db.commit()
    
    return {"status": "success", "filename": file.filename}

