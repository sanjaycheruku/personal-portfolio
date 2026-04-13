import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import type { Product } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemove: (id: number) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemove }) => {
  const total = items.reduce((sum, item) => sum + item.price, 0);

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
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary-400" />
                <h2 className="text-xl font-bold">Your Cart</h2>
                <span className="text-sm text-gray-500 ml-2">({items.length} items)</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-gray-500">Your cart is empty.</p>
                  <button onClick={onClose} className="text-primary-400 font-semibold hover:underline">Start Shopping</button>
                </div>
              ) : (
                items.map((item, idx) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={`${item.id}-${idx}`} 
                    className="flex gap-4 group"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-bold text-sm">{item.name}</h3>
                        <button 
                          onClick={() => onRemove(item.id)}
                          className="p-1 text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-1 mb-2">{item.category}</p>
                      <p className="font-bold text-primary-400">${item.price}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 bg-white/5 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-center text-gray-500 text-sm">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary-400">${total.toFixed(2)}</span>
                </div>
                <button className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all group">
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
