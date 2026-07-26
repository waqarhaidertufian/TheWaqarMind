import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';

interface AnimatedLetterProps {
  char: string;
  index: number;
  totalChars: number;
  progress: MotionValue<number>;
}

const AnimatedLetter = React.memo<AnimatedLetterProps>(({
  char,
  index,
  totalChars,
  progress,
}) => {
  const charProgress = index / Math.max(totalChars, 1);
  const start = Math.max(0, charProgress - 0.1);
  const end = Math.min(1, charProgress + 0.05);

  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  return <motion.span style={{ opacity }}>{char}</motion.span>;
});

AnimatedLetter.displayName = 'AnimatedLetter';

interface AnimatedParagraphProps {
  text: string;
  className?: string;
}

export const AnimatedParagraph: React.FC<AnimatedParagraphProps> = React.memo(({
  text,
  className = '',
}) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.25'],
  });

  const characters = useMemo(() => text.split(''), [text]);

  return (
    <p ref={containerRef} className={className}>
      {characters.map((char, index) => (
        <AnimatedLetter
          key={index}
          char={char}
          index={index}
          totalChars={characters.length}
          progress={scrollYProgress}
        />
      ))}
    </p>
  );
});

AnimatedParagraph.displayName = 'AnimatedParagraph';

