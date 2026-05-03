from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve current directory files
app.mount("/static", StaticFiles(directory=".", html=True), name="static")

@app.get("/", response_class=HTMLResponse)
async def read_index():
    with open("index.html", "r") as f:
        return f.read()

@app.get("/style.css", response_class=HTMLResponse)
async def read_css():
    with open("style.css", "r") as f:
        return HTMLResponse(content=f.read(), media_type="text/css")
        
@app.get("/script.js", response_class=HTMLResponse)
async def read_js():
    with open("script.js", "r") as f:
        return HTMLResponse(content=f.read(), media_type="application/javascript")

@app.post("/api/chat")
async def chat_endpoint(request: Request):
    data = await request.json()
    messages = data.get("messages", [])
    
    if not messages:
        return JSONResponse({"reply": "No message provided."}, status_code=400)
        
    last_message = messages[-1]["content"]
    
    # Try using Gemini API if expected setup is ready
    try:
        import google.generativeai as genai
        api_key = os.environ.get("GEMINI_API_KEY")
        
        if api_key:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-1.5-pro')
            
            # Formatting history for Gemini
            history = []
            for msg in messages[:-1]:
                role = "user" if msg["role"] == "user" else "model"
                if history and history[-1]["role"] == role:
                    history[-1]["parts"][0] += f"\n\n{msg['content']}"
                else:
                    history.append({"role": role, "parts": [msg["content"]]})
                
            chat = model.start_chat(history=history)
            response = chat.send_message(last_message)
            return {"reply": response.text}
    except Exception as e:
        print(f"Gemini API Error or not configured: {e}")
        
    # Fallback simulated response
    reply = f"I am Nova AI. You said: '{last_message}'.\n\n*(Note: To enable real AI responses, set the GEMINI_API_KEY environment variable and install `google-generativeai`)*."
    
    if "hello" in last_message.lower() or "hi" in last_message.lower():
        reply = "Hello there! I'm Nova, your intelligence-powered AI assistant. How can I help you today?"
        
    elif "quantum computing" in last_message.lower():
        reply = "**Quantum computing** is a rapidly-emerging technology that harnesses the laws of quantum mechanics to solve problems too complex for classical computers.\n\nKey concepts include:\n* **Superposition**: Qubits can exist in multiple states at once.\n* **Entanglement**: Qubits can be mysteriously linked forever."
    
    elif "python" in last_message.lower():
        reply = "Here is a quick Python example:\n\n```python\ndef greet(name):\n    print(f\"Hello {name}!\")\n\ngreet(\"Nova\")\n```"
        
    return {"reply": reply}

if __name__ == "__main__":
    import uvicorn
    # Make sure to run from within the nova-ai-chatbot directory
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
