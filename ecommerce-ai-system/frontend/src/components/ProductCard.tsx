import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Heart, Sparkles, MessageSquare, Gauge } from 'lucide-react';
import type { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="glass-card overflow-hidden group hover:border-white/20 transition-all duration-500 flex flex-col h-full bg-white/5 border border-white/10"
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-900">
        <img 
          src={product.image_url} 
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <div className={`px-2 py-1 rounded-lg backdrop-blur-xl border flex items-center gap-1.5 ${
                product.ai_rating > 95 ? 'bg-primary-500/20 border-primary-500/50' : 'bg-white/5 border-white/10'
            }`}>
              <Gauge className={`w-3 h-3 ${product.ai_rating > 95 ? 'text-primary-400' : 'text-gray-400'}`} />
              <span className="text-[10px] font-bold text-white tracking-widest uppercase">{product.ai_rating}% AI Match</span>
            </div>

            <button className="p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/20 transition-colors">
              <Heart className="w-4 h-4 text-white" />
            </button>
        </div>

        {product.id % 2 === 0 && (
          <div className="absolute bottom-4 left-4 px-3 py-1 bg-primary-500/80 backdrop-blur-md rounded-full flex items-center gap-1.5 shadow-lg shadow-primary-500/20">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Neural Choice</span>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary-400">{product.category}</span>
          <span className="text-xl font-bold tracking-tight">${product.price}</span>
        </div>
        
        <h3 className="text-xl font-bold mb-3 group-hover:text-primary-300 transition-colors tracking-tight">{product.name}</h3>
        
        <p className="text-sm text-gray-500 mb-6 leading-relaxed line-clamp-2 font-medium">
          {product.description}
        </p>

        {/* AI Insight Section */}
        <div className="mt-auto space-y-4">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    <MessageSquare className="w-3 h-3 text-primary-500" />
                    AI Review Sentiment
                </div>
                <div className="flex gap-1.5 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500/70" style={{ width: '85%' }} />
                    <div className="h-full bg-yellow-500/50" style={{ width: '10%' }} />
                    <div className="h-full bg-red-500/50" style={{ width: '5%' }} />
                </div>
                <p className="text-[10px] text-gray-400 italic font-medium leading-tight">
                    "Highly consistent performance with exceptional user satisfaction in the {product.category} sector."
                </p>
            </div>

            <button 
              onClick={() => onAddToCart(product)}
              className="w-full py-4 bg-white/5 hover:bg-primary-500 text-white border border-white/10 rounded-2xl flex items-center justify-center gap-2 transition-all duration-500 font-bold group/btn shadow-xl shadow-transparent hover:shadow-primary-500/20 active:scale-95"
            >
              <Plus className="w-5 h-5 group-hover/btn:rotate-90 transition-transform duration-500" />
              Add to Collection
            </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
