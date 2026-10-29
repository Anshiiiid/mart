'use client';

import React, { useState, useRef } from 'react';
import { Product } from '@/lib/types';
import { RotateCw, Sparkles, Layers, Sliders, ShieldCheck, Eye, ShoppingBag, Check, Compass } from 'lucide-react';

interface Interactive3DShowcaseProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  lang: 'en' | 'ml';
}

export default function Interactive3DShowcase({ products, onAddToCart, lang }: Interactive3DShowcaseProps) {
  const showcaseProducts = products.filter((p) => p.is3dAvailable);
  const [selectedProduct, setSelectedProduct] = useState<Product>(showcaseProducts[0] || products[0]);
  const [rotationAngle, setRotationAngle] = useState(45);
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
      title: 'Ergonomic Touch',
      titleMl: 'സ്മാർട്ട് സെൻസർ',
      desc: 'Intelligent touch controls with tactile feedback.',
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
    <section id="showcase" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative select-none">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#19857B] text-white border-2 border-[#1E1B18] shadow-[2.5px_2.5px_0px_#1E1B18] text-xs font-black uppercase tracking-widest mb-4">
          <Compass className="w-4 h-4 text-white animate-spin-slow" />
          <span>{lang === 'ml' ? '360° ദേശി കരവിരുദ് കാർഖാന' : '360° ARTISAN WORKSHOP (KARKHANA)'}</span>
        </div>
        <h2 className="text-4xl sm:text-6xl font-black text-[#1E1B18] font-desi-display lowercase mb-3">
          <span>{lang === 'ml' ? '3D മോഡൽ പരിശോധിക്കുക' : 'rotate & inspect every detail'}</span>
        </h2>
        <p className="text-sm sm:text-base font-medium text-[#1E1B18]/80 max-w-xl mx-auto">
          {lang === 'ml'
            ? 'മൗസ് ഡ്രാഗ് ചെയ്ത് 360 ഡിഗ്രിയിൽ ഉൽപ്പന്നങ്ങൾ പരിശോധിക്കുക. പാരമ്പര്യ പിച്ചള കൊത്തുപണികളും ഘടനയും നേരിട്ട് കാണാം.'
            : 'Click and drag the workshop turntable to inspect handcrafted metalwork, filigree handles, and artisan joinery.'}
        </p>
      </div>

      {/* Main 3D Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Product Selector Tabs */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <span className="text-xs uppercase font-mono font-black tracking-widest text-[#F15A24] px-1">
            {lang === 'ml' ? 'തിരഞ്ഞെടുക്കാവുന്ന മാസ്റ്റർപീസുകൾ' : 'Select Masterpiece'}
          </span>
          {showcaseProducts.map((p) => {
            const isSelected = p.id === selectedProduct.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedProduct(p)}
                className={`p-3.5 rounded-2xl text-left transition-all border-2 border-[#1E1B18] flex items-center gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFFDF7] shadow-[4px_4px_0px_#1E1B18] translate-x-1 ring-2 ring-[#F15A24]'
                    : 'bg-[#FFFDF7]/60 hover:bg-[#FFFDF7] shadow-[2px_2px_0px_#1E1B18] text-[#1E1B18]/70'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#FAF4E6] border border-[#1E1B18] p-1 overflow-hidden shrink-0">
                  <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#1E1B18] font-desi-serif">
                    {lang === 'ml' && p.nameMl ? p.nameMl : p.name}
                  </h4>
                  <span className="text-xs text-[#F15A24] font-black font-mono">
                    ₹{p.price.toLocaleString('en-IN')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Center: 3D Turntable Stage */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div
            ref={containerRef}
            onMouseMove={handleDrag}
            className="relative w-full aspect-square max-w-[480px] rounded-3xl border-3 border-[#1E1B18] bg-[#FFFDF7] shadow-[8px_8px_0px_#1E1B18] select-none cursor-ew-resize overflow-hidden flex items-center justify-center p-6"
          >
            {/* Turntable Floor Ring (3D perspective) */}
            <div className="absolute bottom-8 w-72 h-14 rounded-[100%] border-2 border-[#1E1B18] bg-[#E99D1A]/20 transform -rotate-x-60 pointer-events-none" />

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
                className="max-w-full max-h-full object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.25)]"
              />

              {/* Interactive Hotspot Pins */}
              {hotspots.map((hs) => (
                <button
                  key={hs.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveHotspot(hs.id);
                  }}
                  className={`absolute w-7 h-7 rounded-full border-2 border-[#1E1B18] flex items-center justify-center text-xs font-black transition-all cursor-pointer ${
                    activeHotspot === hs.id
                      ? 'bg-[#F15A24] text-white scale-125 shadow-[2px_2px_0px_#1E1B18]'
                      : 'bg-[#E99D1A] text-[#1E1B18] hover:scale-110 shadow-sm'
                  }`}
                  style={{ top: hs.y, left: hs.x }}
                >
                  {hs.id + 1}
                </button>
              ))}
            </div>

            {/* Turntable Slider Prompt at Bottom */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-bold text-[#1E1B18] font-mono px-3 py-1.5 rounded-full bg-[#FAF4E6] border-2 border-[#1E1B18]">
              <span className="flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5 text-[#F15A24] animate-spin-slow" />
                <span>{rotationAngle}°</span>
              </span>
              <span className="text-[11px] text-[#C8331E]">
                {lang === 'ml' ? 'വലത്തോട്ടും ഇടത്തോട്ടും ഡ്രാഗ് ചെയ്യുക' : 'Drag left / right to rotate'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Craftsmanship Hotspot Inspector Card */}
        <div className="lg:col-span-3">
          <div className="p-6 rounded-3xl bg-[#FFFDF7] border-2 border-[#1E1B18] shadow-[4px_4px_0px_#1E1B18]">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-[#F15A24] text-white text-xs font-black flex items-center justify-center border border-[#1E1B18]">
                {(activeHotspot ?? 0) + 1}
              </span>
              <h4 className="text-base font-black text-[#1E1B18] font-desi-serif">
                {lang === 'ml'
                  ? hotspots[activeHotspot ?? 0]?.titleMl
                  : hotspots[activeHotspot ?? 0]?.title}
              </h4>
            </div>

            <p className="text-xs text-[#1E1B18]/80 leading-relaxed font-medium mb-6">
              {lang === 'ml'
                ? hotspots[activeHotspot ?? 0]?.descMl
                : hotspots[activeHotspot ?? 0]?.desc}
            </p>

            <button
              onClick={handleAddToCart}
              className={`w-full py-3 rounded-full font-black text-xs border-2 border-[#1E1B18] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isAdded
                  ? 'bg-[#19857B] text-white shadow-[1px_1px_0px_#1E1B18]'
                  : 'bg-[#F15A24] text-white shadow-[3px_3px_0px_#1E1B18] hover:bg-[#E04D18]'
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
                    {lang === 'ml' ? 'ഇത് സഞ്ചിയിൽ വാങ്ങുക' : 'Buy This Item'} (₹
                    {selectedProduct.price.toLocaleString('en-IN')})
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}