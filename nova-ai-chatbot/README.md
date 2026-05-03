# Nova AI Chatbot 🤖

A sleek, modern AI chatbot powered by **Google Gemini** with a stunning dark-themed UI.

## Features
- 🌙 Premium dark glassmorphism UI
- 💬 Multi-turn conversation memory
- ⚡ FastAPI backend with auto-reload
- 🔒 Secure API key via environment variables
- 📱 Responsive mobile-friendly design

## Setup

### 1. Clone the repo
```bash
git clone https://github.com/sanjaycheruku/nova-ai-chatbot.git
cd nova-ai-chatbot
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure your API key
Create a `.env` file in the project root:
```
GEMINI_API_KEY=your_gemini_api_key_here
```
Get your free API key at [Google AI Studio](https://aistudio.google.com/app/apikey).

### 4. Run the server
```bash
uvicorn main:app --reload
```

### 5. Open the app
Visit **http://127.0.0.1:8000** in your browser.

## Tech Stack
- **Backend**: Python, FastAPI, Uvicorn
- **AI**: Google Gemini API
- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Fonts**: Google Fonts (Inter, Outfit)
- **Icons**: Font Awesome 6

## Project Structure
```
nova-ai-chatbot/
├── main.py          # FastAPI backend & Gemini integration
├── index.html       # Frontend UI
├── style.css        # Premium dark theme styles
├── script.js        # Frontend logic & API calls
├── requirements.txt # Python dependencies
└── .env             # API key (not committed)
```

## License
MIT
