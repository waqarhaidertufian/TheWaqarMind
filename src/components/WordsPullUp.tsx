import React, { useRef, useMemo } from 'react';
import { motion, useInView } from 'motion/react';

interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  delayOffset?: number;
}

export const WordsPullUp: React.FC<WordsPullUpProps> = React.memo(({
  text,
  className = '',
  showAsterisk = false,
  delayOffset = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });

  const words = useMemo(() => text.split(' '), [text]);

  return (
    <div
      ref={containerRef}
      className={`inline-flex flex-wrap items-baseline ${className}`}
    >
      {words.map((word, wordIndex) => {
        const isLastWord = wordIndex === words.length - 1;

        return (
          <span
            key={wordIndex}
            className="inline-block overflow-hidden pb-1 mr-[0.25em] last:mr-0 relative"
          >
            <motion.span
              className="inline-block relative"
              initial={{ y: '100%', opacity: 0 }}
              animate={isInView ? { y: '0%', opacity: 1 } : { y: '100%', opacity: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                delay: delayOffset + wordIndex * 0.08,
              }}
            >
              {word}
              {showAsterisk && isLastWord && (
                <span
                  className="absolute top-[0.65em] -right-[0.3em] text-[0.31em] select-none pointer-events-none leading-none font-normal"
                  aria-hidden="true"
                >
                  *
                </span>
              )}
            </motion.span>
          </span>
        );
      })}
    </div>
  );
});

WordsPullUp.displayName = 'WordsPullUp';

