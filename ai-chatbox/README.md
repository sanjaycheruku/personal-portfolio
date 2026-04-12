# NextChat UI - AI Chatbox

A modern, production-ready AI Chat application built with Python (FastAPI) and a frontend completely overhauled to precisely replicate the acclaimed **NextChat (ChatGPT-Next-Web)** UI - the #1 most popular AI chat interface on GitHub.

## Features

- **NextChat UI architecture**: Elegant glassmorphic window, intuitive sidebar, and beautifully rendered chat bubbles.
- **Advanced Code Highlighting**: Full highlight.js integration with one-click "Copy Code" blocks, just like GitHub NextChat.
- **Persistent Context**: Complete session conversation memory using an integrated SQLite database.
- **Smart Streaming**: Instant token-by-token output rendering directly via SSE.
- **Role Modes**: Swap between intelligent AI personas dynamically (General Assistant, Interviewer, Software Developer, Tutor).
- **Document Q&A**: Native PDF uploads via PyPDF - attach documents to chat and extract context on the fly.

## Local Setup Instructions

1. **Navigate to the correct workspace**:
```bash
# If you aren't already in the directory
cd ai-chatbox
```

2. **Create a virtual environment** and activate it:
```bash
python -m venv venv

# For Windows:
venv\Scripts\activate
# For Linux/Mac:
# source venv/bin/activate
```

3. **Install Dependencies**:
```bash
pip install -r requirements.txt
```

4. **Environment Variables Config**:
Make sure you setup the Gemini Key before starting.
```powershell
$env:GEMINI_API_KEY = "YOUR-GOOGLE-GEMINI-KEY"
```

5. **Start Dev Server**:
```bash
uvicorn main:app --reload
```

Then visit [http://localhost:8000](http://localhost:8000) to view the Chatbox UI.
