import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { useLazyVideo } from '../hooks/useLazyVideo';

export const PhilosophySection: React.FC = React.memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  const LazyVideo: React.FC<{ src: string; className?: string; poster?: string }> = React.memo(({ src, className, poster }) => {
    const { videoRef, isIntersecting, shouldDisableVideo } = useLazyVideo({ rootMargin: '400px' });

    if (shouldDisableVideo) {
      return <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800" />;
    }

    return (
      <video
        ref={videoRef}
        autoPlay={isIntersecting}
        loop
        muted
        playsInline
        preload={isIntersecting ? 'auto' : 'metadata'}
        poster={poster}
        className={className}
      >
        <source src={src} type="video/mp4" />
      </video>
    );
  });

  return (
    <section ref={containerRef} className="bg-black pt-6 sm:pt-10 md:pt-12 pb-24 md:pb-36 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl text-white tracking-tight mb-16 md:mb-24 font-normal"
        >
          Mindset <em className="italic font-serif text-white/40">×</em> Mastery
        </motion.h2>

        {/* Video Container */}
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-3xl overflow-hidden aspect-[16/9] w-full border border-white/10 relative"
          >
            <LazyVideo
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4"
              poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23141414'/%3E%3Cstop offset='100%25' style='stop-color:%230a0a0a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23g)'/%3E%3C/svg%3E"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          </motion.div>

          {/* Story Text Below Video */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 max-w-2xl w-full text-xs md:text-sm text-white/75 leading-relaxed space-y-4 font-light tracking-wide"
          >
            <p>
              <strong className="text-white font-semibold">Not every storm arrives to destroy you.</strong>
              <br />
              Some storms come to clear the path you've been too afraid to walk.
            </p>

            <p>
              Life has a strange way of moving forward.
              <br />
              It never waits for the perfect moment, and it never asks if you're ready.
              <br />
              It simply keeps unfolding, one day at a time.
            </p>

            <p>
              There will be days when nothing makes sense.
              <br />
              You'll question your choices, your purpose, and even your own strength.
              <br />
              The people you expected to stay may leave.
              <br />
              The dreams you held tightly may fall apart.
              <br />
              And the future you imagined may disappear without warning.
            </p>

            <p className="text-white/90">
              But that's not the end of your story.
            </p>

            <p>
              Because the strongest version of you is never born in comfort.
              <br />
              It is shaped in uncertainty.
              <br />
              It is built through quiet mornings, difficult nights, and the courage to keep going when no one is watching.
            </p>

            <p>
              One day, you'll look back and realize that the moments you once called failures were actually turning points.
              <br />
              Every setback taught you patience.
              <br />
              Every goodbye made room for something better.
              <br />
              Every obstacle forced you to discover a strength you didn't know you had.
            </p>

            <p>
              The goal of life is not to avoid change.
              <br />
              The goal is to become someone who can grow through it.
            </p>

            <p>
              In the end, people won't remember how many times you fell.
              <br />
              They'll remember the person you chose to become after every fall.
            </p>

            <p className="pt-2">
              <strong className="text-white font-semibold">Because time never waits... but growth is always a choice.</strong>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

PhilosophySection.displayName = 'PhilosophySection';

