import React, { useRef, useMemo, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { WordsPullUpMultiStyle } from './WordsPullUpMultiStyle';
import { Segment } from '../types';

interface FeatureCardProps {
  index: number;
  children: React.ReactNode;
}

const FeatureCardWrapper: React.FC<FeatureCardProps> = React.memo(({ index, children }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
});

FeatureCardWrapper.displayName = 'FeatureCardWrapper';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

const LazyImage: React.FC<LazyImageProps> = React.memo(({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="absolute inset-0 w-full h-full bg-neutral-950 overflow-hidden">
      <img
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-1000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
      />
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

const CARDS = [
  {
    quote: '"Every new day is a new chance."',
    image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=800&auto=format&fit=crop',
  },
  {
    quote: '"Life is a journey, not a race."',
    image: 'https://images.unsplash.com/photo-1494783367193-149034c05e8f?q=80&w=800&auto=format&fit=crop',
  },
  {
    quote: '"Growth begins outside your comfort zone."',
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=800&auto=format&fit=crop',
  },
  {
    quote: '"Life rewards those who stay consistent."',
    image: 'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=800&auto=format&fit=crop',
  },
];

export const FeaturesSection: React.FC = () => {
  const headerSegments: Segment[] = useMemo(
    () => [
      {
        text: 'Every quote is more than words. ',
        className: 'text-[#E1E0CC]',
      },
      {
        text: 'It is a perspective that can change the way you see life.',
        className: 'text-gray-500',
      },
    ],
    []
  );

  return (
    <section id="features" className="min-h-screen bg-black relative py-20 md:py-32 px-4 sm:px-6 md:px-8 overflow-hidden z-10">
      {/* Background Noise overlay */}
      <div className="bg-noise absolute inset-0 opacity-[0.15] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal text-center mb-12 sm:mb-16 max-w-4xl mx-auto leading-snug">
          <WordsPullUpMultiStyle segments={headerSegments} />
        </div>

        {/* 4-column Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-2 md:gap-1 lg:h-[480px]">
          {CARDS.map((card, idx) => (
            <FeatureCardWrapper key={idx} index={idx}>
              <div className="rounded-2xl overflow-hidden relative min-h-[360px] lg:min-h-full h-full flex flex-col justify-end p-6 md:p-8 border border-white/5 group">
                <LazyImage
                  src={card.image}
                  alt={card.quote}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlays */}
                <div className="noise-overlay opacity-[0.5] mix-blend-overlay pointer-events-none absolute inset-0 z-1" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-1" />

                <h3 className="text-[#E1E0CC] text-lg sm:text-xl font-medium relative z-10">
                  {card.quote}
                </h3>
              </div>
            </FeatureCardWrapper>
          ))}
        </div>
      </div>
    </section>
  );
};


