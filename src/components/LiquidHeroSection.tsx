import React, { useEffect } from 'react';
import { useLazyVideo } from '../hooks/useLazyVideo';

export const LiquidHeroSection: React.FC = React.memo(() => {
  const { videoRef, isIntersecting, shouldDisableVideo } = useLazyVideo({ rootMargin: '500px' });

  useEffect(() => {
    if (!isIntersecting || shouldDisableVideo) return;

    const video = videoRef.current;
    if (!video) return;

    let animFrameId: number;
    let fadeStartTime: number | null = null;
    let fadeDirection: 'in' | 'out' | null = null;
    let initialOpacity = 0;

    const startFade = (direction: 'in' | 'out') => {
      fadeDirection = direction;
      fadeStartTime = performance.now();
      initialOpacity = parseFloat(video.style.opacity || '0');

      const animate = (now: number) => {
        if (!fadeStartTime || !fadeDirection) return;
        const elapsed = now - fadeStartTime;
        const duration = 500;
        const progress = Math.min(elapsed / duration, 1);

        if (fadeDirection === 'in') {
          video.style.opacity = (initialOpacity + (1 - initialOpacity) * progress).toString();
        } else {
          video.style.opacity = (initialOpacity * (1 - progress)).toString();
        }

        if (progress < 1) {
          animFrameId = requestAnimationFrame(animate);
        } else {
          fadeDirection = null;
        }
      };

      cancelAnimationFrame(animFrameId);
      animFrameId = requestAnimationFrame(animate);
    };

    const handleCanPlay = () => {
      video.play().catch(() => {});
      startFade('in');
    };

    const handleTimeUpdate = () => {
      if (video.duration) {
        const remaining = video.duration - video.currentTime;
        if (remaining <= 0.55 && fadeDirection !== 'out') {
          startFade('out');
        }
      }
    };

    const handleEnded = () => {
      video.style.opacity = '0';
      setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(() => {});
        startFade('in');
      }, 100);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    // If video is already ready to play when hook triggers
    if (video.readyState >= 2) {
      handleCanPlay();
    } else {
      video.load();
    }

    return () => {
      cancelAnimationFrame(animFrameId);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      
      // Stop video and cleanup resources
      video.pause();
      try {
        video.src = '';
        video.load();
      } catch (e) {}
    };
  }, [isIntersecting, shouldDisableVideo]);

  return (
    <section className="min-h-screen w-full relative flex flex-col justify-between overflow-hidden bg-black text-white">
      {/* Background Video */}
      {!shouldDisableVideo ? (
        <video
          ref={videoRef}
          autoPlay={isIntersecting}
          loop
          muted
          playsInline
          preload={isIntersecting ? 'auto' : 'metadata'}
          crossOrigin="anonymous"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23151515'/%3E%3Cstop offset='100%25' style='stop-color:%23080808'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23g)'/%3E%3C/svg%3E"
          className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none"
          style={{ opacity: isIntersecting ? 1 : 0, transition: 'opacity 1s ease-in-out' }}
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4"
            type="video/mp4"
          />
        </video>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-black pointer-events-none z-0" />
      )}

      {/* Dark vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none z-1" />

      {/* Hero Content - Quotes */}
      <div className="relative z-10 flex-1 flex flex-col justify-between p-6 sm:p-10 md:p-12 pointer-events-none">
        {/* Top left quote */}
        <div className="max-w-md space-y-1 sm:space-y-1.5 text-white/70 text-xs sm:text-sm font-light tracking-wide leading-relaxed text-left">
          <p>Time never asks if you're ready.</p>
          <p>It simply keeps moving forward.</p>
          <p>The question is not whether life will change.</p>
          <p>It always does.</p>
          <p>The question is whether you'll grow with it,</p>
          <p>or spend your years wishing you had.</p>
        </div>

        {/* Bottom right quote */}
        <div className="self-end text-right max-w-md space-y-1 sm:space-y-1.5 text-white/70 text-xs sm:text-sm font-light tracking-wide leading-relaxed mt-6">
          <p>Not every silence is empty.</p>
          <p>Some silence is where clarity is born.</p>
          <p>The loudest answers rarely last,</p>
          <p>but quiet wisdom stays forever.</p>
          <p>Learn to listen before you speak.</p>
          <p>The deepest truths are often whispered.</p>
        </div>
      </div>
    </section>
  );
});

LiquidHeroSection.displayName = 'LiquidHeroSection';

