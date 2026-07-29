import { useEffect, useState, useCallback } from 'react';

interface UseLazyVideoOptions {
  rootMargin?: string;
  threshold?: number;
  disabled?: boolean;
}

export const useLazyVideo = (options: UseLazyVideoOptions = {}) => {
  const { rootMargin = '500px', threshold = 0.1, disabled = false } = options;
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [saveDataEnabled, setSaveDataEnabled] = useState(false);

  // Callback ref to receive the DOM node on mount
  const videoRef = useCallback((node: HTMLVideoElement | null) => {
    setVideoElement(node);
  }, []);

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

  // We only disable the video if explicitly requested via the disabled option.
  // This guarantees background videos will play for users regardless of minor preferences.
  const shouldDisableVideo = disabled;

  useEffect(() => {
    console.log('useLazyVideo status:', {
      shouldDisableVideo,
      prefersReducedMotion,
      saveDataEnabled,
      isIntersecting,
      isLoaded,
      hasError,
      hasVideoElement: !!videoElement
    });
  }, [shouldDisableVideo, prefersReducedMotion, saveDataEnabled, isIntersecting, isLoaded, hasError, videoElement]);

  useEffect(() => {
    if (shouldDisableVideo) {
      setIsIntersecting(true); // Treat as intersecting so fallback is resolved
      return;
    }

    if (!videoElement) return;

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

    observer.observe(videoElement);

    return () => {
      observer.disconnect();
    };
  }, [videoElement, rootMargin, threshold, shouldDisableVideo]);

  // Handle component unmount memory cleanup
  useEffect(() => {
    return () => {
      if (videoElement) {
        videoElement.pause();
        try {
          videoElement.src = '';
          videoElement.load();
        } catch (err) {
          // Safe catch
        }
      }
    };
  }, [videoElement]);

  useEffect(() => {
    // If we shouldn't play video or it's not in view yet, do nothing
    if (shouldDisableVideo || !isIntersecting || !videoElement) return;

    const handleLoad = () => {
      setIsLoaded(true);
    };

    const handleError = () => {
      console.error('Video failed to load:', videoElement.src);
      setHasError(true);
    };

    const handleCanPlay = () => {
      videoElement.play().catch((err) => {
        console.warn('Video autoplay failed:', err);
      });
    };

    videoElement.addEventListener('loadeddata', handleLoad);
    videoElement.addEventListener('error', handleError);
    videoElement.addEventListener('canplay', handleCanPlay);

    // Start loading the video when it intersects
    if (videoElement.readyState < 2) {
      videoElement.load();
    } else {
      handleCanPlay();
    }

    return () => {
      videoElement.removeEventListener('loadeddata', handleLoad);
      videoElement.removeEventListener('error', handleError);
      videoElement.removeEventListener('canplay', handleCanPlay);
    };
  }, [videoElement, isIntersecting, shouldDisableVideo]);

  return { videoRef, isIntersecting, isLoaded, hasError, shouldDisableVideo };
};

