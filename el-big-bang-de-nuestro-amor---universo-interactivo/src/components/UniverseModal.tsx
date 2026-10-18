import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UniverseItem } from '../data/universes';
import { X } from 'lucide-react';

interface UniverseModalProps {
  universe: UniverseItem | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  partnerName?: string;
}

export const UniverseModal: React.FC<UniverseModalProps> = ({
  universe,
  onClose,
  onNext,
  onPrev,
}) => {
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);
  const isMouseDownRef = useRef<boolean>(false);
  const mouseStartXRef = useRef<number>(0);

  if (!universe) return null;

  // Touch Swipe Handlers (Mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = endX - touchStartXRef.current;
    const diffY = endY - touchStartYRef.current;

    // Horizontal swipe: left = next, right = prev
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        onNext();
      } else {
        onPrev();
      }
    } else if (diffY > 70 && Math.abs(diffY) > Math.abs(diffX)) {
      // Swipe down to close
      onClose();
    }
  };

  // Mouse Drag Handlers (Desktop fallback for swipe)
  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDownRef.current = true;
    mouseStartXRef.current = e.clientX;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current) return;
    isMouseDownRef.current = false;
    const diffX = e.clientX - mouseStartXRef.current;
    if (Math.abs(diffX) > 50) {
      if (diffX < 0) {
        onNext();
      } else {
        onPrev();
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-6 overflow-hidden">
        {/* Translucent backdrop so the main 3D universe and background galaxies stay visible all around! */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] cursor-pointer"
        />

        {/* Ultra-Clean, Swipeable Romantic Love Card with Embedded Galaxy Background */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 12 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          className="relative w-full max-w-sm sm:max-w-md bg-slate-950/90 border border-pink-400/35 rounded-[30px] shadow-2xl overflow-hidden my-auto z-10 p-5 sm:p-7 select-none cursor-grab active:cursor-grabbing backdrop-blur-md"
          style={{
            boxShadow: `0 0 60px ${universe.color.glow}, 0 25px 50px rgba(0,0,0,0.95)`,
          }}
        >
          {/* 1. Embedded Spinning Spiral Galaxy & Nebula Background inside the card */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[30px]">
            {/* Spinning galactic spiral nebula */}
            <div
              className="absolute -inset-10 opacity-35 mix-blend-screen pointer-events-none animate-[spin_80s_linear_infinite]"
              style={{
                background: `radial-gradient(circle at 45% 45%, ${universe.color.primary} 0%, transparent 50%),
                             radial-gradient(circle at 60% 60%, ${universe.color.secondary} 0%, transparent 45%),
                             conic-gradient(from 0deg at 50% 50%, transparent 0deg, ${universe.color.primary}33 70deg, transparent 130deg, ${universe.color.secondary}44 200deg, transparent 260deg, #ff82e833 310deg, transparent 360deg)`,
                filter: 'blur(16px)',
              }}
            />
            {/* Twinkling stardust inside the card */}
            <div className="absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.85)_1px,transparent_1px)] [background-size:26px_26px]" />
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(255,215,240,0.9)_1.5px,transparent_1.5px)] [background-size:48px_48px]" />
          </div>

          {/* Subtle cosmic aura corner glows */}
          <div
            className="absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl pointer-events-none opacity-30"
            style={{ backgroundColor: universe.color.primary }}
          />
          <div
            className="absolute -bottom-24 -left-24 w-60 h-60 rounded-full blur-3xl pointer-events-none opacity-20"
            style={{ backgroundColor: universe.color.secondary }}
          />

          {/* Top-Right Floating Close Button */}
          <div className="relative flex justify-end">
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-slate-400 hover:text-white active:scale-90 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/50 transition-all cursor-pointer"
              title="Cerrar carta (o desliza hacia abajo)"
              aria-label="Cerrar carta"
            >
              <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
          </div>

          {/* Card Content: Pure, intimate, romantic */}
          <div className="relative pt-1 sm:pt-2 space-y-4 sm:space-y-5 text-center">
            {/* Celestial Star Avatar */}
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-xl relative overflow-hidden">
              <span className="relative z-10">{universe.emoji}</span>
              <div
                className="absolute inset-0 opacity-45"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${universe.color.secondary}, ${universe.color.primary})`,
                  boxShadow: `0 0 25px ${universe.color.glow}`,
                }}
              />
            </div>

            {/* Title */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-['Outfit']">
                {universe.name}
              </h2>
            </div>

            {/* Concise Love Message (Mobile-responsive typography) */}
            <div
              className="relative p-4 sm:p-5 rounded-2xl border border-slate-800/90 bg-slate-900/60 text-slate-100 font-['Playfair_Display'] text-base sm:text-lg italic leading-relaxed shadow-inner"
              style={{
                borderTopColor: universe.color.primary,
                borderTopWidth: '2px',
              }}
            >
              <span className="text-pink-400 font-bold mr-1.5 text-lg">“</span>
              {universe.shortMessage}
              <span className="text-pink-400 font-bold ml-1.5 text-lg">”</span>
            </div>

            {/* Minimalist 10-Star Progress Dots (Subtle indicator that can be swiped) */}
            <div className="flex items-center justify-center gap-1.5 pt-2">
              {Array.from({ length: 10 }).map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx + 1 === universe.id
                      ? 'w-5 bg-gradient-to-r from-pink-400 to-purple-400'
                      : 'w-1.5 bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
