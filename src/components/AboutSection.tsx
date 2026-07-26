import React, { useMemo } from 'react';
import { WordsPullUpMultiStyle } from './WordsPullUpMultiStyle';
import { AnimatedParagraph } from './AnimatedParagraph';
import { Segment } from '../types';

export const AboutSection: React.FC = React.memo(() => {
  const headingSegments: Segment[] = useMemo(
    () => [
      { text: 'I am Waqar Haider, ', className: 'font-normal' },
      { text: 'a self-taught director, ', className: 'italic font-serif' },
      {
        text: '     a curious mind exploring ideas beyond the obvious, and share perspectives that inspire deeper thinking, purposeful innovation, and meaningful growth.',
        className: 'font-normal',
      },
    ],
    []
  );

  const bodyText =
    'I am an AI Engineer and Full Stack Developer based in Faisalabad, Pakistan. I build intelligent applications, modern web experiences, and AI-powered solutions with a passion for solving real-world problems through creativity and technology.';

  return (
    <section id="about" className="bg-black py-20 md:py-32 px-4 sm:px-6 md:px-8 flex justify-center items-center relative z-10">
      {/* Inner Card */}
      <div className="bg-[#101010] rounded-3xl md:rounded-[2.5rem] p-8 sm:p-12 md:p-16 lg:p-20 text-center max-w-6xl w-full border border-white/5 relative overflow-hidden shadow-2xl">
        {/* Subtle radial glow inside card */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        {/* Small label */}
        <span className="text-primary text-[10px] sm:text-xs uppercase tracking-widest mb-6 block font-medium">
          TheWaqarMind
        </span>

        {/* Main Heading */}
        <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-3xl mx-auto leading-[0.95] sm:leading-[0.9] text-[#E1E0CC]">
          <WordsPullUpMultiStyle segments={headingSegments} />
        </div>

        {/* Scroll-linked opacity character paragraph */}
        <div className="mt-8 sm:mt-12 max-w-2xl mx-auto">
          <AnimatedParagraph
            text={bodyText}
            className="text-[#DEDBC8] text-xs sm:text-sm md:text-base leading-relaxed text-center font-normal"
          />
        </div>
      </div>
    </section>
  );
});

AboutSection.displayName = 'AboutSection';
