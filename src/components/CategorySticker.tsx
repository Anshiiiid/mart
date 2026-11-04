'use client';

import React from 'react';

interface CategoryStickerProps {
  slug: string;
  className?: string;
}

export default function CategorySticker({ slug, className = 'w-full h-full' }: CategoryStickerProps) {
  switch (slug) {
    case 'kitchen':
    case 'kitchen-cookware':
      // Indian Masala Thali with Spice Bowls (Matching Image 1)
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Ceramic Plate Shadow & Base */}
          <circle cx="50" cy="51" r="38" fill="#E8DFD1" />
          <circle cx="50" cy="50" r="38" fill="#FFFDF9" stroke="#E2DACB" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="31" fill="#F6EFE2" stroke="#ECE2D0" strokeWidth="1.5" />

          {/* Center Turmeric Bowl */}
          <circle cx="50" cy="50" r="9" fill="#EAB308" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="48" cy="48" r="2" fill="#FDE047" opacity="0.6" />

          {/* Outer Ring of 7 Spice Bowls */}
          {/* 1. Cinnamon / Garam Masala (Top) */}
          <circle cx="50" cy="27" r="7" fill="#881337" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="48.5" cy="25.5" r="1.5" fill="#FDA4AF" opacity="0.6" />

          {/* 2. Mustard Yellow (Top Right) */}
          <circle cx="69" cy="37" r="7" fill="#CA8A04" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="67.5" cy="35.5" r="1.5" fill="#FEF08A" opacity="0.6" />

          {/* 3. Coriander Green (Bottom Right) */}
          <circle cx="69" cy="63" r="7" fill="#15803D" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="67.5" cy="61.5" r="1.5" fill="#86EFAC" opacity="0.6" />

          {/* 4. Kashmiri Red Chili / Rani Pink (Bottom) */}
          <circle cx="50" cy="73" r="7" fill="#E11D48" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="48.5" cy="71.5" r="1.5" fill="#F472B6" opacity="0.6" />

          {/* 5. Mustard Seed Ink Black (Bottom Left) */}
          <circle cx="31" cy="63" r="7" fill="#111827" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="29.5" cy="61.5" r="1.5" fill="#9CA3AF" opacity="0.6" />

          {/* 6. Turmeric / Saffron Orange (Top Left) */}
          <circle cx="31" cy="37" r="7" fill="#D97706" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="29.5" cy="35.5" r="1.5" fill="#FCD34D" opacity="0.6" />
        </svg>
      );

    case 'tech':
    case 'cyber-audio':
    case 'computing-workspace':
      // Electric 2-Pin Plug with Coiled Wire (Matching Image 1)
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Two Metal Prongs at Top */}
          <rect x="41.5" y="11" width="5" height="13" rx="2.5" fill="#111827" />
          <rect x="53.5" y="11" width="5" height="13" rx="2.5" fill="#111827" />

          {/* Plug Main Capsule Body */}
          <rect x="35" y="21" width="30" height="34" rx="15" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
          
          {/* Subtle Side Grips */}
          <rect x="32.5" y="32" width="3" height="12" rx="1.5" fill="#CBD5E1" />
          <rect x="64.5" y="32" width="3" height="12" rx="1.5" fill="#CBD5E1" />

          {/* Center Amber Power Indicator */}
          <circle cx="50" cy="37" r="4.5" fill="#F59E0B" />
          <circle cx="48.5" cy="35.5" r="1.5" fill="#FEF3C7" />

          {/* Bottom Neck */}
          <rect x="46" y="54" width="8" height="5" rx="2" fill="#E2E8F0" />

          {/* Coiled Spiral Spring Cord in Golden Yellow */}
          <path
            d="M50 59 
               C40 63, 38 68, 50 71 
               C62 74, 60 79, 50 82 
               C40 85, 42 90, 52 92"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'kids':
    case 'kids-nursery':
      // Adorable Indian Auto-Rickshaw (Matching Image 1)
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Roof Canopy (Black Rounded) */}
          <rect x="25" y="17" width="50" height="17" rx="8" fill="#111827" />

          {/* Windshield Frame & Blue Glass */}
          <rect x="26" y="31" width="48" height="19" rx="5" fill="#FACC15" />
          <rect x="30" y="34" width="40" height="14" rx="3.5" fill="#BAE6FD" />
          {/* Windshield Glare Reflection */}
          <path d="M33 44 L38 36 L43 36 L38 44 Z" fill="#FFFFFF" opacity="0.6" />

          {/* Main Cabin Lower Body (Yellow) */}
          <rect x="25" y="48" width="50" height="23" rx="7" fill="#FACC15" />

          {/* Center Pink Headlight / Nose Badge */}
          <circle cx="50" cy="59" r="6" fill="#F472B6" />
          <circle cx="48" cy="57" r="2" fill="#FDF2F8" />

          {/* Two Black Headlight / Indicator Slots */}
          <rect x="31" y="57" width="8" height="5" rx="2" fill="#111827" />
          <rect x="61" y="57" width="8" height="5" rx="2" fill="#111827" />

          {/* Front Bumper & Wheels */}
          <rect x="44" y="69" width="12" height="12" rx="3" fill="#111827" />
          <rect x="27" y="69" width="8" height="10" rx="3" fill="#111827" />
          <rect x="65" y="69" width="8" height="10" rx="3" fill="#111827" />
        </svg>
      );

    case 'home':
    case 'home-appliances':
    case 'ambient-living':
    case 'modern-sanitation':
      // Whistling Blue Pressure Cooker (Matching Image 1)
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Steam Whistle Puffs Floating at Top */}
          <circle cx="50" cy="14" r="3.5" fill="#111827" />
          <circle cx="43" cy="8" r="2" fill="#111827" />
          <circle cx="57" cy="7" r="2.5" fill="#111827" />

          {/* Center Vent Whistle Nozzle */}
          <rect x="47.5" y="22" width="5" height="15" rx="1.5" fill="#FFFFFF" stroke="#111827" strokeWidth="1" />
          <rect x="44" y="20" width="12" height="5" rx="2" fill="#111827" />

          {/* Pressure Cooker White Lid */}
          <rect x="20" y="37" width="60" height="9" rx="4.5" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />

          {/* Black Side Handle on Right */}
          <rect x="76" y="39" width="16" height="6.5" rx="3" fill="#111827" />

          {/* Royal Blue Cooker Pot Body */}
          <rect x="24" y="44" width="52" height="34" rx="12" fill="#2563EB" />

          {/* Clean White Speed Line Stripe */}
          <rect x="30" y="58" width="40" height="3.5" rx="1.75" fill="#FFFFFF" opacity="0.95" />
        </svg>
      );

    case 'stationery':
      // Handcrafted Journal, Brass Pen & Stamp
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Open Diary / Craft Notebook */}
          <path
            d="M24 32 C35 29, 48 33, 50 36 C52 33, 65 29, 76 32 L74 72 C63 69, 52 73, 50 71 C48 73, 37 69, 26 72 Z"
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth="2"
          />
          {/* Ruled Notebook Lines */}
          <line x1="30" y1="44" x2="44" y2="46" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="30" y1="52" x2="44" y2="54" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="30" y1="60" x2="44" y2="62" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />

          <line x1="56" y1="46" x2="70" y2="44" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="56" y1="54" x2="70" y2="52" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />

          {/* Postal Wax Seal Stamp (Red) */}
          <circle cx="68" cy="64" r="7" fill="#E11D48" />
          <circle cx="68" cy="64" r="5" stroke="#FFFFFF" strokeWidth="1" fill="none" />

          {/* Diagonal Leaf Green & Gold Fountain Pen */}
          <g transform="rotate(-38 52 50)">
            <rect x="49" y="16" width="6" height="52" rx="3" fill="#1F5C3A" />
            <rect x="49" y="30" width="6" height="3" fill="#FACC15" />
            {/* Golden Nib */}
            <path d="M49 68 L52 79 L55 68 Z" fill="#FACC15" />
            <line x1="52" y1="70" x2="52" y2="76" stroke="#111827" strokeWidth="0.8" />
          </g>
        </svg>
      );

    case 'dress':
      // Indian Kasavu & Block-Print Kurta / Saree Motif
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Kurta Tunic in Leaf Green */}
          <path
            d="M34 22 L43 22 C45 28, 55 28, 57 22 L66 22 L77 34 L70 41 L65 35 L65 77 L35 77 L35 35 L30 41 L23 34 Z"
            fill="#1F5C3A"
          />

          {/* Golden Center Placket */}
          <rect x="47.5" y="22" width="5" height="24" rx="1" fill="#FACC15" />
          <circle cx="50" cy="28" r="1.2" fill="#111827" />
          <circle cx="50" cy="34" r="1.2" fill="#111827" />
          <circle cx="50" cy="40" r="1.2" fill="#111827" />

          {/* Golden Kasavu Border at Sleeves */}
          <rect x="23" y="32" width="7" height="3" fill="#FACC15" transform="rotate(45 23 32)" />
          <rect x="70" y="37" width="7" height="3" fill="#FACC15" transform="rotate(-45 70 37)" />

          {/* Golden Hem Border at Bottom */}
          <rect x="35" y="71" width="30" height="6" rx="1" fill="#FACC15" />
          <line x1="37" y1="74" x2="63" y2="74" stroke="#1F5C3A" strokeWidth="1" strokeDasharray="2 2" />

          {/* Traditional Motif Dot */}
          <circle cx="50" cy="56" r="3" fill="#FACC15" />
          <circle cx="44" cy="62" r="2" fill="#FACC15" opacity="0.8" />
          <circle cx="56" cy="62" r="2" fill="#FACC15" opacity="0.8" />
        </svg>
      );

    case 'footwear':
      // Handcrafted Braided Kolhapuri Chappal
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Tan Leather Sole Outline */}
          <path
            d="M44 18 C55 18, 62 26, 62 38 C62 48, 58 54, 58 64 C58 74, 53 79, 44 79 C35 79, 31 74, 31 64 C31 54, 35 48, 35 38 C35 26, 38 18, 44 18 Z"
            fill="#D97706"
          />

          {/* Warm Sand Footbed */}
          <path
            d="M44 21 C52 21, 58 28, 58 38 C58 46, 55 52, 55 62 C55 71, 50 76, 44 76 C38 76, 35 71, 35 62 C35 52, 38 46, 38 38 C38 28, 41 21, 44 21 Z"
            fill="#FEF08A"
          />

          {/* Artisan Braided Toe Ring Loop */}
          <circle cx="49" cy="27" r="5" stroke="#92400E" strokeWidth="2.5" fill="#FEF08A" />

          {/* Broad Hand-Braided Bridge Strap */}
          <path
            d="M34 46 Q44 42, 56 46"
            stroke="#92400E"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M34 46 Q44 42, 56 46"
            stroke="#F59E0B"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="3 3"
          />

          {/* Festive Red Pom-Pom Tassel in Center */}
          <circle cx="45" cy="44" r="5" fill="#E11D48" />
          <circle cx="45" cy="44" r="2.5" fill="#FACC15" />

          {/* Heel Pad */}
          <circle cx="44" cy="69" r="4" fill="#B45309" opacity="0.5" />
        </svg>
      );

    case 'jewellery':
      // Royal Indian Jhumka (Bell Earring with Pearl Drops)
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Top Circular Earring Stud (Haldi Gold) */}
          <circle cx="50" cy="22" r="8" fill="#FACC15" />
          {/* Emerald Center Gem */}
          <circle cx="50" cy="22" r="4" fill="#1F5C3A" />
          <circle cx="48.5" cy="20.5" r="1.2" fill="#86EFAC" />

          {/* Connecting Link Ring */}
          <circle cx="50" cy="33" r="3" stroke="#FACC15" strokeWidth="2" fill="none" />

          {/* Symmetrical Hanging Jhumka Bell Dome */}
          <path
            d="M28 53 C28 36, 72 36, 72 53 Z"
            fill="#FACC15"
          />

          {/* Filigree Arch Decoration Lines */}
          <path
            d="M34 50 Q50 43, 66 50"
            stroke="#B45309"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Dome Bottom Emerald Rim */}
          <rect x="27" y="53" width="46" height="4.5" rx="2" fill="#1F5C3A" />

          {/* 5 Hanging Dangling Pearls */}
          <circle cx="32" cy="65" r="3.5" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="32" y1="57.5" x2="32" y2="61.5" stroke="#FACC15" strokeWidth="1.5" />

          <circle cx="41" cy="68" r="3.5" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="41" y1="57.5" x2="41" y2="64.5" stroke="#FACC15" strokeWidth="1.5" />

          {/* Center Golden Bell Drop */}
          <circle cx="50" cy="70" r="4.5" fill="#FACC15" />
          <line x1="50" y1="57.5" x2="50" y2="65.5" stroke="#FACC15" strokeWidth="2" />
          <circle cx="50" cy="70" r="1.5" fill="#B45309" />

          <circle cx="59" cy="68" r="3.5" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="59" y1="57.5" x2="59" y2="64.5" stroke="#FACC15" strokeWidth="1.5" />

          <circle cx="68" cy="65" r="3.5" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="68" y1="57.5" x2="68" y2="61.5" stroke="#FACC15" strokeWidth="1.5" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="50" cy="50" r="36" fill="#FACC15" />
          <circle cx="50" cy="50" r="18" fill="#1F5C3A" />
        </svg>
      );
  }
}
