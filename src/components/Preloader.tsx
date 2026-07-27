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
    const criticalAssets = [
      // Hero video
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4',
      // Liquid hero video
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4',
    ];

    let loadedCount = 0;
    const totalAssets = criticalAssets.length;

    const updateProgress = (loaded: number, total: number) => {
      const percentage = Math.round((loaded / total) * 100);
      setProgress(percentage);
    };

    const loadAsset = (url: string, isVideo: boolean): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (isVideo) {
          const video = document.createElement('video');
          video.preload = 'auto';
          video.muted = true;
          video.playsInline = true;

          const handleCanPlay = () => {
            cleanup();
            resolve();
          };

          const handleError = () => {
            console.warn('Video failed to preload:', url);
            cleanup();
            resolve(); // Continue even if one asset fails
          };

          const cleanup = () => {
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('error', handleError);
            video.src = '';
            video.load();
          };

          video.addEventListener('canplay', handleCanPlay);
          video.addEventListener('error', handleError);
          video.src = url;
          video.load();
        } else {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => {
            console.warn('Image failed to preload:', url);
            resolve(); // Continue even if one asset fails
          };
          img.src = url;
        }
      });
    };

    const loadCriticalAssets = async () => {
      try {
        // Load hero video first (highest priority)
        await loadAsset(criticalAssets[0], true);
        loadedCount++;
        updateProgress(loadedCount, totalAssets);

        // Load liquid hero video
        await loadAsset(criticalAssets[1], true);
        loadedCount++;
        updateProgress(loadedCount, totalAssets);
      } catch (error) {
        console.error('Error loading critical assets:', error);
      }
    };

    // Safety timeout: max 8 seconds
    timeoutRef.current = setTimeout(() => {
      console.log('Preloader safety timeout reached');
      setIsLoading(false);
      onComplete();
    }, 8000);

    loadCriticalAssets().then(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Small delay to show 100% before transition
      setTimeout(() => {
        setIsLoading(false);
        onComplete();
      }, 500);
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
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
