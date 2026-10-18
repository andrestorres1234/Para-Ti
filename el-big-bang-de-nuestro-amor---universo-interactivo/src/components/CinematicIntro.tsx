import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cosmicAudio } from '../utils/audio';

interface CinematicIntroProps {
  partnerName?: string;
  onComplete: () => void;
  isVisible: boolean;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({
  onComplete,
  isVisible,
}) => {
  const [stage, setStage] = useState<number>(0);
  const [isWarpActive, setIsWarpActive] = useState<boolean>(false);
  const [isBangBurst, setIsBangBurst] = useState<boolean>(false);
  const [canAdvance, setCanAdvance] = useState<boolean>(true);

  // 36 lightweight 3D warp stars (GPU friendly on mobile)
  const warpStarsRef = useRef(
    Array.from({ length: 36 }, () => ({
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      dur: `${1.4 + Math.random() * 2.2}s`,
      delay: `${-Math.random() * 3}s`,
    }))
  );

  const scenes = [
    {
      titleTop: 'Dicen que lo bueno se hace esperar…',
      titleBottom: 'y yo me lo tomé muy en serio jajaja',
    },
    {
      titleTop: 'Sé que llego un poquiiiito tarde,',
      titleBottom: 'pero es que crear universos toma tiempo',
    },
    {
      titleTop: 'No te compré flores porque se marchitan,',
      titleBottom: 'así que te programé una galaxia entera',
    },
    {
      titleTop: 'Feliz primer año, cosita :3',
      titleBottom: 'tarde pero seguro... te amo muchote!!!',
    },
  ];

  const handleNextStep = () => {
    if (!canAdvance) return;

    if (stage === 0) {
      // Step 1 -> 2: Big Bang Explosion
      cosmicAudio.startAmbient();
      cosmicAudio.playBigBang();
      setIsBangBurst(true);
      setStage(1);
      setCanAdvance(false);
      setTimeout(() => setCanAdvance(true), 650);
    } else if (stage === 1) {
      // Step 2 -> 3: Warp 3D tunnel activates
      setIsWarpActive(true);
      cosmicAudio.playCosmicSparkles();
      setStage(2);
      setCanAdvance(false);
      setTimeout(() => setCanAdvance(true), 650);
    } else if (stage === 2) {
      // Step 3 -> 4: The final message before entering the galaxy
      setStage(3);
      cosmicAudio.playCosmicSparkles();
      setCanAdvance(false);
      setTimeout(() => setCanAdvance(true), 650);
    } else if (stage === 3) {
      // Step 4 -> Enter: initiates the 3D fly-in camera zoom approach into the galaxy!
      setCanAdvance(false);
      onComplete();
    }
  };

  const currentScene = scenes[stage] || scenes[0];

  return (
    <div
      onClick={handleNextStep}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-black p-6 text-center select-none cursor-pointer transition-opacity duration-1000 ease-out ${
        isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      style={{ touchAction: 'manipulation' }}
    >
      {/* 3D Warp Space Starfield - Only runs when activated */}
      {isWarpActive && (
        <div className="warp-container absolute inset-0 pointer-events-none">
          {warpStarsRef.current.map((s, idx) => (
            <i
              key={idx}
              className="warpstar"
              style={
                {
                  '--x': s.x,
                  '--y': s.y,
                  '--dur': s.dur,
                  '--delay': s.delay,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}

      {/* Central Big Bang Core Flash */}
      {isBangBurst && (
        <div
          className="absolute w-4 h-4 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white pointer-events-none animate-bang-burst"
          style={{
            boxShadow: '0 0 20px 10px #ffffff, 0 0 60px 25px #ff82e8, 0 0 100px 40px #7c5cff',
          }}
        />
      )}

      {/* Narrative Content: Anti-flicker GPU accelerated typography */}
      <div className="relative z-10 w-full max-w-3xl px-4 flex flex-col items-center justify-center pointer-events-none intro-text-wrapper">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-3"
            style={{
              transform: 'translate3d(0, 0, 0)',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
            }}
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight font-['Outfit'] leading-snug sm:leading-tight py-2">
              <span className="block text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
                {currentScene.titleTop}
              </span>
              <span className="intro-gradient-text mt-1">
                {currentScene.titleBottom}
              </span>
            </h1>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Gentle Tap cue on screen bottom */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none text-xs sm:text-sm text-pink-200/60 tracking-wider font-light animate-pulse">
        ✦ Toca la pantalla para continuar ✦
      </div>
    </div>
  );
};
