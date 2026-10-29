'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDown, Volume2, VolumeX, Sparkles, ArrowDown, ShoppingBag } from 'lucide-react';

interface HeroSectionProps {
  lang?: 'en' | 'ml';
}

export default function HeroSection({ lang = 'en' }: HeroSectionProps) {
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
  const isSeekingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const lastTargetTimeRef = useRef(0);
  const videoDecodedUnlockedRef = useRef(false);

  // 1. Detect screen mode (phone portrait vs desktop landscape) and handle resize/rotation
  useEffect(() => {
    const checkOrientation = () => {
      const isMobileQuery = window.matchMedia('(max-width: 767px), (orientation: portrait)');
      setIsMobileMode(isMobileQuery.matches);
    };

    checkOrientation();

    const mql = window.matchMedia('(max-width: 767px), (orientation: portrait)');
    const handleMqlChange = (e: MediaQueryListEvent) => {
      setIsMobileMode(e.matches);
      // Reload video source seamlessly on orientation switch
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

  // 2. Hardware Decoder Unlocker (Specifically vital for iOS Safari and mobile Chrome)
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
        .catch(() => {
          // Autoplay policy or user hasn't interacted yet
        });
    }
  }, []);

  // 3. Initialize video metadata and listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    isSeekingRef.current = false;

    const handleLoadedMetadata = () => {
      video.pause();
      video.currentTime = 0.001; // Prime hardware decoder
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

    // Modern browsers (Chrome, Edge, Safari 15.4+): hook presentation callback for zero-drop rendering
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

    // Touch/click listener to wake up mobile audio & decoder
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

  // 4. Scroll tracking with high precision
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

  // 5. High-performance lerp & render loop (tuned separately for mobile touch and desktop trackpad)
  useEffect(() => {
    const loop = () => {
      const diff = targetProgressRef.current - currentProgressRef.current;
      // Responsive lerp dampening (0.18 on mobile for silky touch glide, 0.24 on desktop for snappy tracking)
      const lerpFactor = isMobileMode ? 0.18 : 0.24;

      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * lerpFactor;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      const p = currentProgressRef.current;
      setProgress(p);

      const video = videoRef.current;
      if (video && video.duration && !isNaN(video.duration) && video.readyState >= 2) {
        // Safe target time clamped within duration
        const rawTime = Math.max(0, Math.min(video.duration - 0.04, p * video.duration));
        // Quantize accurately to 24fps frame step (0.0416s)
        const frameTime = Math.round(rawTime * 24) / 24;
        lastTargetTimeRef.current = frameTime;

        // Vsync-synchronized seek: only dispatch seek if decoder is not currently busy
        if (!isSeekingRef.current) {
          // Half-frame threshold (0.02s) to prevent sub-frame micro-seeks
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
  }, [isMobileMode]);

  // Audio mute/unmute handler
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

  // Quick skip straight to store products
  const handleSkipToStore = () => {
    const categorySection = document.getElementById('categories');
    if (categorySection) {
      categorySection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight * 2.8, behavior: 'smooth' });
    }
  };

  // Smooth exit fade into the Category Section as progress approaches 1.0 (85% -> 100%)
  const exitFade = progress > 0.85 ? Math.min(1, (progress - 0.85) / 0.15) : 0;
  const overallOpacity = 1 - exitFade;

  // Intro UI fade out early in the scroll (0% -> 15%)
  const introFade = Math.max(0, 1 - progress / 0.15);

  // Dynamic location badge text based on scroll depth down the street
  const getLocationLabel = () => {
    if (progress < 0.28) {
      return lang === 'ml' ? '🏮 വിളക്കുകളുടെ തെരുവ്' : '🏮 Lantern Alley';
    }
    if (progress < 0.6) {
      return lang === 'ml' ? '🎪 അങ്ങാടി നിര • പഴം & സാധനങ്ങൾ' : '🎪 Fresh Stalls & Bazaar Row';
    }
    if (progress < 0.85) {
      return lang === 'ml' ? '🐱 ആർലോ & കോ. സ്റ്റോർ മുൻവശം' : '🐱 Arlo & Co. Storefront';
    }
    return lang === 'ml' ? '✨ സ്റ്റോറിലേക്ക് സ്വാഗതം' : '✨ Entering The Store...';
  };

  return (
    <div
      ref={containerRef}
      id="hero-scroll-container"
      className="relative h-[260vh] sm:h-[280vh] bg-[#14101E] z-10"
    >
      {/* Sticky Fullscreen Viewport with Dynamic Viewport Height */}
      <div
        className="sticky top-0 h-screen h-[100dvh] w-full overflow-hidden flex items-center justify-center bg-[#14101E] select-none"
        style={{ opacity: overallOpacity }}
      >
        {/* Loading Skeleton / Placeholder before video streams */}
        {!isVideoReady && (
          <div className="absolute inset-0 z-0 flex flex-col items-center justify-center bg-[#FAF4E6]">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20">
              <div className="absolute inset-0 rounded-full border-4 border-[#F15A24]/30 animate-ping"></div>
              <div className="w-full h-full rounded-full border-4 border-[#F15A24] border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-xs tracking-widest uppercase font-mono font-bold text-[#1E1B18]">
              {lang === 'ml' ? 'അങ്ങാടി ഒരുങ്ങുന്നു...' : 'Opening Indian Bazaar...'}
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

        {/* Ambient Warm Indian Festival Vignette */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#FAF4E6] via-[#FAF4E6]/80 to-transparent pointer-events-none" />

        {/* Intro Overlay: Indian Desimart Marquee */}
        {introFade > 0.01 && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-between p-6 sm:p-10 pointer-events-none transition-opacity duration-200"
            style={{ opacity: introFade }}
          >
            {/* Top Desi Postage Badge */}
            <div className="mt-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF4E6] border-2 border-[#1E1B18] shadow-[3px_3px_0px_#1E1B18] text-[#1E1B18]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F15A24] animate-ping" />
              <span className="text-[11px] sm:text-xs font-black tracking-widest uppercase font-mono">
                {lang === 'ml' ? 'ധമാക്ക ക്ലിയറൻസ് സെയിൽ • അർലോ & കോ.' : 'DHAMAKA CLEARANCE SALE • ARLO & CO.'}
              </span>
            </div>

            {/* Center Title Card in Curried Away / Banjara Style */}
            <div className="text-center max-w-xl mx-auto px-4 bg-[#FFFDF7]/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border-3 border-[#1E1B18] shadow-[6px_6px_0px_#1E1B18]">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#1E1B18] font-desi-display lowercase drop-shadow-sm">
                hatke<span className="text-[#F15A24]">.</span>haat
              </h1>
              <div className="w-16 h-1 bg-[#F15A24] mx-auto my-2 rounded-full" />
              <p className="mt-1 text-sm sm:text-base font-bold text-[#C8331E] font-desi-serif tracking-wide">
                {lang === 'ml'
                  ? 'തനിമയാർന്ന ഇന്ത്യൻ കരവിരുതും ആധുനിക ദേശിമാർട്ടും'
                  : 'Indian Heritage Fused With Handcrafted Life'}
              </p>
            </div>

            {/* Bottom Animated Scroll Cue */}
            <div className="mb-6 flex flex-col items-center gap-2">
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-[#1E1B18] px-3 py-1 rounded-full bg-[#E99D1A] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18]">
                {lang === 'ml' ? 'അങ്ങാടി കാണാൻ താഴേക്ക് സ്ക്രോൾ ചെയ്യുക' : 'Scroll down to enter market'}
              </span>
              <div className="w-6 h-10 rounded-full border-2 border-[#1E1B18] flex items-start justify-center p-1 bg-[#FFFDF7] shadow-[2px_2px_0px_#1E1B18]">
                <div className="w-1.5 h-2.5 rounded-full bg-[#F15A24] animate-bounce" />
              </div>
            </div>
          </div>
        )}

        {/* Persistent Desi HUD: Location indicator, Sound toggle & Skip button */}
        {progress > 0.05 && progress < 0.92 && (
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-auto">
            {/* Street location badge */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFDF7] border-2 border-[#1E1B18] text-[#1E1B18] text-xs font-mono font-bold shadow-[2px_2px_0px_#1E1B18]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F15A24] animate-pulse" />
              <span>{getLocationLabel()}</span>
            </div>

            {/* Actions: Sound & Skip */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSound}
                aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
                className="p-2 rounded-full bg-[#FFFDF7] border-2 border-[#1E1B18] text-[#1E1B18] hover:bg-[#FAF4E6] shadow-[2px_2px_0px_#1E1B18] transition-all cursor-pointer"
                title={isMuted ? 'Sound Off (Click to turn on)' : 'Sound On'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-[#1E1B18]" /> : <Volume2 className="w-4 h-4 text-[#F15A24]" />}
              </button>

              <button
                onClick={handleSkipToStore}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F15A24] border-2 border-[#1E1B18] text-white text-xs font-black tracking-wide shadow-[2px_2px_0px_#1E1B18] hover:bg-[#E04D18] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{lang === 'ml' ? 'ഷോപ്പിലേക്ക്' : 'Skip to Store'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Minimal Bottom Progress Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#1E1B18] z-20">
          <div
            className="h-full bg-[#F15A24] transition-all duration-75 ease-out"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>

        {/* Cinematic Store Entrance Portal at the end of video */}
        {exitFade > 0.05 && (
          <div
            className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center transition-opacity duration-200 z-10 bg-[#FAF4E6]"
            style={{ opacity: exitFade }}
          >
            <div className="relative text-center px-4 transform -translate-y-4 max-w-lg bg-[#FFFDF7] p-8 rounded-3xl border-3 border-[#1E1B18] shadow-[8px_8px_0px_#1E1B18]">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E99D1A] border-2 border-[#1E1B18] text-[#1E1B18] text-xs font-black tracking-widest uppercase mb-3 shadow-[2px_2px_0px_#1E1B18]">
                <Sparkles className="w-4 h-4 text-[#1E1B18]" />
                <span>{lang === 'ml' ? 'അർലോ & കോ. സ്റ്റോറിലേക്ക് സ്വാഗതം' : 'ENTERING ARLO & CO. STORE'}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#1E1B18] font-desi-display lowercase">
                the 9 sacred craft stamps
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#C8331E] font-bold font-mono">
                {lang === 'ml' ? 'താഴേക്ക് സ്ക്രോൾ ചെയ്ത് 9 വിഭാഗങ്ങൾ കാണുക' : 'Scroll down to explore categories'}
              </p>
              <div className="mt-4 flex justify-center">
                <ChevronDown className="w-6 h-6 text-[#F15A24] animate-bounce" />
              </div>
            </div>
          </div>
        )}

        {/* Cinematic Fade-out mask directly dissolving into Category section at the end of scroll */}
        <div
          className="absolute inset-0 bg-[#FAF4E6] pointer-events-none transition-opacity duration-150"
          style={{ opacity: exitFade }}
        />
      </div>
    </div>
  );
}