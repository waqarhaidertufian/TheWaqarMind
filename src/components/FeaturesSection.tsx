import React, { useRef, useMemo, useState, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import { WordsPullUpMultiStyle } from './WordsPullUpMultiStyle';
import { Segment } from '../types';
import { useLazyVideo } from '../hooks/useLazyVideo';

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

interface LazyVideoProps {
  src: string;
  className?: string;
}

const LazyVideo: React.FC<LazyVideoProps> = React.memo(({ src, className }) => {
  const { videoRef, isIntersecting, shouldDisableVideo } = useLazyVideo({ rootMargin: '400px' });

  if (shouldDisableVideo) {
    return <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />;
  }

  return (
    <video
      ref={videoRef}
      autoPlay={isIntersecting}
      loop
      muted
      playsInline
      preload={isIntersecting ? 'auto' : 'metadata'}
      className={className}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
});

LazyVideo.displayName = 'LazyVideo';

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
          {/* Card 1: Video Card */}
          <FeatureCardWrapper index={0}>
            <div className="rounded-2xl overflow-hidden relative min-h-[360px] lg:min-h-full h-full flex flex-col justify-end p-6 md:p-8 border border-white/5 group">
              <LazyVideo
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="noise-overlay opacity-[0.5] mix-blend-overlay pointer-events-none absolute inset-0 z-1" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-1" />
              <h3 className="text-[#E1E0CC] text-lg sm:text-xl font-medium relative z-10">
                "Every new day is a new chance."
              </h3>
            </div>
          </FeatureCardWrapper>

          {/* Card 2: Project Storyboard */}
          <FeatureCardWrapper index={1}>
            <div className="rounded-2xl overflow-hidden relative p-6 md:p-8 flex flex-col justify-end min-h-[360px] lg:min-h-full h-full border border-white/5 group hover:border-white/10 transition-colors">
              <LazyVideo
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlays */}
              <div className="noise-overlay opacity-[0.5] mix-blend-overlay pointer-events-none absolute inset-0 z-1" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-1" />

              <h3 className="text-[#E1E0CC] text-lg sm:text-xl font-medium relative z-10">
                "Life is a journey, not a race."
              </h3>
            </div>
          </FeatureCardWrapper>

          {/* Card 3: Smart Critiques */}
          <FeatureCardWrapper index={2}>
            <div className="rounded-2xl overflow-hidden relative p-6 md:p-8 flex flex-col justify-end min-h-[360px] lg:min-h-full h-full border border-white/5 group hover:border-white/10 transition-colors">
              <LazyVideo
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlays */}
              <div className="noise-overlay opacity-[0.5] mix-blend-overlay pointer-events-none absolute inset-0 z-1" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-1" />

              <h3 className="text-[#E1E0CC] text-lg sm:text-xl font-medium relative z-10">
                "Growth begins outside your comfort zone."
              </h3>
            </div>
          </FeatureCardWrapper>

          {/* Card 4: Immersion Capsule */}
          <FeatureCardWrapper index={3}>
            <div className="rounded-2xl overflow-hidden relative p-6 md:p-8 flex flex-col justify-end min-h-[360px] lg:min-h-full h-full border border-white/5 group hover:border-white/10 transition-colors">
              <LazyVideo
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlays */}
              <div className="noise-overlay opacity-[0.5] mix-blend-overlay pointer-events-none absolute inset-0 z-1" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-1" />

              <h3 className="text-[#E1E0CC] text-lg sm:text-xl font-medium relative z-10">
                "Life rewards those who stay consistent."
              </h3>
            </div>
          </FeatureCardWrapper>
        </div>
      </div>
    </section>
  );
};

