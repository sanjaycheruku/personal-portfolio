let currentSessionId = null;

// Initialize highlight.js for marked.js
marked.setOptions({
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
    },
    breaks: true
});

document.addEventListener("DOMContentLoaded", () => {
    // Navigate strictly to first available session, or trigger new chat
    const firstSession = document.querySelector("#sessionList > div");
    if (firstSession) {
        firstSession.click();
    } else {
        document.getElementById("newChatBtn").click();
    }
    
    // Auto-resize message input logic
    const textarea = document.getElementById("messageInput");
    textarea.addEventListener("input", function() {
        this.style.height = "auto";
        this.style.height = Math.min(this.scrollHeight, 160) + "px"; // max limit height
        
        const btn = document.getElementById("sendBtn");
        if (this.value.trim() !== "") {
            btn.disabled = false;
        } else {
            btn.disabled = true;
        }
    });

    // Enter to submit
    textarea.addEventListener("keydown", function(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if(!document.getElementById("sendBtn").disabled) {
                document.getElementById("chatForm").dispatchEvent(new Event("submit"));
            }
        }
    });

    // Setup global event delegation for copy buttons
    document.addEventListener("click", function(e) {
        if(e.target.closest(".copy-code-btn")) {
            const btn = e.target.closest(".copy-code-btn");
            const codeBlock = btn.parentElement.nextElementSibling;
            if(codeBlock) {
                const codeText = codeBlock.innerText;
                navigator.clipboard.writeText(codeText).then(() => {
                    const icon = btn.querySelector("i");
                    const originalClass = icon.className;
                    icon.className = "fa-solid fa-check text-green-500";
                    setTimeout(() => {
                        icon.className = originalClass;
                    }, 2000);
                });
            }
        }
    });
});

window.setInitialPrompt = (txt) => {
    const i = document.getElementById("messageInput");
    i.value = txt;
    i.dispatchEvent(new Event('input'));
    i.focus();
};

document.getElementById("newChatBtn").addEventListener("click", async () => {
    const mode = document.getElementById("chatMode").value;
    
    const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode })
    });
    const data = await res.json();
    currentSessionId = data.session_id;
    
    // UI Update sidebar
    const sessionList = document.getElementById("sessionList");
    const div = document.createElement("div");
    div.className = "group flex items-center justify-between p-3 rounded-xl hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-sm cursor-pointer transition-all bg-white border-gray-200 shadow-sm";
    div.onclick = () => loadSession(currentSessionId);
    div.innerHTML = `
        <div class="flex items-center gap-3 overflow-hidden">
            <i class="fa-regular fa-message text-next-primary"></i>
            <span class="truncate text-sm font-bold text-gray-800">New Chat</span>
        </div>
        <button onclick="deleteSession('${currentSessionId}', event)" class="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 ml-2 shrink-0">
            <i class="fa-solid fa-trash-can text-sm"></i>
        </button>
    `;
    
    // clear active states
    Array.from(sessionList.children).forEach(c => {
        c.classList.remove("bg-white", "border-gray-200", "shadow-sm");
        c.classList.add("border-transparent");
        c.querySelector('i.fa-message').classList.replace("text-next-primary", "text-gray-400");
        c.querySelector('span').classList.remove("font-bold", "text-gray-800");
    });
    
    sessionList.prepend(div);
    
    // Clear Main Chat Container
    document.getElementById("chatContainer").innerHTML = `
        <div class="flex flex-col items-center justify-center h-full text-center space-y-6 animate-fade-in" id="welcomeScreen">
            <div class="w-24 h-24 bg-white shadow-sm border border-gray-100 rounded-[2rem] flex items-center justify-center mb-2">
                <img src="https://cdn-icons-png.flaticon.com/512/11624/11624021.png" class="w-14 h-14" alt="ChatBot logo">
            </div>
            <h3 class="text-3xl font-bold text-gray-800 tracking-tight">How can I help you today?</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mt-8">
                <button class="suggestion-btn p-5 border border-gray-200 rounded-2xl text-left bg-white hover:border-next-primary hover:shadow-md transition-all text-sm group" onclick="setInitialPrompt('Explain how Next.js Server Components work.')">
                    <h4 class="font-bold text-gray-800 flex justify-between items-center mb-1">
                        Code Explanation <i class="fa-solid fa-arrow-right text-gray-300 group-hover:text-next-primary"></i>
                    </h4>
                    <p class="text-gray-500 line-clamp-2 mt-1">Explain how Next.js Server Components work.</p>
                </button>
                <button class="suggestion-btn p-5 border border-gray-200 rounded-2xl text-left bg-white hover:border-next-primary hover:shadow-md transition-all text-sm group" onclick="setInitialPrompt('Design a high-level system architecture for a real-time chat application.')">
                    <h4 class="font-bold text-gray-800 flex justify-between items-center mb-1">
                        System Design <i class="fa-solid fa-arrow-right text-gray-300 group-hover:text-next-primary"></i>
                    </h4>
                    <p class="text-gray-500 line-clamp-2 mt-1">Design a high-level architecture for a chat app.</p>
                </button>
            </div>
        </div>
    `;
    
    document.getElementById("currentChatTitle").innerText = "New Chat";
    
    if(window.innerWidth < 768) {
        document.getElementById("closeSidebar").click();
    }
});

