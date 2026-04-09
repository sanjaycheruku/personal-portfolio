/**
 * AI Chatbot with Memory
 * Personalized for Sanjay Cheruku's Portfolio
 */

class SanjayBot {
    constructor() {
        this.isOpen = false;
        this.memoryKey = 'sanjay_bot_memory';
        this.userProfileKey = 'sanjay_bot_user';
        this.isVoiceEnabled = localStorage.getItem('bot_voice_enabled') === 'true';
        this.context = {
            lastTopic: null,
            interactions: 0,
            userInterests: []
        };
        
        this.knowledge = {
            name: "Sanjay Cheruku",
            role: "Software Engineer / B.Tech Computer Science student",
            skills: ["Python", "JavaScript", "Java", "SQL", "Flask", "Node.js", "Docker", "ServiceNow", "RESTful APIs", "CI/CD", "Gen AI Software Engineering"],
            education: {
                university: "Mohan Babu University, Tirupati",
                degree: "B.Tech in Computer Science Engineering",
                years: "2022-2026",
                gpa: "8.6",
                intermediate: "MGM JR College, Srikalahasti (82.10%)"
            },
            stats: {
                projects: 15,
                dsa: 150,
                gpa: 8.6
            },
            projects: [
                {
                    title: "ResumeAI — Smart ATS Analyzer",
                    tech: ["Python", "Flask", "NLP", "scikit-learn"],
                    desc: "AI-powered resume ecosystem with ATS scoring, skill extraction, and job matching using TF-IDF."
                },
                {
                    title: "Student Task Manager API",
                    tech: ["Python", "Flask", "MySQL", "Docker"],
                    desc: "RESTful CRUD API backend, containerized with Docker, 60% faster setup."
                },
                {
                    title: "Premium Portfolio Platform",
                    tech: ["Vanilla JS", "CSS3 Grid", "HTML5"],
                    desc: "High-performance portfolio with Lighthouse score 90+."
                }
            ],
            contact: {
                email: "cherukusanjay07@gmail.com",
                linkedin: "linkedin.com/in/sanjaycheruku/",
                github: "github.com/sanjaycheruku"
            },
            experience: [
                "Python Developer Intern at CodSoft (Advanced automation & tasks)",
                "Peer Technical Mentor at Mohan Babu University (Mentored 15+ students)",
                "Certified ServiceNow CSA Developer (Enterprise platform administration)"
            ],
            suggestions: [
                "What are your top projects?",
                "Tell me about your skills",
                "How can I contact Sanjay?",
                "What is your GPA?",
                "Tell me a joke"
            ]
        };

        this.init();
    }

    init() {
        this.render();
        this.cacheDOM();
        this.bindEvents();
        this.loadMemory();
        
        // Initial welcome message if memory is empty
        if (this.messages.length === 0) {
            setTimeout(() => {
                this.addWelcomeMessage();
            }, 1000);
        } else {
            this.renderMessages();
        }
    }

    addWelcomeMessage() {
        const profile = this.getUserProfile();
        const hour = new Date().getHours();
        let greeting = "Hi there!";
        if (hour < 12) greeting = "Good morning!";
        else if (hour < 18) greeting = "Good afternoon!";
        else greeting = "Good evening!";

        const name = profile.name ? `, ${profile.name}` : "";
        const intro = `I'm Sanjay's AI assistant. ${greeting}${name} How can I help you explore his portfolio today?`;
        
        this.addMessage(intro, 'ai');
    }

    getUserProfile() {
        const saved = localStorage.getItem(this.userProfileKey);
        return saved ? JSON.parse(saved) : { name: null, interests: [] };
    }

    updateUserProfile(updates) {
        const current = this.getUserProfile();
        const updated = { ...current, ...updates };
        localStorage.setItem(this.userProfileKey, JSON.stringify(updated));
    }

