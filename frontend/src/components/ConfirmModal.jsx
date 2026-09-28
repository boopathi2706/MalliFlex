import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Delete', loading = false }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#10251A] light:bg-white border border-[#2F5D3A]/60 light:border-[#E6E0D2] rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
        >
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-1 rounded-full text-[#A9B8AE] hover:text-white hover:bg-[#173B2B]"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 text-rose-400 mb-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#FFFDF7] light:text-[#173B2B]">{title}</h3>
          </div>

          <p className="text-sm text-[#A9B8AE] light:text-[#527A52] leading-relaxed mb-6 font-light">
            {message}
          </p>

          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-[#A9B8AE] hover:text-white bg-[#173B2B]/40 hover:bg-[#173B2B] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Deleting...' : confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
