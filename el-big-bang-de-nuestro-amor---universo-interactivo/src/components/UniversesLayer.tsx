import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UniverseItem } from '../data/universes';
import { cosmicAudio } from '../utils/audio';
import { Sparkles, Compass } from 'lucide-react';

interface UniversesLayerProps {
  universes: UniverseItem[];
  selectedUniverseId: number | null;
  onSelectUniverse: (universe: UniverseItem) => void;
  hoveredUniverseId: number | null;
  onHoverUniverse: (id: number | null) => void;
}

export const UniversesLayer: React.FC<UniversesLayerProps> = ({
  universes,
  selectedUniverseId,
  onSelectUniverse,
  hoveredUniverseId,
  onHoverUniverse,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  const handleClick = (u: UniverseItem) => {
    cosmicAudio.playUniverseChime(u.soundPitch);
    onSelectUniverse(u);
  };

  const handleMouseEnter = (u: UniverseItem) => {
    setActiveTooltip(u.id);
    onHoverUniverse(u.id);
  };

  const handleMouseLeave = () => {
    setActiveTooltip(null);
    onHoverUniverse(null);
  };

  return (
    <div className="absolute inset-0 z-10 pointer-events-auto overflow-hidden">
      {/* Floating interactive celestial bodies */}
      {universes.map((u, idx) => {
        const isHovered = hoveredUniverseId === u.id || activeTooltip === u.id;
        const isSelected = selectedUniverseId === u.id;

        // Custom slow float animation staggered per universe
        const floatDelay = idx * 0.35;

        return (
          <div
            key={u.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            style={{
              left: `${u.coordinates.x}%`,
              top: `${u.coordinates.y}%`,
            }}
            onClick={() => handleClick(u)}
            onMouseEnter={() => handleMouseEnter(u)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Outer Pulsing Aura */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.35, 0.7, 0.35],
              }}
              transition={{
                duration: 3 + (idx % 3),
                repeat: Infinity,
                delay: floatDelay,
                ease: 'easeInOut',
              }}
              className="absolute -inset-4 sm:-inset-6 rounded-full blur-xl pointer-events-none"
              style={{
                backgroundColor: u.color.primary,
              }}
            />

            {/* Orbit Ring */}
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 18 + idx * 2,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute -inset-3 sm:-inset-4 rounded-full border border-dashed pointer-events-none"
              style={{
                borderColor: `${u.color.primary}40`,
              }}
            />

            {/* Main Interactive Celestial Core */}
            <motion.div
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                y: {
                  duration: 4 + (idx % 2),
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: floatDelay,
                },
              }}
              className="relative flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-950/80 backdrop-blur-md shadow-lg border-2 transition-all duration-300"
              style={{
                borderColor: isHovered || isSelected ? '#FFFFFF' : u.color.primary,
                boxShadow: `0 0 20px ${u.color.glow}`,
              }}
            >
              {/* Spinning inner gradient disk */}
              <div
                className="absolute inset-0 rounded-full opacity-60 bg-gradient-to-tr"
                style={{
                  backgroundImage: `radial-gradient(circle at 35% 35%, ${u.color.secondary}, ${u.color.primary} 70%, transparent)`,
                }}
              />

              {/* Emoji Icon */}
              <span className="relative z-10 text-xl sm:text-2xl filter drop-shadow-md select-none transform transition-transform group-hover:scale-110">
                {u.emoji}
              </span>

              {/* Number Badge */}
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold font-mono flex items-center justify-center text-white border border-white/40 shadow-sm"
                style={{ backgroundColor: u.color.primary }}
              >
                {u.id}
              </span>
            </motion.div>

            {/* Label below node (Always legible) */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-1.5 flex flex-col items-center pointer-events-none select-none whitespace-nowrap z-20">
              <span className="px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-[11px] sm:text-xs font-medium text-slate-200 tracking-tight shadow-md backdrop-blur-sm group-hover:text-pink-300 group-hover:border-pink-500/50 transition-colors">
                {u.name}
              </span>
            </div>

            {/* Hover Tooltip / Preview Card */}
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 sm:w-64 p-3 rounded-xl bg-slate-950/95 border border-slate-700/80 shadow-2xl backdrop-blur-xl z-30 pointer-events-none"
                style={{
                  boxShadow: `0 10px 25px -5px ${u.color.glow}, 0 8px 10px -6px rgba(0, 0, 0, 0.7)`,
                }}
              >
                <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-pink-400 font-mono tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  <span>Universo #{u.id}</span>
                </div>
                <p className="mt-1 text-xs text-slate-300 font-['Playfair_Display'] italic line-clamp-2 leading-snug">
                  "{u.shortMessage}"
                </p>
                <div className="mt-2 text-[10px] text-pink-300/80 flex items-center justify-between border-t border-slate-800/80 pt-1.5">
                  <span className="flex items-center gap-1">
                    <Compass className="w-3 h-3" /> Toca para acercarte
                  </span>
                  <span className="font-mono text-slate-400">{u.stats.distance}</span>
                </div>
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
};
