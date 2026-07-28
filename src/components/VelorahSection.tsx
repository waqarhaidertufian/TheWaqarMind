import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useLazyVideo } from '../hooks/useLazyVideo';

interface VelorahSectionProps {
  onOpenLibrary?: () => void;
}

export const VelorahSection: React.FC<VelorahSectionProps> = React.memo(({ onOpenLibrary }) => {
  const { videoRef, isIntersecting, shouldDisableVideo } = useLazyVideo({ rootMargin: '200px' });

  return (
    <section id="velorah" className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#020b14] text-white">
      {/* Fullscreen Video Background */}
      {!shouldDisableVideo ? (
        <video
          ref={videoRef}
          autoPlay={isIntersecting}
          loop
          muted
          playsInline
          preload={isIntersecting ? 'auto' : 'metadata'}
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%230d1218'/%3E%3Cstop offset='100%25' style='stop-color:%2305080c'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23g)'/%3E%3C/svg%3E"
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
            type="video/mp4"
          />
        </video>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#020b14] to-[#0a1520] z-0" />
      )}

      {/* Dark tint gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 z-0 pointer-events-none" />

      {/* Hero Section Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-32 pb-40 py-[90px] max-w-7xl mx-auto my-auto">
        {/* Glowing Premium Library Button */}
        {onOpenLibrary && (
          <motion.button
            type="button"
            onClick={onOpenLibrary}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="group relative mb-8 inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-[#E1E0CC]/40 hover:border-[#E1E0CC] text-[#E1E0CC] text-xs sm:text-sm font-semibold tracking-wide shadow-[0_0_25px_rgba(225,224,204,0.3)] hover:shadow-[0_0_40px_rgba(225,224,204,0.6)] transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Pulsing ambient glow outline */}
            <motion.span
              className="absolute -inset-1 rounded-full bg-[#E1E0CC]/25 blur-md -z-10"
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.35, 0.75, 0.35],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Gradient shine overlay */}
            <span className="absolute inset-0 bg-gradient-to-r from-amber-100/0 via-amber-100/20 to-amber-100/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <BookOpen className="w-4 h-4 text-[#E1E0CC] group-hover:scale-110 transition-transform duration-300" />
            <span className="font-serif italic text-sm sm:text-base">Digital Library</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          </motion.button>
        )}

        <h1
          className="text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-7xl font-normal text-white animate-fade-rise"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Where{' '}
          <em className="not-italic text-zinc-400 font-serif">dreams</em> rise{' '}
          <em className="not-italic text-zinc-400 font-serif">
            through the silence.
          </em>
        </h1>

        <p className="text-zinc-200 text-xs sm:text-sm md:text-base max-w-xl sm:max-w-2xl mt-6 leading-relaxed animate-fade-rise-delay font-sans tracking-wide">
          Raftaar dheemi ho toh parwah nahi, bas zamaane ke shor mein apna raasta mat khona.
          <br />
          Muqabla kisi aur se nahi, khud se hai—
          <br />
          tumhaara aaj, tumhaare kal se behtar hona chahiye.
        </p>
      </div>

      {/* Bottom spacer */}
      <div className="relative z-10 pb-8" />
    </section>
  );
});

VelorahSection.displayName = 'VelorahSection';

