import React, { useState } from 'react';
import { MetalColor } from '../types/jewellery';

interface ProductImageProps {
  src: string;
  alt: string;
  color?: MetalColor;
  category?: string;
  className?: string;
  aspectRatio?: 'square' | 'portrait';
  zoomOnHover?: boolean;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  color = 'Gold',
  category = 'jewellery',
  className = '',
  aspectRatio = 'portrait',
  zoomOnHover = true,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const isGold = color === 'Gold';

  // Fallback Luxury SVG Studio Illustration in case external network fails
  const renderLuxuryFallback = () => {
    const isRing = category.includes('ring');
    const isEarring = category.includes('earring');
    const isCuff = category.includes('cuff') || category.includes('bracelet');
    const isNecklace = category.includes('necklace') || category.includes('chain');

    const primaryMetal = isGold ? '#DFC17B' : '#E2E8F0';
    const secondaryMetal = isGold ? '#F6E7B0' : '#F8FAFC';
    const darkMetal = isGold ? '#B88E3E' : '#94A3B8';
    const deepShadow = isGold ? '#8C6724' : '#64748B';

    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#FAF8F5] via-[#F4EFEB] to-[#EAE3D8] relative select-none">
        {/* Soft Radial Studio Spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.85)_0%,transparent_70%)]" />

        {/* Vector SVG rendering matching the exact product silhouette */}
        <svg
          viewBox="0 0 200 200"
          className="w-3/4 h-3/4 max-w-[190px] max-h-[190px] drop-shadow-xl relative z-10 transition-transform duration-300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`metalGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={secondaryMetal} />
              <stop offset="35%" stopColor={primaryMetal} />
              <stop offset="70%" stopColor={darkMetal} />
              <stop offset="100%" stopColor={deepShadow} />
            </linearGradient>

            <linearGradient id={`specularGrad-${color}`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="48%" stopColor="white" stopOpacity="0.8" />
              <stop offset="52%" stopColor="white" stopOpacity="0.9" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>

            <radialGradient id="pedestalShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(40, 30, 24, 0.4)" />
              <stop offset="50%" stopColor="rgba(40, 30, 24, 0.15)" />
              <stop offset="100%" stopColor="rgba(40, 30, 24, 0)" />
            </radialGradient>
          </defs>

          {/* Contact Shadow Plane */}
          <ellipse cx="100" cy="172" rx="65" ry="12" fill="url(#pedestalShadow)" />

          {isRing ? (
            /* Luxury Dome / Signet Ring Silhouette */
            <g>
              {/* Outer Ring Shank */}
              <ellipse cx="100" cy="120" rx="46" ry="38" stroke={`url(#metalGrad-${color})`} strokeWidth="14" fill="none" />
              {/* Top Sculpted Dome */}
              <path
                d="M60 95 C60 70, 140 70, 140 95 C140 110, 60 110, 60 95 Z"
                fill={`url(#metalGrad-${color})`}
              />
              {/* Polished Dome Crown */}
              <ellipse cx="100" cy="90" rx="30" ry="14" fill={`url(#specularGrad-${color})`} opacity="0.6" />
              {/* Center Radiant Gem */}
              <circle cx="100" cy="90" r="5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
              <circle cx="100" cy="90" r="2" fill="#F8FAFC" />
            </g>
          ) : isEarring ? (
            /* Luxury Croissant / Chunky Hoop Earring Silhouette */
            <g>
              <ellipse cx="100" cy="95" rx="36" ry="42" stroke={`url(#metalGrad-${color})`} strokeWidth="16" strokeDasharray="210 30" fill="none" />
              {/* Ridges */}
              <path d="M72 80 C80 95, 80 110, 72 125" stroke="white" strokeWidth="2.5" opacity="0.7" fill="none" />
              <path d="M128 80 C120 95, 120 110, 128 125" stroke="white" strokeWidth="2.5" opacity="0.7" fill="none" />
              {/* Earring Latch Post */}
              <line x1="88" y1="56" x2="112" y2="56" stroke={`url(#metalGrad-${color})`} strokeWidth="4" strokeLinecap="round" />
            </g>
          ) : isCuff ? (
            /* Architectural Open Hand Cuff Silhouette */
            <g>
              <path
                d="M50 140 C35 110, 35 70, 65 45 C95 20, 140 25, 155 60 C165 85, 160 120, 145 140"
                stroke={`url(#metalGrad-${color})`}
                strokeWidth="18"
                strokeLinecap="round"
                fill="none"
              />
              {/* Specular Highlight along outer edge */}
              <path
                d="M50 140 C35 110, 35 70, 65 45 C95 20, 140 25, 155 60 C165 85, 160 120, 145 140"
                stroke={`url(#specularGrad-${color})`}
                strokeWidth="5"
                fill="none"
                opacity="0.8"
              />
              {/* Open End Finials */}
              <circle cx="50" cy="140" r="9" fill={`url(#metalGrad-${color})`} />
              <circle cx="145" cy="140" r="9" fill={`url(#metalGrad-${color})`} />
            </g>
          ) : (
            /* Fluid Herringbone / Pendant Necklace Silhouette */
            <g>
              {/* Curved Chain */}
              <path
                d="M45 40 Q100 135 155 40"
                stroke={`url(#metalGrad-${color})`}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M45 40 Q100 135 155 40"
                stroke={`url(#specularGrad-${color})`}
                strokeWidth="3"
                fill="none"
                opacity="0.9"
              />
              {/* Hanging Medallion */}
              <circle cx="100" cy="122" r="18" fill={`url(#metalGrad-${color})`} />
              <circle cx="100" cy="122" r="14" stroke="white" strokeWidth="1" strokeDasharray="4 2" fill="none" opacity="0.7" />
              <polygon points="100,112 103,119 110,122 103,125 100,132 97,125 90,122 97,119" fill="#FFFFFF" opacity="0.9" />
            </g>
          )}
        </svg>

        {/* Quiet Brand Spec Label */}
        <div className="text-center relative z-10 mt-1">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8C7A6E]">
            {isGold ? '18k PVD Gold' : 'Polished Silver Steel'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`relative w-full overflow-hidden bg-[#F6F2EC] ${
        aspectRatio === 'square' ? 'aspect-square' : 'aspect-[4/5]'
      } ${className}`}
    >
      {/* Loading Skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#EFEAE2] via-[#F7F3EE] to-[#EFEAE2] animate-pulse" />
      )}

      {/* Actual Product Photo */}
      {!hasError && src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover object-center contrast-[1.04] brightness-[1.01] saturate-[1.03] transition-all duration-500 ${
            zoomOnHover ? 'group-hover:scale-105' : ''
          } ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      ) : (
        renderLuxuryFallback()
      )}
    </div>
  );
};
