'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Product } from '@/lib/types';
import {
  RotateCw,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Check,
  Play,
  Pause,
  ArrowRight,
  Maximize2
} from 'lucide-react';

interface Interactive3DShowcaseProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onInstantBuy?: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
  lang: 'en' | 'ml';
}

export default function Interactive3DShowcase({
  products,
  onAddToCart,
  onInstantBuy,
  onSelectProduct,
  lang,
}: Interactive3DShowcaseProps) {
  const showcaseProducts = products.filter((p) => p.is3dAvailable);
  const [selectedProduct, setSelectedProduct] = useState<Product>(showcaseProducts[0] || products[0]);
  const [rotationAngle, setRotationAngle] = useState(45);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(0);
  const [isAdded, setIsAdded] = useState(false);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number | null>(null);

  // Auto-spin turntable loop
  useEffect(() => {
    if (!isAutoSpinning) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 2) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [isAutoSpinning]);

  const hotspots = [
    {
      id: 0,
      title: 'Desi Craft Inlay',
      titleMl: 'പാരമ്പര്യ കൊത്തുപണി',
      desc: 'Authentic Indian artisanal finish with everyday durability.',
      descMl: 'പരമ്പരാഗത പിച്ചള ഫിലിഗ്രിയും ഈടുനിൽക്കുന്ന ഘടനയും.',
      x: '68%',
      y: '48%',
    },
    {
      id: 1,
      title: 'Ergonomic Utility',
      titleMl: 'സ്മാർട്ട് സെൻസർ',
      desc: 'Clever design twist for small daily problem solving.',
      descMl: 'ദൈനംദിന ഉപയോഗം എളുപ്പമാക്കുന്ന രൂപകൽപ്പന.',
      x: '52%',
      y: '22%',
    },
    {
      id: 2,
      title: 'Solid Core Quality',
      titleMl: 'തെർമൽ കോർ',
      desc: 'Built to last for every Indian home, kitchen, and workspace.',
      descMl: 'ഓരോ ഇന്ത്യൻ വീടിനും ഇണങ്ങുന്ന തരത്തിൽ നിർമ്മിച്ചത്.',
      x: '38%',
      y: '72%',
    },
  ];

  // Mouse Drag
  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons === 1 && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = x / rect.width;
      setRotationAngle(Math.round(percent * 360));
      setIsAutoSpinning(false);
    }
  };

  // Touch Drag for Mobile Phones
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      touchStartRef.current = e.touches[0].clientX;
      setIsAutoSpinning(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartRef.current !== null && e.touches.length === 1 && containerRef.current) {
      const deltaX = e.touches[0].clientX - touchStartRef.current;
      setRotationAngle((prev) => (prev + Math.round(deltaX * 0.8) + 360) % 360);
      touchStartRef.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
  };

  const handleAddToCart = () => {
    onAddToCart(selectedProduct);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const rotateBy = (delta: number) => {
    setIsAutoSpinning(false);
    setRotationAngle((prev) => (prev + delta + 360) % 360);
  };

  return (
    <section id="showcase" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24 font-hatke-body">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F5C3A] text-white text-xs font-black uppercase tracking-wider mb-3 border-2 border-[#111827] shadow-[2px_2px_0px_#111827]">
            <Sparkles className="w-3.5 h-3.5 text-[#FACC15]" />
            <span>{lang === 'ml' ? '3D കാർഖാന അനുഭവം' : '3D INTERACTIVE WORKSHOP'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#111827] font-hatke-title">
            {lang === 'ml' ? '360° തിരിച്ചു പരിശോധിക്കാം' : 'Rotate. Inspect. Experience.'}
          </h2>
          <p className="text-sm text-[#111827]/80 mt-1 max-w-xl font-medium">
            {lang === 'ml'
              ? 'ഉൽപ്പന്നങ്ങൾ 360 ഡിഗ്രിയിൽ കറക്കി ഗുണനിലവാരവും സവിശേഷതകളും പരിശോധിക്കുക.'
              : 'Interact with our clever finds before you buy. 360° spin with craft detail hotspots.'}
          </p>
        </div>

        {/* Product selector buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {showcaseProducts.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedProduct(p);
                setRotationAngle(45);
              }}
              className={`px-3.5 py-2 rounded-full text-xs font-black whitespace-nowrap border-2 border-[#111827] transition-all cursor-pointer ${
                selectedProduct.id === p.id
                  ? 'bg-[#FACC15] text-[#111827] shadow-[2.5px_2.5px_0px_#111827]'
                  : 'bg-[#FFFFFF] text-[#111827] shadow-[1.5px_1.5px_0px_#111827] hover:bg-[#FAF9F6]'
              }`}
            >
              {lang === 'ml' && p.nameMl ? p.nameMl : p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main 3D Stage Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: 360 Turntable Viewport */}
        <div className="lg:col-span-9">
          <div
            ref={containerRef}
            onMouseMove={handleDrag}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative h-[380px] sm:h-[460px] rounded-3xl bg-[#FFFFFF] border-3 border-[#111827] shadow-[6px_6px_0px_#111827] p-8 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none"
          >
            {/* Ambient Radial Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(#FACC15_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

            {/* Rotating Product Container */}
            <div
              className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center transition-transform duration-75 ease-out"
              style={{
                transform: `perspective(1000px) rotateY(${rotationAngle}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="max-w-full max-h-full object-contain filter drop-shadow-[0_15px_20px_rgba(17,24,39,0.18)] pointer-events-none"
              />

              {/* Hotspots in Yellow #FACC15 with Black border */}
              {hotspots.map((hs) => (
                <button
                  key={hs.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveHotspot(hs.id);
                  }}
                  className={`absolute w-7 h-7 rounded-full border-2 border-[#111827] flex items-center justify-center text-xs font-black transition-all cursor-pointer ${
                    activeHotspot === hs.id
                      ? 'bg-[#1F5C3A] text-white scale-125 shadow-[2px_2px_0px_#111827]'
                      : 'bg-[#FACC15] text-[#111827] hover:scale-110 shadow-xs'
                  }`}
                  style={{ top: hs.y, left: hs.x }}
                  title={`Inspect Feature ${hs.id + 1}`}
                >
                  {hs.id + 1}
                </button>
              ))}
            </div>

            {/* Turntable Degree Counter */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-bold text-[#111827] px-3.5 py-1.5 rounded-full bg-[#FAF9F6] border-2 border-[#111827]">
              <span className="flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5 text-[#1F5C3A] animate-spin-slow" />
                <span>{rotationAngle}°</span>
              </span>
              <span className="text-[11px] text-[#1F5C3A] font-bold">
                {lang === 'ml' ? 'വലത്തോട്ടും ഇടത്തോട്ടും ഡ്രാഗ് ചെയ്യുക' : 'Drag to spin 360°'}
              </span>
            </div>
          </div>

          {/* Turntable Control Buttons */}
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <button
              onClick={() => rotateBy(-45)}
              className="px-3.5 py-1.5 rounded-full bg-[#FFFFFF] hover:bg-[#FACC15] border-2 border-[#111827] shadow-[2px_2px_0px_#111827] text-xs font-bold flex items-center gap-1 active:translate-y-[1px] cursor-pointer"
              title="Rotate Left 45°"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#1F5C3A]" />
              <span>-45°</span>
            </button>

            <button
              onClick={() => setIsAutoSpinning(!isAutoSpinning)}
              className={`px-3.5 py-1.5 rounded-full border-2 border-[#111827] shadow-[2px_2px_0px_#111827] text-xs font-bold flex items-center gap-1 active:translate-y-[1px] cursor-pointer ${
                isAutoSpinning ? 'bg-[#1F5C3A] text-white' : 'bg-[#FFFFFF] text-[#111827] hover:bg-[#FACC15]'
              }`}
              title="Auto-Rotate"
            >
              {isAutoSpinning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoSpinning ? 'Pause' : 'Auto Spin'}</span>
            </button>

            <button
              onClick={() => rotateBy(45)}
              className="px-3.5 py-1.5 rounded-full bg-[#FFFFFF] hover:bg-[#FACC15] border-2 border-[#111827] shadow-[2px_2px_0px_#111827] text-xs font-bold flex items-center gap-1 active:translate-y-[1px] cursor-pointer"
              title="Rotate Right 45°"
            >
              <span>+45°</span>
              <RotateCw className="w-3.5 h-3.5 text-[#1F5C3A]" />
            </button>

            <button
              onClick={() => {
                setIsAutoSpinning(false);
                setRotationAngle(0);
              }}
              className="px-3.5 py-1.5 rounded-full bg-[#FFFFFF] hover:bg-[#FACC15] border-2 border-[#111827] shadow-[2px_2px_0px_#111827] text-xs font-bold flex items-center gap-1 active:translate-y-[1px] cursor-pointer"
              title="Reset Angle to Front"
            >
              <span>Reset (0°)</span>
            </button>
          </div>
        </div>

        {/* Right: Craftsmanship Hotspot Inspector Card */}
        <div className="lg:col-span-3">
          <div className="p-6 rounded-3xl bg-[#FFFFFF] border-2 border-[#111827] shadow-[4px_4px_0px_#111827]">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-[#1F5C3A] text-white text-xs font-black flex items-center justify-center border border-[#111827]">
                {(activeHotspot ?? 0) + 1}
              </span>
              <h4 className="text-base font-black text-[#111827] font-hatke-title">
                {lang === 'ml'
                  ? hotspots[activeHotspot ?? 0]?.titleMl
                  : hotspots[activeHotspot ?? 0]?.title}
              </h4>
            </div>

            <p className="text-xs text-[#111827]/80 leading-relaxed font-medium mb-6">
              {lang === 'ml'
                ? hotspots[activeHotspot ?? 0]?.descMl
                : hotspots[activeHotspot ?? 0]?.desc}
            </p>

            <div className="space-y-2.5">
              {/* Add to Potli Button in Haldi Yellow */}
              <button
                onClick={handleAddToCart}
                className={`w-full py-3 rounded-full font-black text-xs border-2 border-[#111827] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isAdded
                    ? 'bg-[#1F5C3A] text-white shadow-[1px_1px_0px_#111827]'
                    : 'bg-[#FACC15] text-[#111827] shadow-[3px_3px_0px_#111827] hover:bg-[#EAB308] active:translate-y-[1px]'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>{lang === 'ml' ? 'സഞ്ചിയിൽ ചേർത്തു!' : 'Added to Potli!'}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {lang === 'ml' ? 'സഞ്ചിയിൽ ചേർക്കുക' : 'Add to Potli'} (₹
                      {selectedProduct.price.toLocaleString('en-IN')})
                    </span>
                  </>
                )}
              </button>

              {/* Instant Checkout Button in Vazhayila Green */}
              {onInstantBuy && (
                <button
                  onClick={() => onInstantBuy(selectedProduct)}
                  className="w-full py-2.5 rounded-full font-black text-xs border-2 border-[#111827] bg-[#1F5C3A] text-white shadow-[2px_2px_0px_#111827] hover:bg-[#14462B] active:translate-y-[1px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-[#FACC15]" />
                  <span>{lang === 'ml' ? 'തൽക്ഷണം ഓർഡർ ചെയ്യുക' : 'Instant Checkout'}</span>
                </button>
              )}

              {onSelectProduct && (
                <button
                  onClick={() => onSelectProduct(selectedProduct)}
                  className="w-full py-2 rounded-full font-bold text-xs border border-[#111827] bg-[#FAF9F6] hover:bg-[#FACC15] text-[#111827] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>{lang === 'ml' ? 'പൂർണ്ണ വിവരങ്ങൾ കാണുക' : 'Full Specifications'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