async function loadSession(sessionId) {
    currentSessionId = sessionId;
    
    // Visual Highlight sidebar
    const sessionList = document.getElementById("sessionList");
    Array.from(sessionList.children).forEach(c => {
         if(c.onclick.toString().includes(sessionId)) {
             c.classList.add("bg-white", "border-gray-200", "shadow-sm");
             c.classList.remove("border-transparent");
             c.querySelector('i.fa-message').classList.replace("text-gray-400", "text-next-primary");
             c.querySelector('span').classList.add("font-bold", "text-gray-800");
         } else {
             c.classList.remove("bg-white", "border-gray-200", "shadow-sm");
             c.classList.add("border-transparent");
             c.querySelector('i.fa-message').classList.replace("text-next-primary", "text-gray-400");
             c.querySelector('span').classList.remove("font-bold", "text-gray-800");
         }
    });

    const res = await fetch(\`/api/sessions/\${sessionId}\`);
    if(!res.ok) return;
    const data = await res.json();
    
    document.getElementById("currentChatTitle").innerText = data.title;
    document.getElementById("chatMode").value = data.mode;
    
    const container = document.getElementById("chatContainer");
    container.innerHTML = "";
    
    if (data.messages.length > 0) {
        data.messages.forEach(msg => appendMessage(msg.role, msg.content));
    }
    
    if(window.innerWidth < 768) {
        document.getElementById("closeSidebar").click();
    }
}

async function deleteSession(sessionId, event) {
    event.stopPropagation();
    if(confirm("Are you sure you want to delete this chat history?")) {
        await fetch(\`/api/sessions/\${sessionId}\`, { method: "DELETE" });
        location.reload();
    }
}

// Function to add copy code buttons to marked js output
function enhanceMarkdownOutput(html) {
    // We add a wrapper to pre tags to support a header
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const pres = doc.querySelectorAll('pre');
    pres.forEach(pre => {
        const code = pre.querySelector('code');
        if(!code) return;
        
        let language = 'text';
        code.classList.forEach(cls => {
            if(cls.startsWith('language-')) language = cls.replace('language-', '');
        });

        // Add NextChat-style header
        const header = document.createElement('div');
        header.className = 'w-full bg-[#eef0f4] text-[#4e586b] px-4 py-2 flex items-center justify-between text-xs font-semibold rounded-t-xl border-b border-gray-200';
        header.innerHTML = \`
            <span class="uppercase tracking-wider">\${language}</span>
            <button class="copy-code-btn text-gray-500 hover:text-gray-700 transition flex items-center gap-1.5 active:scale-95">
                <i class="fa-regular fa-copy"></i> Copy
            </button>
        \`;
        
        // Wrap pre element inside a div
        const wrapper = document.createElement('div');
        wrapper.className = 'code-wrapper rounded-xl overflow-hidden border border-gray-200 my-4 shadow-sm bg-[#f8f9fa]';
        
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(header);
        
        // Remove default pre margins and adjust border radius
        pre.style.margin = '0';
        pre.style.border = 'none';
        pre.style.borderRadius = '0 0 0.75rem 0.75rem';
        wrapper.appendChild(pre);
    });
    
    return doc.body.innerHTML;
}

function appendMessage(role, content) {
    const container = document.getElementById("chatContainer");
    
    const msgDiv = document.createElement("div");
    msgDiv.className = \`flex gap-3 md:gap-5 w-full \${role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in mb-6\`;
    
    if (role === 'user') {
        const isDoc = content.startsWith("I've uploaded a document");
        let displayContent = escapeHtml(content);
        
        if(isDoc) {
             const filename = content.split("'")[1];
             displayContent = \`<div class="flex items-center gap-3 bg-white/50 p-2 rounded-xl mb-1 border border-green-200"><i class="fa-solid fa-file-pdf text-red-500 text-2xl"></i> <div><span class="font-bold text-gray-800 block text-sm">\${filename}</span><span class="opacity-80 block text-[11px] text-gray-500 mt-0.5">Uploaded</span></div></div>\`;
        }

        msgDiv.innerHTML = \`
            <div class="max-w-[85%] sm:max-w-[70%] rounded-[1.2rem] rounded-tr-sm px-5 py-3 shadow-sm bg-next-chatUser border border-[#c4eec5]">
                <div class="user-message prose prose-sm md:prose-base max-w-none break-words">
                   \${displayContent}
                </div>
            </div>
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0 shadow-sm border border-white text-white font-bold text-sm">
                U
            </div>
        \`;
    } else {
        const parsedHtml = enhanceMarkdownOutput(marked.parse(content));
        msgDiv.innerHTML = \`
            <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0 shadow-sm border border-gray-200 text-next-primary z-10 overflow-hidden">
                <img src="https://cdn-icons-png.flaticon.com/512/11624/11624021.png" class="w-5 h-5 object-contain" alt="Bot">
            </div>
            <div class="w-full max-w-[90%] sm:max-w-[85%]">
                <div class="prose prose-sm md:prose-base max-w-none markdown-body text-[15px] text-gray-800 leading-relaxed">
                    \${parsedHtml}
                </div>
            </div>
        \`;
    }
    
    container.appendChild(msgDiv);
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    return msgDiv;
}


function appendStreamingMessage() {
    const container = document.getElementById("chatContainer");
    
    const msgDiv = document.createElement("div");
    msgDiv.className = \`flex gap-3 md:gap-5 w-full justify-start mb-6\`;
    
    msgDiv.innerHTML = \`
        <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0 shadow-sm border border-gray-200 text-next-primary z-10 overflow-hidden">
            <img src="https://cdn-icons-png.flaticon.com/512/11624/11624021.png" class="w-5 h-5" alt="Bot">
        </div>
        <div class="w-full max-w-[90%] sm:max-w-[85%] pt-1">
            <div class="prose prose-sm md:prose-base max-w-none markdown-body text-[15px] text-gray-800 leading-relaxed" id="streamingContent">
               <div class="flex gap-1.5 items-center inline-flex bg-gray-100 px-3 py-2 rounded-full border border-gray-200">
                   <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                   <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.15s"></div>
                   <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.3s"></div>
               </div>
            </div>
        </div>
    \`;
    
    container.appendChild(msgDiv);
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    return { div: msgDiv, contentArea: msgDiv.querySelector('#streamingContent') };
}

document.getElementById("chatForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = document.getElementById("messageInput");
    const message = input.value.trim();
    if(!message) return;
    
    if(!currentSessionId) {
        document.getElementById("newChatBtn").click();
        await new Promise(r => setTimeout(r, 600)); 
    }
    
    const welcome = document.getElementById("welcomeScreen");
    if (welcome) welcome.remove();

    appendMessage('user', message);
    input.value = '';
    input.style.height = 'auto'; 
    document.getElementById("sendBtn").disabled = true;
    
    const streamUI = appendStreamingMessage();
    let isFirstChunk = true;
    let accumulatedText = "";
    
    try {
        const response = await fetch(\`/api/chat/\${currentSessionId}\`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });
        
        if(!response.ok) {
            const err = await response.json();
            streamUI.contentArea.innerHTML = \`<div class="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-200 flex gap-2 items-center"><i class="fa-solid fa-triangle-exclamation"></i> \${err.error || 'Server connection error.'}</div>\`;
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        // Handle streaming response formatting
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            accumulatedText += chunk;
            
            if (isFirstChunk) {
                streamUI.contentArea.innerHTML = "";
                isFirstChunk = false;
            }
            
            streamUI.contentArea.innerHTML = enhanceMarkdownOutput(marked.parse(accumulatedText));
            
            // Auto scroll container
            const container = document.getElementById("chatContainer");
            container.scrollTop = container.scrollHeight;
        }
        
        streamUI.contentArea.removeAttribute('id');
        
        // Refresh Title after Generation
        setTimeout(() => {
            fetch(\`/api/sessions/\${currentSessionId}\`)
            .then(r => r.json())
            .then(data => {
                document.getElementById("currentChatTitle").innerText = data.title;
                 const sessionList = document.getElementById("sessionList");
                 const el = Array.from(sessionList.children).find(c => c.onclick.toString().includes(currentSessionId));
                 if(el) {
                     el.querySelector('span').innerText = data.title;
                 }
            });
        }, 1500);

    } catch (err) {
        streamUI.contentArea.innerHTML = \`<div class="text-red-500 font-medium px-4 py-2 border border-red-200 bg-red-50 rounded-lg inline-block"><i class="fa-solid fa-triangle-exclamation"></i> Network Error</div>\`;
    }
});

document.getElementById("fileInput").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    
    if(file.type !== "application/pdf") {
        alert("Only PDF format is supported for documents at this time.");
        return;
    }
    
    if(!currentSessionId) {
        document.getElementById("newChatBtn").click();
        await new Promise(r => setTimeout(r, 600)); 
    }

    const formData = new FormData();
    formData.append("file", file);
    
    const prog = document.getElementById("uploadProgress");
    prog.classList.remove("hidden");
    prog.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Reading PDF...';
    
    try {
        const response = await fetch(\`/api/upload/\${currentSessionId}\`, {
            method: "POST",
            body: formData
        });
        
        if (response.ok) {
            // refresh active chat
            await loadSession(currentSessionId);
            prog.innerHTML = '<i class="fa-solid fa-check text-green-500"></i> Success!';
            setTimeout(() => prog.classList.add("hidden"), 1500);
        } else {
            const err = await response.json();
            alert(\`Process failed: \${err.detail}\`);
            prog.classList.add("hidden");
        }
    } catch(err) {
        alert("Upload network error.");
        prog.classList.add("hidden");
    } finally {
        e.target.value = ''; 
    }
});

// utils
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

// Sidebar Interactive UI
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("sidebarOverlay");

document.getElementById("openSidebar").addEventListener("click", () => {
    sidebar.classList.remove("-translate-x-full");
    overlay.classList.remove("hidden");
});

document.getElementById("closeSidebar").addEventListener("click", () => {
    sidebar.classList.add("-translate-x-full");
    overlay.classList.add("hidden");
});

overlay.addEventListener("click", () => {
    sidebar.classList.add("-translate-x-full");
    overlay.classList.add("hidden");
});
