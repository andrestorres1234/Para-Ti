import React from 'react';
import { motion } from 'motion/react';
import { UniverseItem } from '../data/universes';
import { cosmicAudio } from '../utils/audio';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';

interface UniversesGridViewProps {
  universes: UniverseItem[];
  onSelectUniverse: (universe: UniverseItem) => void;
  partnerName: string;
}

export const UniversesGridView: React.FC<UniversesGridViewProps> = ({
  universes,
  onSelectUniverse,
  partnerName,
}) => {
  const handleCardClick = (u: UniverseItem) => {
    cosmicAudio.playUniverseChime(u.soundPitch);
    onSelectUniverse(u);
  };

  return (
    <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-8 pb-24">
      <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-950/50 border border-pink-700/40 text-[11px] font-semibold text-pink-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Guía de Universos Dedicados a {partnerName}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Outfit']">
          El Multiverso de Nuestro Amor
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 font-['Plus_Jakarta_Sans']">
          Toca cualquier universo para acercarte y leer cada carta de amor en detalle.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {universes.map((u, idx) => (
          <motion.div
            key={u.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleCardClick(u)}
            className="group relative cursor-pointer p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-pink-500/50 backdrop-blur-md shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden"
            style={{
              boxShadow: `0 4px 20px -2px rgba(0, 0, 0, 0.5)`,
            }}
          >
            {/* Background glowing gradient hover */}
            <div
              className="absolute -right-12 -top-12 w-32 h-32 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"
              style={{ backgroundColor: u.color.primary }}
            />

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border transition-transform group-hover:scale-110 duration-300"
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    borderColor: u.color.primary,
                    boxShadow: `0 0 12px ${u.color.glow}`,
                  }}
                >
                  {u.emoji}
                </div>

                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                  #{u.id}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors font-['Outfit']">
                  {u.name}
                </h3>
                <p className="text-xs text-pink-400/90 font-medium">
                  {u.subtitle}
                </p>
              </div>

              <p className="text-xs text-slate-300/90 font-['Playfair_Display'] italic line-clamp-3 leading-relaxed">
                "{u.shortMessage}"
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 relative z-10">
              <span className="text-[11px] flex items-center gap-1 text-slate-400">
                <Heart className="w-3 h-3 text-pink-500" />
                {u.stats.distance}
              </span>

              <span className="flex items-center gap-1 text-pink-300 font-semibold group-hover:translate-x-1 transition-transform">
                <span>Leer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
