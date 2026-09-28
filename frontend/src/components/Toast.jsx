import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Toast = () => {
  const { toastMessage } = useApp();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#10251A] light:bg-[#FFFDF7] border border-[#C9A227]/60 text-[#FFFDF7] light:text-[#173B2B] shadow-2xl backdrop-blur-md"
        >
          <div className="p-1 rounded-full bg-[#C9A227]/20 text-[#C9A227]">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">{toastMessage}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
