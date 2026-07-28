import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = React.memo(({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    let startTimestamp: number;
    let animFrameId: number;
    const duration = 1000; // 1 second visual progress transition

    const animateProgress = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const percentage = Math.min(Math.round((elapsed / duration) * 100), 100);

      setProgress(percentage);

      if (elapsed < duration) {
        animFrameId = requestAnimationFrame(animateProgress);
      } else {
        // Small delay to show 100% before transition
        setTimeout(() => {
          setIsLoading(false);
          onComplete();
        }, 300);
      }
    };

    animFrameId = requestAnimationFrame(animateProgress);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center"
        >
          <div className="text-center space-y-8">
            {/* Logo/Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-2"
            >
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl text-[#E1E0CC] tracking-tight"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                TheWaqarMind
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 tracking-widest uppercase">
                Preparing your experience...
              </p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-64 sm:w-80 space-y-3"
            >
              {/* Percentage */}
              <div className="flex justify-between items-center text-sm text-[#E1E0CC]">
                <span className="font-light">Loading</span>
                <span className="font-medium">{progress}%</span>
              </div>

              {/* Progress Bar */}
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: 'linear' }}
                  className="h-full bg-[#E1E0CC] rounded-full"
                />
              </div>
            </motion.div>
          </div>

          {/* Subtle noise overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-noise" />
        </motion.div>
      )}
    </AnimatePresence>
  );
});

Preloader.displayName = 'Preloader';
