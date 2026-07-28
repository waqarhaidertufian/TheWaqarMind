import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail } from 'lucide-react';

interface ToastProps {
  isVisible: boolean;
  onHide: () => void;
}

export const Toast: React.FC<ToastProps> = React.memo(({ isVisible, onHide }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onHide();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-16 right-2 sm:right-8 z-[100] px-2.5 py-2 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] w-[calc(100vw-16px)] sm:w-full max-w-[260px] sm:max-w-sm transition-all duration-300"
        >
          <div className="flex items-start gap-2 sm:gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 flex items-center justify-center transition-all duration-300">
              <Mail className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-red-300 transition-all duration-300" />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-0.5 sm:space-y-1">
              <h3 className="text-[#E1E0CC] font-medium text-[11px] sm:text-sm transition-all duration-300">Subscribe for Updates</h3>
              <p className="text-gray-400 text-[10px] sm:text-xs leading-normal sm:leading-relaxed transition-all duration-300">
                Get notified about <span className="text-white/80">new releases, updates & exclusive content.</span>
              </p>
            </div>
          </div>

          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  );
});

Toast.displayName = 'Toast';
