import { useRef, useEffect, useState } from 'react';

interface UseLazyVideoOptions {
  rootMargin?: string;
  threshold?: number;
  disabled?: boolean;
}

export const useLazyVideo = (options: UseLazyVideoOptions = {}) => {
  const { rootMargin = '500px', threshold = 0.1, disabled = false } = options;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (disabled) {
      setIsIntersecting(true);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin, threshold }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, threshold, disabled]);

  useEffect(() => {
    if (!isIntersecting || isLoaded) return;

    const video = videoRef.current;
    if (!video) return;

    const handleLoad = () => {
      setIsLoaded(true);
    };

    const handleError = () => {
      console.error('Video failed to load:', video.src);
      setHasError(true);
    };

    const handleCanPlay = () => {
      video.play().catch((err) => {
        console.warn('Video autoplay failed:', err);
      });
    };

    video.addEventListener('loadeddata', handleLoad);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);

    // Start loading the video when it intersects
    if (video.readyState < 2) {
      video.load();
    }

    return () => {
      video.removeEventListener('loadeddata', handleLoad);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [isIntersecting, isLoaded]);

  return { videoRef, isIntersecting, isLoaded, hasError };
};