    render() {
        const botHTML = `
            <div class="chatbot-container">
                <button class="chatbot-toggle" id="botToggle">
                    <i class="fa-solid fa-robot"></i>
                </button>
                <div class="chat-window" id="chatWindow">
                    <div class="chat-header">
                        <div class="chat-avatar">
                            <i class="fa-solid fa-brain"></i>
                        </div>
                        <div class="chat-info">
                            <h3>Sanjay AI</h3>
                            <div class="chat-status">
                                <span class="status-dot"></span>
                                <span id="statusText">Online & Learning</span>
                            </div>
                        </div>
                        <div class="chat-header-actions">
                            <button class="chat-action-btn" id="voiceToggle" title="Toggle Voice Response">
                                <i class="fa-solid ${this.isVoiceEnabled ? 'fa-volume-high' : 'fa-volume-xmark'}"></i>
                            </button>
                            <button class="chat-action-btn" id="chatClear" title="Clear Conversation">
                                <i class="fa-solid fa-rotate-right"></i>
                            </button>
                        </div>
                    </div>
                    <div class="chat-messages" id="chatMessages"></div>
                    <div class="chat-suggestions" id="chatSuggestions"></div>
                    <div class="typing-indicator" id="typingIndicator" style="display: none;">
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                    </div>
                    <div class="chat-input-area">
                        <button class="chat-mic" id="voiceInput" title="Voice Input">
                            <i class="fa-solid fa-microphone"></i>
                        </button>
                        <input type="text" class="chat-input" id="chatInput" placeholder="Type a message..." autocomplete="off">
                        <button class="chat-send" id="chatSend">
                            <i class="fa-solid fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', botHTML);
    }

    cacheDOM() {
        this.container = document.querySelector('.chatbot-container');
        this.toggle = document.getElementById('botToggle');
        this.window = document.getElementById('chatWindow');
        this.messagesContainer = document.getElementById('chatMessages');
        this.input = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('chatSend');
        this.clearBtn = document.getElementById('chatClear');
        this.voiceToggle = document.getElementById('voiceToggle');
        this.voiceInputBtn = document.getElementById('voiceInput');
        this.suggestionsContainer = document.getElementById('chatSuggestions');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.statusText = document.getElementById('statusText');
        
        // Custom cursor interaction synergy
        const botElements = [
            this.toggle, this.sendBtn, this.input, this.clearBtn, 
            this.voiceToggle, this.voiceInputBtn, this.suggestionsContainer
        ];
        
        botElements.forEach(el => {
            if (!el) return;
            el.addEventListener('mouseenter', () => {
                const outline = document.querySelector('[data-cursor-outline]');
                if (outline) {
                    outline.style.width = '60px';
                    outline.style.height = '60px';
                    outline.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    outline.style.borderColor = 'var(--accent)';
                }
            });
            el.addEventListener('mouseleave', () => {
                const outline = document.querySelector('[data-cursor-outline]');
                if (outline) {
                    outline.style.width = '32px';
                    outline.style.height = '32px';
                    outline.style.backgroundColor = 'transparent';
                    outline.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                }
            });
        });
    }

    bindEvents() {
        this.toggle.addEventListener('click', () => this.toggleChat());
        this.sendBtn.addEventListener('click', () => this.handleUserInput());
        this.clearBtn.addEventListener('click', () => this.clearHistory());
        this.voiceToggle.addEventListener('click', () => this.toggleVoice());
        this.voiceInputBtn.addEventListener('click', () => this.startVoiceInput());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleUserInput();
        });
        
        // Close on escape
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) this.toggleChat();
        });

        this.renderSuggestions();
    }

    toggleVoice() {
        this.isVoiceEnabled = !this.isVoiceEnabled;
        localStorage.setItem('bot_voice_enabled', this.isVoiceEnabled);
        this.voiceToggle.innerHTML = `<i class="fa-solid ${this.isVoiceEnabled ? 'fa-volume-high' : 'fa-volume-xmark'}"></i>`;
        
        if (!this.isVoiceEnabled) {
            window.speechSynthesis.cancel();
        }
    }

    speak(text) {
        if (!this.isVoiceEnabled) return;
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Female')) || voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;
        
        window.speechSynthesis.speak(utterance);
    }

    startVoiceInput() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            this.addMessage("Sorry, your browser doesn't support voice recognition.", 'ai');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        this.voiceInputBtn.classList.add('recording');
        this.voiceInputBtn.innerHTML = '<i class="fa-solid fa-microphone-lines fa-beat"></i>';
        
        recognition.start();

        recognition.onresult = (event) => {
            const speechResult = event.results[0][0].transcript;
            this.input.value = speechResult;
            this.handleUserInput();
        };

        recognition.onspeechend = () => {
            recognition.stop();
            this.voiceInputBtn.classList.remove('recording');
            this.voiceInputBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.voiceInputBtn.classList.remove('recording');
            this.voiceInputBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
        };
    }

    renderSuggestions(customSuggestions = null) {
        this.suggestionsContainer.innerHTML = '';
        const items = customSuggestions || this.knowledge.suggestions;
        items.forEach(suggestion => {
            const chip = document.createElement('button');
            chip.className = 'suggestion-chip';
            chip.textContent = suggestion;
            chip.addEventListener('click', () => {
                this.input.value = suggestion;
                this.handleUserInput();
            });
            this.suggestionsContainer.appendChild(chip);
        });
    }

    clearHistory() {
        const result = confirm('Clear chat history?');
        if (result) {
            this.messages = [];
            localStorage.removeItem(this.memoryKey);
            localStorage.removeItem(this.userProfileKey);
            this.renderMessages();
            this.addMessage("Everything has been reset. How can I assist you now?", 'ai');
        }
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.window.classList.toggle('active');
        this.toggle.classList.toggle('active');
        if (this.isOpen) {
            this.input.focus();
            this.toggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        } else {
            this.toggle.innerHTML = '<i class="fa-solid fa-robot"></i>';
        }
    }

    loadMemory() {
        const saved = localStorage.getItem(this.memoryKey);
        this.messages = saved ? JSON.parse(saved) : [];
    }

    saveMemory() {
        localStorage.setItem(this.memoryKey, JSON.stringify(this.messages));
    }

    addMessage(text, sender) {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const message = { text, sender, timestamp };
        this.messages.push(message);
        this.renderSingleMessage(message);
        this.saveMemory();
        this.scrollToBottom();
    }

    renderSingleMessage(msg) {
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${msg.sender}`;
        messageEl.innerHTML = `
            ${msg.text}
            <span class="message-time">${msg.timestamp}</span>
        `;
        this.messagesContainer.appendChild(messageEl);
    }

