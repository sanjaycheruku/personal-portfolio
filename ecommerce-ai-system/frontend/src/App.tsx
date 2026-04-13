import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import ChatDrawer from './components/ChatDrawer';
import { Sparkles, Loader2, Bot, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from './data/products';
import type { Product } from './data/products';
import { getEmbedding, cosineSimilarity } from './services/aiService';

function App() {
  const [displayProducts, setDisplayProducts] = useState<Product[]>(products);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [productEmbeddings, setProductEmbeddings] = useState<Record<number, number[]>>({});
  const [aiStatus, setAiStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  
  // Cart & Chat State
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Initialize AI and pre-calculate product embeddings
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const embeddings: Record<number, number[]> = {};
        for (const product of products) {
          const emb = await getEmbedding(product.description);
          embeddings[product.id] = emb;
        }
        setProductEmbeddings(embeddings);
        setAiStatus('ready');
      } catch (err) {
        console.error("AI Initialization failed:", err);
        setAiStatus('error');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Handle Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        performAISearch();
      } else {
        setDisplayProducts(products);
      }
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, aiStatus]);

  const performAISearch = async () => {
    if (aiStatus !== 'ready') return;
    
    try {
      setIsSearching(true);
      const queryEmb = await getEmbedding(searchQuery);
      
      const scoredProducts = products.map(p => {
        const sim = cosineSimilarity(queryEmb, productEmbeddings[p.id] || []);
        return { ...p, score: sim };
      });
      
      const filtered = scoredProducts
        .filter(p => (p as any).score > 0.15)
        .sort((a, b) => (b as any).score - (a as any).score);
      
      setDisplayProducts(filtered);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const addToCart = (product: Product) => {
    setCartItems(prev => [...prev, product]);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prev => {
        const index = prev.findIndex(p => p.id === productId);
        if (index === -1) return prev;
        const newItems = [...prev];
        newItems.splice(index, 1);
        return newItems;
    });
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-primary-500/30">
      <Navbar onCartClick={() => setIsCartOpen(true)} cartCount={cartItems.length} />
      
      <main>
        <Hero onSearch={setSearchQuery} searchQuery={searchQuery} />

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 glass-card flex items-center justify-center bg-primary-500/10 border-primary-500/20 shadow-[0_0_20px_rgba(14,165,233,0.15)]">
                <Sparkles className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  {searchQuery ? `AI Results for "${searchQuery}"` : "Neural Recommendations"}
                </h2>
                <p className="text-sm text-gray-500">
                  {aiStatus === 'loading' ? 'Initializing AI Engine...' : 'Semantically optimized for your needs'}
                </p>
              </div>
            </div>
            
            <div className={`flex items-center gap-2 px-4 py-2 border rounded-xl shadow-lg transition-all duration-500 ${
              aiStatus === 'ready' ? 'bg-green-500/5 border-green-500/20 text-green-400' : 
              aiStatus === 'error' ? 'bg-red-500/5 border-red-500/20 text-red-400' : 
              'bg-blue-500/5 border-blue-500/20 text-blue-400'
            }`}>
              {aiStatus === 'loading' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : aiStatus === 'ready' ? (
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {aiStatus === 'ready' ? 'Neural Engine: Ready' : 
                 aiStatus === 'error' ? 'Neural Engine: Offline' : 
                 'Neural Engine: Synchronizing'}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-500/30 blur-3xl rounded-full scale-150 animate-pulse" />
                <Bot className="w-16 h-16 text-primary-500 relative z-10 animate-float" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                  Booting Neural Search...
                </p>
                <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10 mx-auto">
                  <motion.div 
                    className="h-full bg-primary-500 shadow-[0_0_10px_#0ea5e9]"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 15, ease: "linear" }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              <AnimatePresence mode='popLayout'>
                {isSearching ? (
                  <motion.div 
                    key="searching"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-20 gap-4"
                  >
                    <div className="relative">
                      <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                      <div className="absolute inset-0 bg-primary-500/20 blur-xl animate-pulse" />
                    </div>
                    <p className="text-gray-500 font-medium animate-pulse">Analyzing catalog patterns...</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                  >
                    {displayProducts.map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onAddToCart={addToCart}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {!loading && !isSearching && displayProducts.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-32 glass-card bg-transparent border-dashed border-white/5"
                >
                  <AlertCircle className="w-8 h-8 text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No semantic matches found in our neural network.</p>
                  <button onClick={() => setSearchQuery('')} className="text-primary-400 text-sm mt-2 hover:underline">Reset Search</button>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </main>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems}
        onRemove={removeFromCart}
      />

      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onSearch={setSearchQuery}
      />

      {/* Floating AI Assistant Toggle */}
      <button 
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-primary-500 text-white rounded-2xl shadow-[0_0_30px_rgba(14,165,233,0.4)] flex items-center justify-center hover:scale-110 transition-all hover:shadow-primary-500/60 active:scale-95 z-50 group border border-white/20"
      >
        <Bot className="w-8 h-8 group-hover:after:content-['*']" />
        <div className="absolute right-full mr-4 px-4 py-2 glass-card bg-black/80 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 pointer-events-none">
          Neural Shopping Assistant
        </div>
      </button>
    </div>
  );
}

export default App;
