const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const chatMessages = document.getElementById('chatMessages');
const typingIndicator = document.getElementById('typingIndicator');
const welcomeScreen = document.getElementById('welcomeScreen');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.querySelector('.sidebar');
const chatArea = document.getElementById('chatArea');

let isGenerating = false;
let messageHistory = [];

// Event Listeners
userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
    if(this.value.trim() === '') {
        this.style.height = '24px';
    }
    
    // Toggle send button state
    if (this.value.trim().length > 0 && !isGenerating) {
        sendBtn.disabled = false;
    } else {
        sendBtn.disabled = true;
    }
});

userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

sendBtn.addEventListener('click', sendMessage);

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && 
        !sidebar.contains(e.target) && 
        !menuToggle.contains(e.target) && 
        sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }
});

function setInput(text) {
    userInput.value = text;
    userInput.focus();
    userInput.dispatchEvent(new Event('input'));
    sendMessage();
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text || isGenerating) return;

    // Hide welcome screen on first message
    if (welcomeScreen.style.display !== 'none') {
        welcomeScreen.style.display = 'none';
        chatMessages.style.display = 'flex';
    }

    // Add user message
    addMessage(text, 'user');
    
    // Reset input
    userInput.value = '';
    userInput.style.height = '24px';
    sendBtn.disabled = true;
    
    // Prepare for generation
    isGenerating = true;
    typingIndicator.classList.remove('hidden');
    scrollToBottom();

    try {
        messageHistory.push({"role": "user", "content": text});
        
        // Simulating API call or real API Call to backend
        const response = await fetch('http://127.0.0.1:8000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages: messageHistory })
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        typingIndicator.classList.add('hidden');
        
        addMessage(data.reply, 'bot');
        messageHistory.push({"role": "assistant", "content": data.reply});

    } catch (error) {
        console.error("API Error:", error);
        typingIndicator.classList.add('hidden');
        // Simple fallback if no backend is running
        setTimeout(() => {
            const fallbackReply = "I am Nova AI. Backend server is currently disconnected. Please run the backend server (`python main.py`) to unlock my capabilities.";
            addMessage(fallbackReply, 'bot');
            isGenerating = false;
        }, 1000);
    }
}

function addMessage(text, sender) {
    const rowDiv = document.createElement('div');
    rowDiv.className = `message-row ${sender}`;
    
    const avatarContent = sender === 'user' ? '<i class="fa-solid fa-user"></i>' : '<i class="fa-solid fa-robot"></i>';
    
    // Basic Markdown formatting simulation
    let formattedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code style="background: rgba(255,255,255,0.1); padding: 2px 5px; border-radius: 4px; font-family: monospace;">$1</code>')
        .replace(/\n/g, '<br>');

    rowDiv.innerHTML = `
        <div class="message-bubble">
            ${sender === 'bot' ? `<div class="avatar">${avatarContent}</div>` : ''}
            <div class="message-content">${formattedText}</div>
            ${sender === 'user' ? `<div class="avatar">${avatarContent}</div>` : ''}
        </div>
    `;
    
    chatMessages.appendChild(rowDiv);
    
    if (sender === 'bot') {
        isGenerating = false;
        if(userInput.value.trim().length > 0) sendBtn.disabled = false;
    }
    
    scrollToBottom();
}

function scrollToBottom() {
    setTimeout(() => {
        chatArea.scrollTop = chatArea.scrollHeight;
    }, 50);
}
