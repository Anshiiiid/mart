'use client';

import React, { useState, useEffect, useRef } from 'react';

interface HeroSectionProps {
  lang?: 'en' | 'ml';
}

export default function HeroSection({ lang = 'en' }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Responsive device state (mobile/portrait vs desktop/landscape)
  const [isMobile, setIsMobile] = useState(false);
  const [progress, setProgress] = useState(0);

  // High-performance scrubbing references (Zero Frame Drop engine)
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const isSeekingRef = useRef(false);
  const pendingTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // Detect screen orientation and size
  useEffect(() => {
    const handleResize = () => {
      // True portrait mobile check
      const portraitOrMobile = window.innerWidth < 768 || window.innerHeight > window.innerWidth;
      setIsMobile(portraitOrMobile);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Video source: 720x1280 portrait for mobile, 1280x720 landscape for desktop/laptop/tablet
  const videoSrc = isMobile ? '/scroll-mobile.mp4' : '/scroll-desktop.mp4';

  // Initialize and preload the active video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    isSeekingRef.current = false;
    pendingTimeRef.current = null;

    const handleLoadedMetadata = () => {
      video.pause();
      video.currentTime = 0.001; // Pre-warm the hardware decoder buffer
    };

    // When a seek completes, immediately decode the next queued frame if the user kept scrolling
    const handleSeeked = () => {
      isSeekingRef.current = false;
      if (pendingTimeRef.current !== null && video.duration) {
        const nextTime = pendingTimeRef.current;
        pendingTimeRef.current = null;
        if (Math.abs(video.currentTime - nextTime) >= 0.033) {
          isSeekingRef.current = true;
          try {
            if ('fastSeek' in video && typeof (video as any).fastSeek === 'function') {
              (video as any).fastSeek(nextTime);
            } else {
              video.currentTime = nextTime;
            }
          } catch {
            video.currentTime = nextTime;
          }
        }
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('seeked', handleSeeked);

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, [videoSrc]);

  // Track window scroll inside the sticky hero track
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollableDist = rect.height - window.innerHeight;
      if (scrollableDist <= 0) return;

      const rawProgress = -rect.top / scrollableDist;
      const clamped = Math.max(0, Math.min(1, rawProgress));
      targetProgressRef.current = clamped;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // RAF loop with snappy responsive lerp and quantized 30fps frame seeks
  useEffect(() => {
    const loop = () => {
      const diff = targetProgressRef.current - currentProgressRef.current;
      // Snappy lerp (0.24 factor gives instantaneous tracking with buttery dampening)
      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * 0.24;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      const p = currentProgressRef.current;
      setProgress(p);

      const video = videoRef.current;
      if (video && video.duration && !isNaN(video.duration)) {
        // Calculate raw target time
        const rawTime = Math.max(0, Math.min(video.duration - 0.033, p * video.duration));
        // Quantize to nearest frame step (prevents floating point decoder thrashing)
        const frameTime = Math.round(rawTime * 30) / 30;

        if (!isSeekingRef.current) {
          // Only seek if we have crossed at least one full video frame boundary (0.033s)
          if (Math.abs(video.currentTime - frameTime) >= 0.033) {
            isSeekingRef.current = true;
            try {
              if ('fastSeek' in video && typeof (video as any).fastSeek === 'function') {
                (video as any).fastSeek(frameTime);
              } else {
                video.currentTime = frameTime;
              }
            } catch {
              video.currentTime = frameTime;
            }
          }
        } else {
          // Store the latest timestamp to seek to immediately upon hardware frame decode
          pendingTimeRef.current = frameTime;
        }
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  // Smooth fade into the Category Section as progress approaches 1.0 (85% -> 100%)
  const exitFade = progress > 0.85 ? Math.min(1, (progress - 0.85) / 0.15) : 0;
  const overallOpacity = 1 - exitFade;

  return (
    <div
      ref={containerRef}
      id="hero-scroll-container"
      className="relative h-[280vh] bg-[#09070F] z-10"
    >
      {/* Sticky Fullscreen Viewport */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#09070F] select-none"
        style={{ opacity: overallOpacity }}
      >
        {/* Native 100% Quality Video Layer - Full Screen, Zero Crop, Zero Scale Distortion */}
        <video
          ref={videoRef}
          key={videoSrc}
          src={videoSrc}
          preload="auto"
          muted
          playsInline
          disablePictureInPicture
          className="w-full h-full object-cover filter contrast-105 brightness-100 transform-gpu"
        />

        {/* Cinematic Fade-out mask directly dissolving into Category section at the end of scroll */}
        <div
          className="absolute inset-0 bg-[#09070F] pointer-events-none transition-opacity duration-150"
          style={{ opacity: exitFade }}
        />

        {/* Bottom edge gradient blend */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#09070F] to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