    renderMessages() {
        this.messagesContainer.innerHTML = '';
        this.messages.forEach(msg => this.renderSingleMessage(msg));
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    showTyping() {
        this.typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    }

    hideTyping() {
        this.typingIndicator.style.display = 'none';
    }

    async setStatus(text, duration = 2000) {
        this.statusText.textContent = text;
        this.statusText.classList.add('flicker');
        setTimeout(() => {
            this.statusText.textContent = "Online & Learning";
            this.statusText.classList.remove('flicker');
        }, duration);
    }

    async handleUserInput() {
        const text = this.input.value.trim();
        if (!text) return;

        this.input.value = '';
        this.addMessage(text, 'user');
        this.suggestionsContainer.style.display = 'none';

        this.showTyping();
        await this.setStatus("Thinking...");
        
        // Advanced simulated logic
        setTimeout(async () => {
            await this.setStatus("Synthesizing...");
            setTimeout(() => {
                const response = this.generateResponse(text);
                this.hideTyping();
                this.addMessage(response, 'ai');
                this.speak(response);
                this.suggestionsContainer.style.display = 'flex';
                this.updateContext(text);
            }, 800);
        }, 800);
    }

    updateContext(input) {
        const lower = input.toLowerCase();
        if (lower.includes('project')) this.context.lastTopic = 'projects';
        else if (lower.includes('skill')) this.context.lastTopic = 'skills';
        else if (lower.includes('contact')) this.context.lastTopic = 'contact';
        
        this.context.interactions++;
        
        // Dynamic suggestions based on context
        if (this.context.lastTopic === 'projects') {
            this.renderSuggestions(["Tell me about the Task Manager", "Show portfolio tech stack", "What's the DSA repo?"]);
        } else if (this.context.lastTopic === 'skills') {
            this.renderSuggestions(["Do you know Python?", "What's Gen AI experience?", "Any ServiceNow certs?"]);
        } else {
            this.renderSuggestions();
        }
    }

    generateResponse(rawInput) {
        const input = rawInput.toLowerCase();
        const profile = this.getUserProfile();
        
        // Memory: Name extraction
        if (input.includes('my name is') || input.includes("i'm ") || (input.includes("i am ") && !input.includes("searching"))) {
            const name = rawInput.split(/is |i'm |i am /i).pop().trim();
            this.updateUserProfile({ name });
            return `Pleasure to meet you, ${name}! I've added that to my memory. I can now personalize my answers for you. What would you like to know about Sanjay's work?`;
        }

        const userName = profile.name ? profile.name : '';
        const personalPrefix = userName ? `${userName}, ` : '';

        // Context-aware follow-ups
        if (this.context.lastTopic === 'projects' && (input.includes('tech') || input.includes('use') || input.includes('built with'))) {
            return `Sanjay primarily used Python, Flask, and AI models (NLP) for his projects, especially for the ResumeAI. He also uses Docker for containerization across the board.`;
        }

        // Specific project detail
        if (input.includes('resumeai') || input.includes('resume ai') || input.includes('ats')) {
            this.context.lastTopic = 'projects';
            const p = this.knowledge.projects[0];
            return `${personalPrefix}ResumeAI is one of Sanjay's best works! It's a ${p.desc} Built using ${p.tech.join(', ')}. Would you like to know about the ATS scoring logic?`;
        }

        if (input.includes('ats scoring') || input.includes('logic')) {
            return `The ATS scoring uses a 6-factor model: structure, keywords, contact info, achievements, length, and job description alignment. It even uses TF-IDF cosine similarity for matching!`;
        }

        // Statistics query
        if (input.includes('gpa') || input.includes('grade') || input.includes('cgpa')) {
            return `${personalPrefix}Sanjay maintains a strong academic record with a GPA of ${this.knowledge.stats.gpa} at Mohan Babu University.`;
        }

        if (input.includes('dsa') || input.includes('problem') || input.includes('leetcode')) {
            return `${personalPrefix}Sanjay has solved over ${this.knowledge.stats.dsa} DSA problems, documenting them all in a structured repository. He's very comfortable with Algorithms and Data Structures.`;
        }

        // Skills & Gen AI
        if (input.includes('gen ai') || input.includes('generative ai')) {
            return `Sanjay is currently specializing in Gen AI Software Engineering. He understands LLM integration, prompt engineering, and building AI-driven solutions like myself!`;
        }

        if (input.includes('skill') || input.includes('tech') || input.includes('language')) {
            return `${personalPrefix}Sanjay's core stack includes ${this.knowledge.skills.join(', ')}. He's particularly expert in Backend (Python/Flask) and Cloud (Docker).`;
        }

        // Projects
        if (input.includes('project') || input.includes('work') || input.includes('build')) {
            const projects = this.knowledge.projects.map(p => p.title).join(', ');
            return `Sanjay has worked on several projects, including: ${projects}. Which one should I tell you more about?`;
        }

        if (input.includes('task manager') || input.includes('api')) {
            const p = this.knowledge.projects[0];
            return `The ${p.title} is a RESTful API built with ${p.tech.join(', ')}. It features containerization with Docker which reduced environment setup time by 60%.`;
        }

        // Experience
        if (input.includes('experience') || input.includes('job') || input.includes('intern')) {
            return `Sanjay's background includes being a Python Developer Intern at CodSoft and a Peer Technical Mentor. He's also a Certified ServiceNow Developer.`;
        }

        // Contact
        if (input.includes('contact') || input.includes('email') || input.includes('reach')) {
            return `You can reach Sanjay at ${this.knowledge.contact.email} or find him on LinkedIn at ${this.knowledge.contact.linkedin}. He's very responsive!`;
        }

        // Greetings
        if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
            return `Hello${userName ? ' ' + userName : ''}! I'm Sanjay's AI. I can tell you about his ${this.knowledge.stats.projects}+ projects, ${this.knowledge.stats.dsa}+ DSA solutions, or his experience as an engineer. What's on your mind?`;
        }

        // Jokes
        if (input.includes('joke')) {
            const jokes = [
                "Why do programmers prefer dark mode? Because light attracts bugs!",
                "A SQL query walks into a bar, walks up to two tables, and asks... 'Can I join you?'",
                "How many programmers does it take to change a light bulb? None, that's a hardware problem."
            ];
            return jokes[Math.floor(Math.random() * jokes.length)];
        }

        // Fallback with intelligence
        if (this.context.interactions > 5) {
            return `You seem interested in Sanjay's work! Would you like to know about his latest internship at CodSoft or his certifications?`;
        }

        return `That's a great question. While I'm still learning, I can definitely tell you about Sanjay's 8.6 GPA, his Backend skills, or his 15+ main projects. What interests you the most?`;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.sanjayBot = new SanjayBot();
});
