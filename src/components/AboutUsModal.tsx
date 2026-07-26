import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
// 1. Image ko local asset ke taur par import karein
import founderImg from '../assets/founder.png'; 

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutUsModal: React.FC<AboutUsModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 md:p-8 bg-black/90 backdrop-blur-md overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-full md:max-w-[95vw] lg:max-w-[90vw] xl:max-w-[85vw] my-auto bg-[#2b221a] rounded-2xl md:rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.95)] overflow-hidden border border-white/5"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-40 p-2.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white transition-all duration-200 cursor-pointer shadow-lg backdrop-blur-md"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Wrapper */}
            <div className="w-full h-full flex items-center justify-center bg-[#2b221a]">
              <img
                src={founderImg} // 2. Yahan imported variable use karein
                alt="About Our Founder"
                className="w-full h-auto max-h-[92vh] md:max-h-[90vh] object-contain select-none"
                loading="eager"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

AboutUsModal.displayName = 'AboutUsModal';