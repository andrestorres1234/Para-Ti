import { useState, useEffect } from 'react';
import { CinematicIntro } from './components/CinematicIntro';
import { GalaxyStage3D } from './components/GalaxyStage3D';
import { UniverseModal } from './components/UniverseModal';
import { ShootingStarsEffect } from './components/ShootingStarsEffect';
import { HeartParticlesFX } from './components/HeartParticlesFX';
import {
  INITIAL_UNIVERSES,
  UniverseItem,
} from './data/universes';
import { cosmicAudio } from './utils/audio';

const STORAGE_KEY_UNIVERSES = 'cosmic_love_universes_v7';

export default function App() {
  const [universes] = useState<UniverseItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_UNIVERSES);
      return saved ? JSON.parse(saved) : INITIAL_UNIVERSES;
    } catch {
      return INITIAL_UNIVERSES;
    }
  });

  // Navigation and transition state
  const [isIntroActive, setIsIntroActive] = useState<boolean>(true);
  const [selectedUniverse, setSelectedUniverse] = useState<UniverseItem | null>(null);

  const handleIntroComplete = () => {
    // Triggers 3D camera fly-in zoom approach in GalaxyStage3D and fades intro overlay
    setIsIntroActive(false);
  };

  // Next / Prev universe navigation in zoomed modal
  const handleNextUniverse = () => {
    if (!selectedUniverse) return;
    const currentIndex = universes.findIndex((u) => u.id === selectedUniverse.id);
    const nextIndex = (currentIndex + 1) % universes.length;
    const next = universes[nextIndex];
    cosmicAudio.playUniverseChime(next.soundPitch);
    setSelectedUniverse(next);
  };

  const handlePrevUniverse = () => {
    if (!selectedUniverse) return;
    const currentIndex = universes.findIndex((u) => u.id === selectedUniverse.id);
    const prevIndex = (currentIndex - 1 + universes.length) % universes.length;
    const prev = universes[prevIndex];
    cosmicAudio.playUniverseChime(prev.soundPitch);
    setSelectedUniverse(prev);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedUniverse(null);
      } else if (e.key === 'ArrowRight' && selectedUniverse) {
        handleNextUniverse();
      } else if (e.key === 'ArrowLeft' && selectedUniverse) {
        handlePrevUniverse();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedUniverse, universes]);

  return (
    <div className="fixed inset-0 w-full h-full bg-black text-[#fff8ff] selection:bg-pink-500 selection:text-white overflow-hidden font-['Plus_Jakarta_Sans'] select-none">
      {/* 1. Full-Screen Edge-to-Edge 3D Star Galaxy (Pre-rendered, Zero-Flicker) */}
      <GalaxyStage3D
        universes={universes}
        onSelectUniverse={setSelectedUniverse}
        isIntroActive={isIntroActive}
      />

      {/* 2. Lightweight Particle FX - Only active in galaxy view */}
      {!isIntroActive && (
        <>
          <ShootingStarsEffect />
          <HeartParticlesFX />
        </>
      )}

      {/* 3. Cinematic Big Bang Intro (Smoothly Fades Out Revealing the 3D Zoom) */}
      <CinematicIntro
        onComplete={handleIntroComplete}
        isVisible={isIntroActive}
      />

      {/* 4. Zoomed-In Star Universe Love Letter Modal */}
      <UniverseModal
        universe={selectedUniverse}
        onClose={() => setSelectedUniverse(null)}
        onNext={handleNextUniverse}
        onPrev={handlePrevUniverse}
      />
    </div>
  );
}
