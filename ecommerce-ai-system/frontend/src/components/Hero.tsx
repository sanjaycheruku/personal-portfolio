import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, ArrowRight, Mic, MicOff } from 'lucide-react';

interface HeroProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

const Hero: React.FC<HeroProps> = ({ onSearch, searchQuery }) => {
  const [isListening, setIsListening] = useState(false);

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Voice search is not supported in this browser. Please try Chrome.");
        return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onSearch(transcript);
        setIsListening(false);
    };
    recognition.start();
  };

  return (
    <div className="relative pt-32 pb-20 px-6 overflow-hidden min-h-[85vh] flex items-center justify-center">
      {/* Premium AI Background Image */}
      <div className="absolute inset-0 z-[-2]">
        <img 
          src="C:\Users\cheru\.gemini\antigravity\brain\56f79712-85df-4ae7-95dd-4aae5684bed2\futuristic_ecommerce_hero_1776059532851.png" 
          alt="AI Background" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-transparent to-[#030712]" />
      </div>

      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -z-10 animate-pulse delay-700" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-8 group cursor-default"
        >
          <Sparkles className="w-4 h-4 text-primary-400 group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-medium text-gray-300">Neural Engine v2.0 Live</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-5xl md:text-8xl font-bold mb-8 tracking-tighter leading-[0.9] text-white"
        >
          The Future of <br />
          <span className="premium-gradient-text">Shopping is AI</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
        >
          Search by intent, speak your needs, or chat with our 
          neural assistant to discover future-ready technology.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="relative max-w-2xl mx-auto group"
        >
          <div className="absolute inset-0 bg-primary-500/20 blur-3xl group-focus-within:bg-primary-500/40 transition-all duration-500 rounded-full" />
          <div className="relative flex items-center bg-black/60 backdrop-blur-3xl border border-white/20 rounded-2xl p-2 group-focus-within:border-primary-500/50 transition-all shadow-2xl">
            <Search className="w-6 h-6 text-gray-400 ml-4" />
            <input 
              type="text" 
              placeholder="Describe your perfect tech..."
              className="w-full bg-transparent border-none focus:ring-0 text-white px-4 py-4 text-lg placeholder:text-gray-600 outline-none"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
            />
            
            <button 
                onClick={startVoiceSearch}
                className={`p-3 rounded-xl transition-all mr-2 flex items-center justify-center ${
                    isListening ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-white/10 text-gray-400'
                }`}
                title="Voice Search"
            >
                {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>

            <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0 shadow-lg shadow-primary-500/20 active:scale-95">
              Analyze intent
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {['Cyberpunk Gear', 'Mental Health Tech', 'Next-Gen Audio', 'Workstation AI'].map((tag) => (
              <button 
                key={tag}
                onClick={() => onSearch(tag)}
                className="text-xs font-bold px-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-primary-500/50 hover:bg-white/10 transition-all text-gray-500 hover:text-white uppercase tracking-wider"
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
