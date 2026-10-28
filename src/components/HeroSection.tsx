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
      className="relative h-[260vh] sm:h-[280vh] bg-[#09070F] z-10"
    >
      {/* Sticky Fullscreen Viewport with Dynamic Viewport Height (prevents mobile URL bar jump) */}
      <div
        className="sticky top-0 h-screen h-[100dvh] w-full overflow-hidden flex items-center justify-center bg-[#09070F] select-none"
        style={{ opacity: overallOpacity }}
      >
        {/* Loading Skeleton / Placeholder before video streams */}
        {!isVideoReady && (
          <div className="absolute inset-0 z-0 flex flex-col items-center justify-center bg-[#09070F]">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20">
              <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 animate-ping"></div>
              <div className="w-full h-full rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-xs tracking-widest uppercase font-mono text-amber-400/80 animate-pulse">
              {lang === 'ml' ? 'അങ്ങാടി ഒരുങ്ങുന്നു...' : 'Loading Cyber Bazaar...'}
            </p>
          </div>
        )}

        {/* Dual-responsive Video Layer: Native HTML5 <source> matching phone portrait vs desktop landscape */}
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
          {/* Mobile phone portrait stream (720x1280) */}
          <source
            src="/scroll-mobile.mp4"
            type="video/mp4"
            media="(max-width: 767px), (orientation: portrait)"
          />
          {/* Desktop & laptop widescreen stream (1280x720) */}
          <source
            src="/scroll-desktop.mp4"
            type="video/mp4"
          />
        </video>

        {/* Top Vignette & Ambient Atmosphere */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#09070F]/80 via-[#09070F]/30 to-transparent pointer-events-none" />

        {/* Bottom edge gradient blend */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#09070F] via-[#09070F]/60 to-transparent pointer-events-none" />

        {/* Intro Overlay: Welcomes user and prompts scroll; smoothly dissolves as user scrolls */}
        {introFade > 0.01 && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-between p-6 sm:p-10 pointer-events-none transition-opacity duration-200"
            style={{ opacity: introFade }}
          >
            {/* Top Badge */}
            <div className="mt-4 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/30 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase font-mono">
                {lang === 'ml' ? 'ധമാക്ക ക്ലിയറൻസ് സെയിൽ • സ്പെഷ്യൽ ഓഫറുകൾ' : 'DHAMAKA CLEARANCE SALE • LIVE'}
              </span>
            </div>

            {/* Center Title Card */}
            <div className="text-center max-w-xl mx-auto px-4">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white font-serif uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
                HATKE<span className="text-amber-400">.</span>HAAT
              </h1>
              <p className="mt-2 text-xs sm:text-sm md:text-base font-medium text-amber-200/90 tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                {lang === 'ml'
                  ? 'പരമ്പരാഗത കേരളീയ വിപണിയും ആധുനിക ടെക്നോളജിയും ഒന്നിക്കുന്ന ഇടം'
                  : 'Indian Heritage Fused With Cyberpunk Innovation'}
              </p>
            </div>

            {/* Bottom Animated Scroll Cue */}
            <div className="mb-6 flex flex-col items-center gap-2">
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-amber-300/90 font-semibold drop-shadow">
                {lang === 'ml' ? 'അങ്ങാടി കാണാൻ താഴേക്ക് സ്ക്രോൾ ചെയ്യുക' : 'Scroll down to enter market'}
              </span>
              <div className="w-6 h-10 rounded-full border-2 border-amber-400/50 flex items-start justify-center p-1 bg-black/40 backdrop-blur-sm">
                <div className="w-1.5 h-2.5 rounded-full bg-amber-400 animate-bounce" />
              </div>
            </div>
          </div>
        )}

        {/* Persistent Cyber HUD: Location indicator, Sound toggle & Skip button */}
        {progress > 0.05 && progress < 0.92 && (
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-auto">
            {/* Street location badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0E0B1A]/85 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs font-mono font-medium shadow-lg">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>{getLocationLabel()}</span>
            </div>

            {/* Actions: Sound & Skip */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSound}
                aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
                className="p-2 rounded-full bg-[#0E0B1A]/85 backdrop-blur-md border border-amber-500/30 text-amber-300 hover:text-white hover:border-amber-400 transition-colors shadow-lg"
                title={isMuted ? 'Sound Off (Click to turn on)' : 'Sound On'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>

              <button
                onClick={handleSkipToStore}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)]"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{lang === 'ml' ? 'ഷോപ്പിലേക്ക്' : 'Skip to Store'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Minimal Bottom Progress Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40 backdrop-blur-sm z-20">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.8)] transition-all duration-75 ease-out"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>

        {/* Cinematic Fade-out mask directly dissolving into Category section at the end of scroll */}
        <div
          className="absolute inset-0 bg-[#09070F] pointer-events-none transition-opacity duration-150"
          style={{ opacity: exitFade }}
        />
      </div>
    </div>
  );
}