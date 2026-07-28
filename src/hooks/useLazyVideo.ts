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
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [saveDataEnabled, setSaveDataEnabled] = useState(false);

  // Check user media preferences for performance/accessibility
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const connection = (navigator as any).connection;
    if (connection) {
      setSaveDataEnabled(connection.saveData);
    }

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const shouldDisableVideo = disabled || prefersReducedMotion || saveDataEnabled;

  useEffect(() => {
    if (shouldDisableVideo) {
      setIsIntersecting(true); // Treat as intersecting so fallback is resolved
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
  }, [rootMargin, threshold, shouldDisableVideo]);

  useEffect(() => {
    // If we shouldn't play video or it's not in view yet, do nothing
    if (shouldDisableVideo || !isIntersecting || isLoaded) return;

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
      
      // Memory cleanup: stop loading and release decoder resources on unmount
      video.pause();
      try {
        video.src = '';
        video.load();
      } catch (err) {
        // Safe catch for browsers that throw when setting empty src
      }
    };
  }, [isIntersecting, isLoaded, shouldDisableVideo]);

  return { videoRef, isIntersecting, isLoaded, hasError, shouldDisableVideo };
};
