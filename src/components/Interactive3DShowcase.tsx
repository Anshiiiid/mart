'use client';

import React, { useState, useRef } from 'react';
import { Product } from '@/lib/types';
import { RotateCw, Sparkles, Layers, Sliders, ShieldCheck, Eye, ShoppingBag, Check } from 'lucide-react';

interface Interactive3DShowcaseProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  lang: 'en' | 'ml';
}

export default function Interactive3DShowcase({ products, onAddToCart, lang }: Interactive3DShowcaseProps) {
  // Pick products that have 3D available
  const showcaseProducts = products.filter((p) => p.is3dAvailable);
  const [selectedProduct, setSelectedProduct] = useState<Product>(showcaseProducts[0] || products[0]);
  const [rotationAngle, setRotationAngle] = useState(45);
  const [isHologram, setIsHologram] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(0);
  const [isAdded, setIsAdded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const hotspots = [
    {
      id: 0,
      title: 'Craftsmanship Inlay',
      titleMl: 'പാരമ്പര്യ കൊത്തുപണി',
      desc: 'Handcrafted Indian temple filigree fused with aerospace alloy.',
      descMl: 'പരമ്പരാഗത പിച്ചള ഫിലിഗ്രിയും എയ്റോസ്പേസ് അലോയിയും.',
      x: '68%',
      y: '48%',
    },
    {
      id: 1,
      title: 'Holographic Haptics',
      titleMl: 'ടച്ച് സെൻസർ',
      desc: 'OLED touch display with micro-vibration feedback.',
      descMl: 'മൈക്രോ-ഹാപ്റ്റിക് റെസ്‌പോൺസുള്ള ടച്ച് കൺട്രോൾ.',
      x: '52%',
      y: '22%',
    },
    {
      id: 2,
      title: 'Vortex Thermal Core',
      titleMl: 'തെർമൽ കോർ',
      desc: '360° high efficiency cyclonic airflow distribution.',
      descMl: '360 ഡിഗ്രി താപ സഞ്ചാരം ഉറപ്പാക്കുന്ന സൈക്ലോണിക് കോർ.',
      x: '38%',
      y: '72%',
    },
  ];

  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons === 1 && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = x / rect.width;
      setRotationAngle(Math.round(percent * 360));
    }
  };

  const handleAddToCart = () => {
    onAddToCart(selectedProduct);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <section id="showcase" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>{lang === 'ml' ? '360° 3D ഇൻസ്പെക്ഷൻ ലബോറട്ടറി' : '360° INTERACTIVE TURNTABLE'}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-serif mb-4">
          <span className="block">{lang === 'ml' ? '3D മോഡൽ റൊട്ടേഷൻ' : 'Experience In 360 Degrees'}</span>
          <span className="cyber-gradient-text text-2xl sm:text-3xl block mt-1">
            {lang === 'ml' ? 'സ്പിൻ ചെയ്ത് കരവിരുതും സാങ്കേതികതയും പരിശോധിക്കുക' : 'Drag or Slide to Inspect Every Angle'}
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-400">
          {lang === 'ml'
            ? 'ഓരോ ഉൽപ്പന്നത്തിന്റെയും പരമ്പരാഗത കരവിരുതും നിർമ്മാണ സാങ്കേതികതയും 360 ഡിഗ്രിയിൽ നേരിട്ട് പരിശോധിക്കാം.'
            : 'Inspect handcrafted textures, temple brass engravings, and internal components with full rotational freedom.'}
        </p>
      </div>

      {/* Main 3D Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Product Selector Tabs */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <span className="text-xs uppercase font-mono tracking-widest text-slate-400 px-1">
            {lang === 'ml' ? 'തിരഞ്ഞെടുക്കാവുന്ന മോഡലുകൾ' : 'Select Prototype'}
          </span>
          {showcaseProducts.map((p) => {
            const isSelected = p.id === selectedProduct.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedProduct(p)}
                className={`p-3.5 rounded-xl text-left transition-all border flex items-center gap-3 ${
                  isSelected
                    ? 'bg-[#1D1737] border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                    : 'bg-[#100D1F]/60 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="w-12 h-12 rounded-lg bg-black/50 overflow-hidden flex-shrink-0 border border-slate-700">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {lang === 'ml' && p.nameMl ? p.nameMl : p.name}
                  </h4>
                  <span className="text-[11px] text-amber-400 font-black">
                    ₹{p.price.toLocaleString('en-IN')}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Hologram Wireframe Mode Toggle */}
          <div className="mt-4 p-4 rounded-xl glass-panel border border-cyan-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'ml' ? 'ഹോളോഗ്രാം മോഡ്' : 'Hologram Shader'}</span>
              </span>
              <button
                onClick={() => setIsHologram(!isHologram)}
                className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                  isHologram ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    isHologram ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              {isHologram ? 'Holographic schematic activated' : 'Realistic studio lighting'}
            </p>
          </div>
        </div>

        {/* Center: 3D Turntable Stage */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div
            ref={containerRef}
            onMouseMove={handleDrag}
            className={`relative w-full aspect-square max-w-[480px] rounded-3xl border-2 transition-all select-none cursor-ew-resize overflow-hidden flex items-center justify-center ${
              isHologram
                ? 'bg-[#08182B] border-cyan-400 shadow-[0_0_50px_rgba(6,182,212,0.4)]'
                : 'bg-gradient-to-b from-[#181329] via-[#0E0B1A] to-[#07050E] border-amber-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)]'
            }`}
          >
            {/* Turntable Floor Ring (3D perspective) */}
            <div className="absolute bottom-6 w-72 h-14 rounded-[100%] border-2 border-amber-500/30 bg-amber-500/5 shadow-[0_0_30px_rgba(245,158,11,0.2)] transform -rotate-x-60 pointer-events-none" />

            {/* Rotating Product Asset Container */}
            <div
              className="relative w-4/5 h-4/5 flex items-center justify-center transition-transform duration-75"
              style={{
                transform: `perspective(1000px) rotateY(${rotationAngle}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className={`max-w-full max-h-full object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.9)] transition-all ${
                  isHologram ? 'hue-rotate-180 brightness-125 contrast-150 invert-[0.1]' : ''
                }`}
                draggable={false}
              />
            </div>

            {/* Interactive Hotspots Pins */}
            {hotspots.map((hs) => (
              <button
                key={hs.id}
                onClick={() => setActiveHotspot(hs.id)}
                className={`absolute w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                  activeHotspot === hs.id
                    ? 'scale-125 bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.9)] z-20'
                    : 'bg-cyan-500/80 text-black shadow-[0_0_10px_rgba(6,182,212,0.6)] animate-pulse'
                }`}
                style={{ top: hs.y, left: hs.x }}
                title={hs.title}
              >
                <span className="text-[10px] font-black">{hs.id + 1}</span>
              </button>
            ))}

            {/* Rotation Angle HUD Badge */}
            <div className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-black/70 border border-slate-700 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5">
              <RotateCw className="w-3 h-3 text-cyan-400 animate-spin" />
              <span>Y-AXIS: {rotationAngle}°</span>
            </div>

            <div className="absolute top-4 right-4 px-2.5 py-1 rounded-md bg-black/70 border border-slate-700 text-[10px] font-mono text-amber-300">
              DRAG TO ROTATE
            </div>
          </div>

          {/* Manual Rotation Slider */}
          <div className="w-full max-w-md mt-6 flex items-center gap-4 px-4">
            <span className="text-xs text-slate-400 font-mono">0°</span>
            <input
              type="range"
              min="0"
              max="360"
              value={rotationAngle}
              onChange={(e) => setRotationAngle(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <span className="text-xs text-slate-400 font-mono">360°</span>
          </div>
        </div>

        {/* Right: Active Hotspot Deep-Dive & Action */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="p-6 rounded-2xl glass-card border border-amber-500/30">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>{lang === 'ml' ? 'കരവിരുതിന്റെ വിശദാംശങ്ങൾ' : 'Inspected Element'}</span>
            </div>

            {activeHotspot !== null && hotspots[activeHotspot] ? (
              <div>
                <h4 className="text-base font-bold text-white mb-1">
                  {lang === 'ml' ? hotspots[activeHotspot].titleMl : hotspots[activeHotspot].title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'ml' ? hotspots[activeHotspot].descMl : hotspots[activeHotspot].desc}
                </p>
              </div>
            ) : null}

            {/* Specs Summary */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Traditional Element:</span>
                <span className="text-amber-300 font-semibold">{selectedProduct.traditionalArtTag}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Inventory Status:</span>
                <span className="text-emerald-400 font-semibold">{selectedProduct.stock} Units Ready</span>
              </div>
            </div>
          </div>

          {/* Quick Buy Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1C1533] to-[#100C1F] border border-amber-500/40">
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <span className="text-xl font-black text-amber-400">
                  ₹{selectedProduct.price.toLocaleString('en-IN')}
                </span>
                {selectedProduct.originalPrice && (
                  <span className="text-xs text-slate-500 line-through ml-2">
                    ₹{selectedProduct.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                Exclusive
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                isAdded
                  ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-[0_0_25px_rgba(245,158,11,0.4)]'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{lang === 'ml' ? 'കാർട്ടിൽ ചേർത്തു' : 'Added to Cart!'}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>{lang === 'ml' ? 'കാർട്ടിലേക്ക് ചേർക്കുക' : 'Add To Cart Now'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
