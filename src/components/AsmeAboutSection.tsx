import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

export const AsmeAboutSection: React.FC = React.memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section
      id="about-asme"
      ref={containerRef}
      className="bg-black pt-32 md:pt-44 pb-10 md:pb-14 px-6 relative overflow-hidden text-center"
    >
      {/* Subtle radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.03)_0%,_transparent_70%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-6">
        {/* Label */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-white/40 text-sm tracking-widest block font-medium"
        >
          TheWaqarMind
        </motion.span>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight max-w-4xl mx-auto font-normal"
        >
          Pioneering then{' '}
          <em className="italic font-serif text-white/60 font-normal">ideas</em> for{' '}
          <br className="hidden md:block" />
          minds that then{' '}
          <em className="italic font-serif text-white/60 font-normal">
            create, build, and inspire.
          </em>
        </motion.h2>
      </div>
    </section>
  );
});

AsmeAboutSection.displayName = 'AsmeAboutSection';

