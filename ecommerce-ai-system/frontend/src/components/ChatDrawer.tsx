import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Sparkles, User, ShoppingBag } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'ai' | 'user';
  timestamp: Date;
}

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

const ChatDrawer: React.FC<ChatDrawerProps> = ({ isOpen, onClose, onSearch }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI Shopping Assistant. Describe what you're looking for, and I'll find the perfect match from our neural catalog.",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    onSearch(input); // Sync with main search

    // AI "Processing" response
    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: `I've analyzed our catalog for "${input}". I'm showing the most semantically relevant products in the background. Is there anything specific about these results you'd like to know?`,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setInput('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-zinc-950 border-l border-white/10 z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-primary-500/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Neural Assistant</h2>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Active</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                title="Close Assistant"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      msg.sender === 'ai' ? 'bg-primary-500/20 text-primary-400' : 'bg-white/10 text-gray-400'
                    }`}>
                      {msg.sender === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === 'ai' 
                          ? 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none' 
                          : 'bg-primary-500 text-white rounded-tr-none'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-gray-600 mt-1 block">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-6 border-t border-white/10">
              <div className="flex items-center gap-2 mb-3">
                 <Sparkles className="w-3 h-3 text-primary-400" />
                 <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Try: "Something to boost focus"</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pr-12 focus:outline-none focus:border-primary-500/50 transition-colors text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="absolute right-2 top-2 p-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:hover:bg-primary-500 text-white rounded-lg transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatDrawer;
