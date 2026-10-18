import React from 'react';
import { UniverseItem } from '../data/universes';
import { cosmicAudio } from '../utils/audio';

interface GalaxyStageProps {
  universes: UniverseItem[];
  onSelectUniverse: (universe: UniverseItem) => void;
  onCoreClick: () => void;
}

export const GalaxyStage: React.FC<GalaxyStageProps> = ({
  universes,
  onSelectUniverse,
  onCoreClick,
}) => {
  // 10 planetary coordinates from user's template
  const orbitPositions = [
    [50, 13],
    [72, 23],
    [84, 43],
    [77, 69],
    [60, 84],
    [36, 84],
    [19, 68],
    [15, 43],
    [28, 23],
    [50, 50],
  ];

  const handlePlanetClick = (universe: UniverseItem) => {
    cosmicAudio.playUniverseChime(universe.soundPitch);
    onSelectUniverse(universe);
  };

  const handleCoreClick = () => {
    cosmicAudio.playCosmicSparkles();
    onCoreClick();
  };

  return (
    <div
      className="galaxy-stage w-full max-w-[850px] mx-auto relative my-6"
      style={{
        height: 'min(76vw, 680px)',
        minHeight: '480px',
        maxHeight: '680px',
      }}
      aria-label="Diez mundos planetarios con mensajes de amor"
    >
      {/* Central Pulsating Core Heart */}
      <button
        onClick={handleCoreClick}
        className="core-heart select-none"
        title="El centro de mi universo (Toca para ver el Certificado)"
        aria-label="El centro de mi universo"
      >
        <span className="transform transition-transform hover:scale-125 duration-300">
          💞
        </span>
      </button>

      {/* Orbit Planets */}
      {universes.slice(0, 10).map((u, i) => {
        const coords = orbitPositions[i] || [50, 50];
        const isSpecialCenter = i === 9; // 10th planet at center orbit

        return (
          <button
            key={u.id}
            onClick={() => handlePlanetClick(u)}
            className="planet-sphere"
            style={
              {
                '--x': `${coords[0]}%`,
                '--y': `${coords[1]}%`,
                '--c': u.color.primary,
                '--delay': `${-i * 0.4}s`,
                width: isSpecialCenter ? 'clamp(68px, 12vw, 105px)' : 'clamp(62px, 10vw, 96px)',
                aspectRatio: '1',
              } as React.CSSProperties
            }
            aria-label={`Leer ${u.name}`}
            title={`Mundo ${String(u.id).padStart(2, '0')}: ${u.name}`}
          >
            <span className="text-xl sm:text-2xl leading-none select-none filter drop-shadow">
              {u.emoji}
            </span>
            <small className="text-[8px] sm:text-[9.5px] font-extrabold tracking-wider uppercase text-white/95 select-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              {isSpecialCenter ? 'CARTA 10' : `MUNDO ${String(u.id).padStart(2, '0')}`}
            </small>
          </button>
        );
      })}

      {/* Caption at bottom of orbit */}
      <div className="absolute bottom-4 left-4 right-4 text-center text-[#bcb0d6] text-xs sm:text-sm pointer-events-none select-none font-medium tracking-wide">
        ✦ Explora a tu ritmo · Cada planeta guarda una parte de mi corazón ✦
      </div>
    </div>
  );
};
