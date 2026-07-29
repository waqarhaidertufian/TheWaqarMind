import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Github, Linkedin, BookOpen, ArrowRight, Globe, Volume2, Music, Mail } from 'lucide-react';
import { WordsPullUp } from './WordsPullUp';

interface HeroSectionProps {
  onOpenLibrary: () => void;
  onOpenAboutUs?: () => void;
  onOpenSubscribe?: () => void;
}

const NAV_ITEMS = [
  { label: 'Library', action: 'library', external: false, icon: BookOpen },
  { label: 'About Us', action: 'about', external: false },
  {
    label: 'GitHub',
    href: 'https://github.com/waqarhaidertufian',
    external: true,
    icon: Github,
    iconOnly: true,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/waqar-haider-063083322/',
    external: true,
    icon: Linkedin,
    iconOnly: true,
  },
  {
    label: 'Portfolio Website',
    href: 'https://waqarhaider.vercel.app/',
    external: true,
    icon: Globe,
    iconOnly: true,
  },
];

const AUDIO_SOURCES = [
  '/audio/YTDowncom-YouTube-Quiet-Forge-De.mp3'
];

export const HeroSection: React.FC<HeroSectionProps> = React.memo(({ onOpenLibrary, onOpenAboutUs, onOpenSubscribe }) => {
  const [activeNav, setActiveNav] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error('Audio playback failed:', err);
          setIsPlaying(false);
        });
    }
  };

  return (
    <section className="h-screen w-full p-4 md:p-6 bg-black flex flex-col relative overflow-hidden box-border">
      {/* Hidden Audio Tag for Hero Sound */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      >
        <source src={AUDIO_SOURCES[0]} type="audio/mp3" />
      </audio>

      {/* Outer rounded inset container */}
      <div className="relative w-full h-full rounded-2xl md:rounded-[2rem] overflow-hidden flex flex-col justify-between">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%231a1a1a'/%3E%3Cstop offset='100%25' style='stop-color:%230a0a0a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23g)'/%3E%3C/svg%3E"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
            type="video/mp4"
          />
        </video>

        {/* Noise overlay */}
        <div className="noise-overlay opacity-[0.7] mix-blend-overlay pointer-events-none absolute inset-0 z-1" />

        {/* Gradient overlay */}
        <div className="bg-gradient-to-b from-black/40 via-transparent to-black/70 absolute inset-0 pointer-events-none z-1" />

        {/* Navbar */}
        <header className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-max max-w-[96vw]">
          <nav
            className="bg-black/85 backdrop-blur-xl rounded-b-2xl md:rounded-b-[1.75rem] px-3.5 py-1.5 sm:px-5 sm:py-2 flex items-center justify-center gap-1.5 sm:gap-3 md:gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.85)] border-b border-x border-[#E1E0CC]/15"
            aria-label="Main Navigation"
          >
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              if (item.action === 'library') {
                return (
                  <button
                    key={item.label}
                    onClick={onOpenLibrary}
                    className="px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs md:text-sm font-medium tracking-wide transition-all duration-250 flex items-center gap-2 cursor-pointer whitespace-nowrap bg-white/0 hover:bg-white/10 border border-transparent hover:border-white/15 active:scale-95"
                    style={{
                      color: activeNav === item.label ? '#FFFFFF' : 'rgba(225, 224, 204, 0.85)',
                    }}
                    onMouseEnter={() => setActiveNav(item.label)}
                    onMouseLeave={() => setActiveNav('')}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E1E0CC]" />}
                    <span>{item.label}</span>
                  </button>
                );
              }
              if (item.action === 'about') {
                return (
                  <button
                    key={item.label}
                    onClick={onOpenAboutUs}
                    className="px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs md:text-sm font-medium tracking-wide transition-all duration-250 flex items-center gap-1.5 cursor-pointer whitespace-nowrap bg-white/0 hover:bg-white/10 border border-transparent hover:border-white/15 active:scale-95"
                    style={{
                      color: activeNav === item.label ? '#FFFFFF' : 'rgba(225, 224, 204, 0.85)',
                    }}
                    onMouseEnter={() => setActiveNav(item.label)}
                    onMouseLeave={() => setActiveNav('')}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              }
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  aria-label={item.label}
                  title={item.label}
                  className="p-2 sm:p-2.5 rounded-full text-[11px] sm:text-xs md:text-sm font-medium transition-all duration-250 flex items-center justify-center bg-white/0 hover:bg-white/10 border border-transparent hover:border-white/15 active:scale-95"
                  style={{
                    color: activeNav === item.label ? '#FFFFFF' : 'rgba(225, 224, 204, 0.85)',
                  }}
                  onMouseEnter={() => setActiveNav(item.label)}
                  onMouseLeave={() => setActiveNav('')}
                >
                  {Icon && <Icon className="w-4 h-4 sm:w-4 sm:h-4 text-[#E1E0CC]" />}
                  {!item.iconOnly && <span>{item.label}</span>}
                </a>
              );
            })}

            {/* Quick Sound Toggle in Navbar */}
            <button
              onClick={toggleAudio}
              title={isPlaying ? 'Pause music' : 'Play audio'}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all duration-250 flex items-center gap-1.5 cursor-pointer border active:scale-95 ${
                isPlaying
                  ? 'bg-amber-400/20 border-amber-300/40 text-amber-200'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-[#E1E0CC]'
              }`}
            >
              {isPlaying ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              ) : (
                <>
                  <Music className="w-3.5 h-3.5 text-[#E1E0CC]" />
                  <span className="hidden sm:inline">Play Sound</span>
                </>
              )}
            </button>
          </nav>

          {/* Subscribe Button Below Navbar */}
          {onOpenSubscribe && (
            <div className="flex justify-center mt-3">
              <motion.button
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onClick={onOpenSubscribe}
                title="Subscribe to newsletter"
                className="relative inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-red-600/40 to-red-700/40 border border-red-500/60 text-red-100 font-medium text-xs sm:text-sm tracking-wide backdrop-blur-md transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.4)] cursor-pointer active:scale-95 hover:from-red-600/60 hover:to-red-700/60 hover:border-red-400/80 hover:shadow-[0_0_30px_rgba(239,68,68,0.6)]"
              >
                {/* Pulsing glow effect */}
                <motion.span
                  className="absolute -inset-1 rounded-full bg-red-500/30 blur-md -z-10"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-200" />
                <span>Subscribe</span>
              </motion.button>
            </div>
          )}
        </header>

        {/* Hero Content (bottom-aligned) */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-12 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            {/* Left 8 columns: Giant Heading */}
            <div className="lg:col-span-8">
              <WordsPullUp
                text="TheWaqarMind"
                showAsterisk={true}
                className="text-[13vw] sm:text-[12vw] md:text-[11vw] lg:text-[9.5vw] xl:text-[9vw] 2xl:text-[9.5vw] font-medium leading-[0.85] tracking-[-0.07em] text-[#E1E0CC]"
              />
            </div>

            {/* Right 4 columns: Description + CTA */}
            <div className="lg:col-span-4 flex flex-col items-start lg:items-start justify-end space-y-5 pb-1 md:pb-3">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-primary/70 text-xs sm:text-sm md:text-base leading-[1.2] max-w-md"
              >
                Welcome to my mind—This is more than motivation—it's a collection of my thoughts, perspectives, and lessons that have shaped who I am and who I'm becoming.
              </motion.p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {/* Premium Library CTA Button */}
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.65,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onClick={onOpenLibrary}
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[#E1E0CC] font-medium text-xs sm:text-sm tracking-wide backdrop-blur-md transition-all duration-300 shadow-xl group hover:border-white/40 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#E1E0CC] transition-transform group-hover:scale-110" />
                  Library
                  <ArrowRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                {/* Music / Sound Toggle Button */}
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.75,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onClick={toggleAudio}
                  title={isPlaying ? 'Pause sound' : 'Play audio from Google Drive'}
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-full border text-xs sm:text-sm font-medium tracking-wide backdrop-blur-md transition-all duration-300 shadow-xl cursor-pointer active:scale-95 ${
                    isPlaying
                      ? 'bg-amber-400/20 border-amber-300/50 text-amber-200 hover:bg-amber-400/30 shadow-amber-500/20'
                      : 'bg-black/40 hover:bg-white/10 border-white/20 text-[#E1E0CC] hover:border-white/40'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Volume2 className="w-4 h-4 text-amber-300 animate-pulse" />
                      <span>Pause Sound</span>
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                      </span>
                    </>
                  ) : (
                    <>
                      <Music className="w-4 h-4 text-[#E1E0CC]" />
                      <span>Play Sound</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});


HeroSection.displayName = 'HeroSection';

