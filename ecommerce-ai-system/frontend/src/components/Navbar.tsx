import React from 'react';
import { ShoppingBag, Search, Sparkles } from 'lucide-react';

interface NavbarProps {
  onCartClick: () => void;
  cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ onCartClick, cartCount }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-card px-8 py-3 bg-black/40">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-[0_0_20px_rgba(14,165,233,0.3)]">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">AI<span className="text-primary-400">Store</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <a href="#" className="hover:text-white transition-colors">Explore</a>
          <a href="#" className="hover:text-white transition-colors">Categories</a>
          <a href="#" className="hover:text-white transition-colors">Best Sellers</a>
          <a href="#" className="hover:text-white transition-colors">AI Picks</a>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative group">
            <Search className="w-5 h-5 text-gray-300" />
            <div className="absolute top-full right-0 mt-2 p-2 glass-card opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-[10px] whitespace-nowrap">
              Semantic Search Active
            </div>
          </button>
          <div className="relative">
            <button 
              onClick={onCartClick}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-gray-300" />
            </button>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full text-[10px] flex items-center justify-center font-bold text-white">
                {cartCount}
              </span>
            )}
          </div>
          <button className="glass-button text-sm font-semibold hidden sm:block hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all">
            Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
