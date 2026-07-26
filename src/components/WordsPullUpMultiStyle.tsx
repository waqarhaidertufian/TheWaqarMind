import React, { useRef, useMemo } from 'react';
import { motion, useInView } from 'motion/react';
import { Segment } from '../types';

interface WordsPullUpMultiStyleProps {
  segments: Segment[];
  containerClassName?: string;
  delayOffset?: number;
}

export const WordsPullUpMultiStyle: React.FC<WordsPullUpMultiStyleProps> = React.memo(({
  segments,
  containerClassName = '',
  delayOffset = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });

  // Flatten segments into an array of individual words with corresponding className
  const words = useMemo(() => {
    const list: { text: string; className?: string }[] = [];
    segments.forEach((segment) => {
      const splitWords = segment.text.split(' ');
      splitWords.forEach((word) => {
        if (word.length > 0) {
          list.push({ text: word, className: segment.className });
        }
      });
    });
    return list;
  }, [segments]);

  return (
    <div
      ref={containerRef}
      className={`inline-flex flex-wrap justify-center items-baseline ${containerClassName}`}
    >
      {words.map((item, index) => (
        <span
          key={index}
          className="inline-block overflow-hidden pb-1 mr-[0.28em] last:mr-0"
        >
          <motion.span
            className={`inline-block ${item.className || ''}`}
            initial={{ y: '100%', opacity: 0 }}
            animate={isInView ? { y: '0%', opacity: 1 } : { y: '100%', opacity: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
              delay: delayOffset + index * 0.08,
            }}
          >
            {item.text}
          </motion.span>
        </span>
      ))}
    </div>
  );
});

WordsPullUpMultiStyle.displayName = 'WordsPullUpMultiStyle';

