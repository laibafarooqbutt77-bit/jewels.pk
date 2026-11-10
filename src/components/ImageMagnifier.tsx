import React, { useState, useRef, MouseEvent, TouchEvent } from 'react';
import { ZoomIn, X, Maximize2 } from 'lucide-react';
import { MetalColor } from '../types/jewellery';

interface ImageMagnifierProps {
  src: string;
  alt: string;
  color: MetalColor;
  zoomLevel?: number;
  magnifierSize?: number;
}

export const ImageMagnifier: React.FC<ImageMagnifierProps> = ({
  src,
  alt,
  color,
  zoomLevel = 2.4,
  magnifierSize = 180,
}) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isFullScreenZoom, setIsFullScreenZoom] = useState(false);
  const [touchPan, setTouchPan] = useState({ x: 50, y: 50 });
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleMouseEnter = () => {
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;

    const { top, left, width, height } = imgRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Boundary check
    if (x < 0 || y < 0 || x > width || y > height) {
      setShowMagnifier(false);
      return;
    }

    setCursorPosition({ x, y });
    setMagnifierPosition({
      x: x - magnifierSize / 2,
      y: y - magnifierSize / 2,
    });
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!imgRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const { top, left, width, height } = imgRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(width, touch.clientX - left));
    const y = Math.max(0, Math.min(height, touch.clientY - top));
    setTouchPan({
      x: (x / width) * 100,
      y: (y / height) * 100,
    });
  };

  return (
    <div className="relative w-full h-full select-none">
      {/* Main Container */}
      <div
        className="relative w-full h-full overflow-hidden rounded-2xl cursor-crosshair group bg-[#F8F5F0]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className="w-full h-full object-cover object-center contrast-[1.04] brightness-[1.01] saturate-[1.03] transition-all"
        />

        {/* Hover Cue Tag */}
        <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full border border-[#E0D5C7] text-[11px] text-[#241E1A] shadow-xs pointer-events-none transition-opacity group-hover:opacity-0">
          <ZoomIn className="w-3.5 h-3.5 text-[#B88E3E]" />
          <span>Hover to inspect macro details</span>
        </div>

        {/* Mobile Fullscreen Zoom Button */}
        <button
          onClick={() => setIsFullScreenZoom(true)}
          type="button"
          className="sm:hidden absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-full border border-[#E0D5C7] text-xs font-medium text-[#241E1A] shadow-xs active:bg-[#F2ECE3]"
          aria-label="Enlarge image"
        >
          <Maximize2 className="w-3.5 h-3.5 text-[#B88E3E]" />
          <span>Tap to zoom item</span>
        </button>

        {/* Circular Loupe Magnifier (Desktop) */}
        {showMagnifier && imgRef.current && (
          <div
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              height: `${magnifierSize}px`,
              width: `${magnifierSize}px`,
              top: `${magnifierPosition.y}px`,
              left: `${magnifierPosition.x}px`,
              borderRadius: '50%',
              border: '3px solid rgba(255, 255, 255, 0.95)',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(184, 142, 62, 0.4)',
              backgroundImage: `url('${src}')`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: `${imgRef.current.width * zoomLevel}px ${imgRef.current.height * zoomLevel}px`,
              backgroundPosition: `${-cursorPosition.x * zoomLevel + magnifierSize / 2}px ${
                -cursorPosition.y * zoomLevel + magnifierSize / 2
              }px`,
              zIndex: 30,
            }}
          >
            {/* Center crosshair dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#B88E3E]/60 ring-2 ring-white/80" />
            </div>
          </div>
        )}
      </div>

      {/* Full Screen Macro Inspection Modal for Mobile/Desktop */}
      {isFullScreenZoom && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 text-white border-b border-white/20">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-[#DFC17B] font-semibold">
                Macro Studio Inspection
              </span>
              <span className="text-xs text-white/70">· {color} Edition</span>
            </div>
            <button
              onClick={() => setIsFullScreenZoom(false)}
              className="p-2 text-white/80 hover:text-white bg-white/10 rounded-full transition-colors"
              aria-label="Close macro inspection"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div
            className="flex-1 w-full relative overflow-hidden flex items-center justify-center touch-none mt-2"
            onTouchMove={handleTouchMove}
          >
            <img
              src={src}
              alt={alt}
              style={{
                transformOrigin: `${touchPan.x}% ${touchPan.y}%`,
              }}
              className="w-full h-full max-h-[80vh] object-contain scale-[1.8] sm:scale-[2.2] transition-transform duration-75 select-none"
            />
          </div>

          <div className="text-center py-2 text-xs text-white/70">
            Drag with finger to inspect craftsmanship details, links, and finish.
          </div>
        </div>
      )}
    </div>
  );
};
