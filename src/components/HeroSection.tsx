'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Sparkles, ShoppingBag } from 'lucide-react';

export interface HeroProgressInfo {
  progress: number;
  rawProgress: number;
  scrollableDist: number;
  scrollY: number;
  isExited: boolean;
}

interface HeroSectionProps {
  lang?: 'en' | 'ml';
  onProgressUpdate?: (info: HeroProgressInfo) => void;
}

export default function HeroSection({ lang = 'en', onProgressUpdate }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Video ready & loading state
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isMobileMode, setIsMobileMode] = useState(false);

  // Performance references for 60fps / 120fps scrubbing engine
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const scrollableDistRef = useRef(0);
  const isSeekingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const lastTargetTimeRef = useRef(0);
  const videoDecodedUnlockedRef = useRef(false);

  // 1. Detect screen mode (phone portrait vs desktop landscape)
  useEffect(() => {
    const checkOrientation = () => {
      const isMobileQuery = window.matchMedia('(max-width: 767px), (orientation: portrait)');
      setIsMobileMode(isMobileQuery.matches);
    };

    checkOrientation();

    const mql = window.matchMedia('(max-width: 767px), (orientation: portrait)');
    const handleMqlChange = (e: MediaQueryListEvent) => {
      setIsMobileMode(e.matches);
      const video = videoRef.current;
      if (video) {
        const prevTime = video.currentTime;
        video.load();
        video.currentTime = prevTime;
      }
    };

    if (mql.addEventListener) {
      mql.addEventListener('change', handleMqlChange);
    } else {
      mql.addListener(handleMqlChange);
    }

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', handleMqlChange);
      } else {
        mql.removeListener(handleMqlChange);
      }
    };
  }, []);

  // 2. Hardware Decoder Unlocker
  const unlockHardwareDecoder = useCallback(() => {
    if (videoDecodedUnlockedRef.current) return;
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          video.pause();
          videoDecodedUnlockedRef.current = true;
        })
        .catch(() => {});
    }
  }, []);

  // 3. Initialize video metadata and listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    isSeekingRef.current = false;

    const handleLoadedMetadata = () => {
      video.pause();
      video.currentTime = 0.001;
      setIsVideoReady(true);
      unlockHardwareDecoder();
    };

    const handleCanPlay = () => {
      setIsVideoReady(true);
    };

    const handleSeeked = () => {
      isSeekingRef.current = false;
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('seeked', handleSeeked);

    let rVFCId: number | null = null;
    if ('requestVideoFrameCallback' in video) {
      const onVideoFramePresented = () => {
        isSeekingRef.current = false;
        if ('requestVideoFrameCallback' in video) {
          rVFCId = (video as any).requestVideoFrameCallback(onVideoFramePresented);
        }
      };
      rVFCId = (video as any).requestVideoFrameCallback(onVideoFramePresented);
    }

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    const handleFirstTouch = () => {
      unlockHardwareDecoder();
      window.removeEventListener('touchstart', handleFirstTouch);
      window.removeEventListener('click', handleFirstTouch);
    };
    window.addEventListener('touchstart', handleFirstTouch, { passive: true });
    window.addEventListener('click', handleFirstTouch, { passive: true });

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('seeked', handleSeeked);
      if (rVFCId !== null && 'cancelVideoFrameCallback' in video) {
        (video as any).cancelVideoFrameCallback(rVFCId);
      }
      window.removeEventListener('touchstart', handleFirstTouch);
      window.removeEventListener('click', handleFirstTouch);
    };
  }, [unlockHardwareDecoder]);

  // 4. Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollableDist = rect.height - window.innerHeight;
      scrollableDistRef.current = scrollableDist;
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

  // 5. Render loop
  useEffect(() => {
    const loop = () => {
      const diff = targetProgressRef.current - currentProgressRef.current;
      const lerpFactor = isMobileMode ? 0.18 : 0.24;

      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * lerpFactor;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      const p = currentProgressRef.current;
      setProgress(p);

      if (onProgressUpdate) {
        onProgressUpdate({
          progress: p,
          rawProgress: targetProgressRef.current,
          scrollableDist: scrollableDistRef.current,
          scrollY: window.scrollY,
          isExited: p >= 0.96,
        });
      }

      const video = videoRef.current;
      if (video && video.duration && !isNaN(video.duration) && video.readyState >= 2) {
        const rawTime = Math.max(0, Math.min(video.duration - 0.04, p * video.duration));
        const frameTime = Math.round(rawTime * 24) / 24;
        lastTargetTimeRef.current = frameTime;

        if (!isSeekingRef.current) {
          if (Math.abs(video.currentTime - frameTime) >= 0.02) {
            isSeekingRef.current = true;
            video.currentTime = frameTime;
          }
        }
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isMobileMode, onProgressUpdate]);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !isMuted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted) {
      video.play().catch(() => {});
    }
  };

  const handleSkipToStore = () => {
    const categorySection = document.getElementById('categories');
    if (categorySection) {
      categorySection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight * 2.2, behavior: 'smooth' });
    }
  };

  // Smooth exit fade
  const exitFade = progress > 0.75 ? Math.min(1, (progress - 0.75) / 0.21) : 0;
  const overallOpacity = Math.max(0, 1 - exitFade);
  const isFullyExited = progress >= 0.96;

  // Intro UI fade out early in scroll
  const introFade = Math.max(0, 1 - progress / 0.15);

  const getLocationLabel = () => {
    if (progress < 0.28) {
      return lang === 'ml' ? '🏮 വിളക്കുകളുടെ നിര' : '🏮 Lantern Row';
    }
    if (progress < 0.58) {
      return lang === 'ml' ? '🎪 അങ്ങാടി നിര • നിത്യോപയോഗ സാധനങ്ങൾ' : '🎪 Everyday Finds & Aisle';
    }
    if (progress < 0.78) {
      return lang === 'ml' ? '🌴 ഹട്കെ സ്റ്റോർ മുൻവശം' : '🌴 Hatke Storefront';
    }
    return lang === 'ml' ? '✨ ഹട്കെയിലേക്ക് സ്വാഗതം' : '✨ Entering Hatke Bazaar...';
  };

  return (
    <div
      ref={containerRef}
      id="hero-scroll-container"
      className="relative h-[220vh] sm:h-[240vh] bg-[#FAF9F6]"
    >
      {/* Sticky Fullscreen Viewport Layer */}
      <div
        className="sticky top-0 h-screen h-[100dvh] w-full overflow-hidden flex items-center justify-center bg-[#111827] select-none z-20 will-change-transform will-change-opacity"
        style={{
          opacity: overallOpacity,
          pointerEvents: isFullyExited ? 'none' : 'auto',
          visibility: isFullyExited ? 'hidden' : 'visible',
        }}
      >
        {/* Loading Skeleton */}
        {!isVideoReady && (
          <div className="absolute inset-0 z-0 flex flex-col items-center justify-center bg-[#FAF9F6]">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20">
              <div className="absolute inset-0 rounded-full border-4 border-[#1F5C3A]/30 animate-ping"></div>
              <div className="w-full h-full rounded-full border-4 border-[#1F5C3A] border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-xs tracking-wider uppercase font-hatke-body font-bold text-[#111827]">
              {lang === 'ml' ? 'ഹട്കെ അങ്ങാടി ഒരുങ്ങുന്നു...' : 'Opening Hatke Bazaar...'}
            </p>
          </div>
        )}

        {/* Dual-responsive Video Layer */}
        <video
          ref={videoRef}
          preload="auto"
          muted={isMuted}
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          className={`w-full h-full object-cover filter contrast-[1.03] brightness-[1.02] transform-gpu will-change-transform transition-opacity duration-500 ${
            isVideoReady ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source
            src="/scroll-mobile.mp4"
            type="video/mp4"
            media="(max-width: 767px), (orientation: portrait)"
          />
          <source
            src="/scroll-desktop.mp4"
            type="video/mp4"
          />
        </video>

        {/* Soft Vignettes */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/75 via-black/25 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#FAF9F6] via-[#FAF9F6]/80 to-transparent pointer-events-none" />

        {/* Intro Overlay: Hatke Brand Card */}
        {introFade > 0.01 && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-between p-6 sm:p-10 pointer-events-none transition-opacity duration-200"
            style={{ opacity: introFade }}
          >
            {/* Top Badge: Green & Yellow */}
            <div className="mt-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFFFF] border-2 border-[#111827] shadow-[3px_3px_0px_#111827] text-[#111827]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1F5C3A] animate-ping" />
              <span className="text-[11px] sm:text-xs font-black tracking-wider uppercase font-hatke-body">
                {lang === 'ml' ? 'കേരളത്തിൽ ആരംഭിക്കുന്നു 🌴 • അല്പം വ്യത്യസ്തം' : 'LAUNCHING FIRST IN KERALA 🌴 • DESI AT HEART'}
              </span>
            </div>

            {/* Center Title Card */}
            <div className="text-center max-w-xl mx-auto px-4 bg-[#FFFFFF]/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border-3 border-[#111827] shadow-[6px_6px_0px_#111827]">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#FACC15]" />
                <span className="text-[11px] font-black uppercase tracking-widest text-[#1F5C3A] font-hatke-body">
                  Har cheez, thoda hatke
                </span>
                <span className="w-2 h-2 rounded-full bg-[#FACC15]" />
              </div>
              <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-[#111827] font-hatke-title drop-shadow-xs">
                Hat<span className="hatke-k-tilt text-[#1F5C3A]">k</span>e
              </h1>
              <div className="w-16 h-1.5 bg-[#FACC15] mx-auto my-3 rounded-full" />
              <p className="text-base sm:text-lg font-bold text-[#1F5C3A] font-hatke-body tracking-tight">
                {lang === 'ml'
                  ? 'ദിവസേനയുള്ള കണ്ടെത്തലുകൾ, കുറച്ച് വ്യത്യസ്തമായി.'
                  : 'Everyday finds, a little different.'}
              </p>
              <p className="mt-2 text-xs sm:text-sm text-[#111827]/80 font-medium font-hatke-body">
                {lang === 'ml'
                  ? 'സാധനങ്ങൾ വിൽക്കാൻ മാത്രമല്ല, ദൈനംദിന ജീവിതം അല്പം കൂടുതൽ ആസ്വാദ്യകരമാക്കാൻ.'
                  : 'A store not just to sell things, but to make the everyday a little more fun.'}
              </p>
            </div>

            {/* Bottom Animated Scroll Cue Button in Haldi Yellow */}
            <button
              onClick={handleSkipToStore}
              className="mb-6 flex flex-col items-center gap-2 pointer-events-auto cursor-pointer group"
              title="Click to enter Hatke Bazaar"
            >
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#111827] px-4 py-1.5 rounded-full bg-[#FACC15] border-2 border-[#111827] shadow-[2.5px_2.5px_0px_#111827] group-hover:bg-[#EAB308] transition-colors font-hatke-body">
                {lang === 'ml' ? 'അങ്ങാടി കാണാൻ ക്ലിക്ക് ചെയ്യുക / താഴേക്ക് സ്ക്രോൾ ചെയ്യുക' : 'Click to enter bazaar / Scroll down'}
              </span>
              <div className="w-6 h-10 rounded-full border-2 border-[#111827] flex items-start justify-center p-1 bg-[#FFFFFF] shadow-[2px_2px_0px_#111827]">
                <div className="w-1.5 h-2.5 rounded-full bg-[#1F5C3A] animate-bounce" />
              </div>
            </button>
          </div>
        )}

        {/* Persistent Desi HUD */}
        {progress > 0.05 && progress < 0.85 && (
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-auto font-hatke-body">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border-2 border-[#111827] text-[#111827] text-xs font-bold shadow-[2px_2px_0px_#111827]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1F5C3A] animate-pulse" />
              <span>{getLocationLabel()}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleSound}
                aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
                className="p-2.5 rounded-full bg-[#FFFFFF] border-2 border-[#111827] text-[#111827] hover:bg-[#FACC15] shadow-[2px_2px_0px_#111827] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
                title={isMuted ? 'Sound Off (Click to turn on)' : 'Sound On'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-[#111827]" /> : <Volume2 className="w-4 h-4 text-[#1F5C3A]" />}
              </button>

              <button
                onClick={handleSkipToStore}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FACC15] border-2 border-[#111827] text-[#111827] text-xs font-black tracking-wide shadow-[2.5px_2.5px_0px_#111827] hover:bg-[#EAB308] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer font-hatke-body"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{lang === 'ml' ? 'ഷോപ്പിലേക്ക്' : 'Skip to Store'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Bottom Progress Line in Haldi Yellow */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#111827] z-20 pointer-events-none">
          <div
            className="h-full bg-[#FACC15] transition-all duration-75 ease-out"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>

        {/* Soft White dissolve layer */}
        <div
          className="absolute inset-0 bg-[#FAF9F6] pointer-events-none transition-opacity duration-150"
          style={{ opacity: exitFade }}
        />
      </div>
    </div>
  );
}
