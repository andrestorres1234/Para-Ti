import React, { useEffect, useRef } from 'react';
import { UniverseItem } from '../data/universes';

export type BigBangState = 'singularity' | 'igniting' | 'exploding' | 'expanded';

interface CosmicCanvasProps {
  state: BigBangState;
  universes: UniverseItem[];
  selectedUniverseId: number | null;
  onUniverseHover?: (id: number | null) => void;
  onExplosionComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  maxLife: number;
  life: number;
  sparkleSpeed?: number;
}

interface Star {
  x: number;
  y: number;
  baseSize: number;
  color: string;
  twinklePhase: number;
  twinkleSpeed: number;
  layer: number; // 1 = background, 2 = mid, 3 = foreground
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
}

export const CosmicCanvas: React.FC<CosmicCanvasProps> = ({
  state,
  universes,
  selectedUniverseId,
  onExplosionComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const explosionParticlesRef = useRef<Particle[]>([]);
  const shockwavesRef = useRef<{ radius: number; maxRadius: number; alpha: number; color: string; speed: number }[]>([]);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const singularityPhaseRef = useRef<number>(0);
  const explosionProgressRef = useRef<number>(0);

  // Initialize stars once
  useEffect(() => {
    const stars: Star[] = [];
    const starCount = 320;
    const colors = [
      '#FFFFFF',
      '#FFE4E6', // soft rose
      '#FBCFE8', // light pink
      '#E0E7FF', // soft blue
      '#FEF3C7', // soft gold
      '#DDD6FE'  // soft lavender
    ];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        baseSize: Math.random() < 0.85 ? Math.random() * 1.5 + 0.5 : Math.random() * 2.5 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.02 + Math.random() * 0.04,
        layer: Math.random() < 0.6 ? 1 : Math.random() < 0.9 ? 2 : 3,
      });
    }
    starsRef.current = stars;
  }, []);

  // Handle Big Bang trigger
  useEffect(() => {
    if (state === 'exploding' || state === 'igniting') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      // Spawn thousands of explosion particles
      const particles: Particle[] = [];
      const colors = [
        '#FF1493', '#FF69B4', '#FFB6C1', '#FF4500', '#FFA500',
        '#FFE4B5', '#8A2BE2', '#9370DB', '#00FFFF', '#FFFFFF', '#FFD700'
      ];

      const particleCount = window.innerWidth < 768 ? 450 : 800;

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.pow(Math.random(), 0.5) * (Math.min(width, height) * 0.018) + 1.5;
        const life = 140 + Math.random() * 160;

        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3.5 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: 1 / life,
          maxLife: life,
          life: life,
          sparkleSpeed: Math.random() * 0.1,
        });
      }

      explosionParticlesRef.current = particles;

      // Shockwave rings
      shockwavesRef.current = [
        { radius: 10, maxRadius: Math.max(width, height) * 0.9, alpha: 1, color: '#FF69B4', speed: 18 },
        { radius: 5, maxRadius: Math.max(width, height) * 0.8, alpha: 1, color: '#FFE4E6', speed: 14 },
        { radius: 0, maxRadius: Math.max(width, height) * 0.7, alpha: 0.9, color: '#8A2BE2', speed: 10 },
        { radius: 0, maxRadius: Math.max(width, height) * 0.6, alpha: 0.8, color: '#38BDF8', speed: 7 },
      ];

      explosionProgressRef.current = 0;
    }
  }, [state]);

  // Main canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      if (!isRunning) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      // 1. Deep Space Cosmic Background
      const bgGrad = ctx.createRadialGradient(cx, cy, 50, cx, cy, Math.max(width, height) * 0.85);
      if (state === 'singularity') {
        bgGrad.addColorStop(0, '#0a0210');
        bgGrad.addColorStop(0.5, '#05010a');
        bgGrad.addColorStop(1, '#000000');
      } else if (state === 'igniting') {
        bgGrad.addColorStop(0, '#3b0764');
        bgGrad.addColorStop(0.4, '#1e082b');
        bgGrad.addColorStop(1, '#000000');
      } else {
        // Expanded universe with cosmic nebula gradients
        bgGrad.addColorStop(0, '#130424');
        bgGrad.addColorStop(0.3, '#0c0217');
        bgGrad.addColorStop(0.7, '#070110');
        bgGrad.addColorStop(1, '#020005');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw faint colorful nebula clouds in expanded state
      if (state === 'expanded' || state === 'exploding') {
        universes.forEach((u) => {
          const ux = (u.coordinates.x / 100) * width;
          const uy = (u.coordinates.y / 100) * height;
          const isSelected = selectedUniverseId === u.id;
          const nebulaRadius = isSelected ? 220 : 130;

          const nebGrad = ctx.createRadialGradient(ux, uy, 0, ux, uy, nebulaRadius);
          nebGrad.addColorStop(0, u.color.glow);
          nebGrad.addColorStop(0.5, u.color.glow.replace(/[\d\.]+\)$/, '0.15)'));
          nebGrad.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.fillStyle = nebGrad;
          ctx.beginPath();
          ctx.arc(ux, uy, nebulaRadius, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw faint constellation lines between nearby universes
        ctx.strokeStyle = 'rgba(255, 182, 193, 0.12)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        for (let i = 0; i < universes.length; i++) {
          const u1 = universes[i];
          const x1 = (u1.coordinates.x / 100) * width;
          const y1 = (u1.coordinates.y / 100) * height;
          for (let j = i + 1; j < universes.length; j++) {
            const u2 = universes[j];
            const x2 = (u2.coordinates.x / 100) * width;
            const y2 = (u2.coordinates.y / 100) * height;
            const dist = Math.hypot(x2 - x1, y2 - y1);
            if (dist < Math.min(width, height) * 0.38) {
              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.stroke();
            }
          }
        }
        ctx.setLineDash([]);
      }

      // 2. Render Stars
      if (state === 'expanded' || state === 'exploding') {
        const stars = starsRef.current;
        for (let i = 0; i < stars.length; i++) {
          const star = stars[i];
          star.twinklePhase += star.twinkleSpeed;
          const twinkle = (Math.sin(star.twinklePhase) + 1) * 0.5;
          const sx = star.x * width;
          const sy = star.y * height;
          const currentSize = star.baseSize * (0.6 + twinkle * 0.7);
          const alpha = 0.3 + twinkle * 0.7;

          ctx.fillStyle = star.color;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(sx, sy, currentSize, 0, Math.PI * 2);
          ctx.fill();

          // Extra bright stars get a 4-point lens glow
          if (star.baseSize > 2.5 && twinkle > 0.7) {
            ctx.strokeStyle = star.color;
            ctx.lineWidth = 0.6;
            ctx.globalAlpha = alpha * 0.5;
            const flareLen = currentSize * 3;
            ctx.beginPath();
            ctx.moveTo(sx - flareLen, sy);
            ctx.lineTo(sx + flareLen, sy);
            ctx.moveTo(sx, sy - flareLen);
            ctx.lineTo(sx, sy + flareLen);
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;

        // 3. Shooting Stars (Meteors)
        if (Math.random() < 0.015 && shootingStarsRef.current.length < 3) {
          shootingStarsRef.current.push({
            x: Math.random() * width * 0.8,
            y: Math.random() * height * 0.4,
            length: 80 + Math.random() * 80,
            speed: 12 + Math.random() * 10,
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
            opacity: 1,
            active: true,
          });
        }

        for (let i = shootingStarsRef.current.length - 1; i >= 0; i--) {
          const s = shootingStarsRef.current[i];
          if (!s.active) {
            shootingStarsRef.current.splice(i, 1);
            continue;
          }

          s.x += Math.cos(s.angle) * s.speed;
          s.y += Math.sin(s.angle) * s.speed;
          s.opacity -= 0.02;

          if (s.opacity <= 0 || s.x > width || s.y > height) {
            s.active = false;
            continue;
          }

          const tailX = s.x - Math.cos(s.angle) * s.length;
          const tailY = s.y - Math.sin(s.angle) * s.length;

          const meteorGrad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
          meteorGrad.addColorStop(0, 'rgba(255, 182, 193, 0)');
          meteorGrad.addColorStop(0.7, `rgba(255, 192, 203, ${s.opacity * 0.6})`);
          meteorGrad.addColorStop(1, `rgba(255, 255, 255, ${s.opacity})`);

          ctx.strokeStyle = meteorGrad;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(s.x, s.y);
          ctx.stroke();

          // Head spark
          ctx.fillStyle = '#FFFFFF';
          ctx.globalAlpha = s.opacity;
          ctx.beginPath();
          ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      // 4. Singularity / Pre-Bang Animation
      if (state === 'singularity' || state === 'igniting') {
        singularityPhaseRef.current += state === 'igniting' ? 0.15 : 0.04;
        const phase = singularityPhaseRef.current;
        const pulse = Math.sin(phase);

        // Inflowing vortex particles (gravitational suction before big bang)
        const vortexCount = 60;
        for (let i = 0; i < vortexCount; i++) {
          const angle = (i / vortexCount) * Math.PI * 2 + phase * 0.8;
          const dist = 60 + ((i * 17 + phase * 40) % 200);
          const px = cx + Math.cos(angle) * dist;
          const py = cy + Math.sin(angle) * dist;
          const pAlpha = 1 - (dist / 260);

          ctx.fillStyle = i % 2 === 0 ? '#F43F5E' : '#A855F7';
          ctx.globalAlpha = Math.max(0, pAlpha * 0.7);
          ctx.beginPath();
          ctx.arc(px, py, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Core Singularity Glow
        const baseRadius = state === 'igniting' ? 24 + pulse * 14 : 16 + pulse * 4;
        const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, baseRadius * 3);
        coreGrad.addColorStop(0, '#FFFFFF');
        coreGrad.addColorStop(0.2, '#FB7185');
        coreGrad.addColorStop(0.5, '#A855F7');
        coreGrad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, baseRadius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Singularity dense white center
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(cx, cy, baseRadius * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Pulsating halo rings
        ctx.strokeStyle = state === 'igniting' ? '#FFE4E6' : 'rgba(251, 113, 133, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, baseRadius * 1.6, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 5. Big Bang Explosion Shockwaves & Particles
      if (state === 'exploding' || explosionParticlesRef.current.length > 0) {
        explosionProgressRef.current += 1;

        // Draw Shockwave rings
        shockwavesRef.current.forEach((sw) => {
          if (sw.radius < sw.maxRadius) {
            sw.radius += sw.speed;
            sw.alpha = Math.max(0, 1 - sw.radius / sw.maxRadius);

            ctx.strokeStyle = sw.color;
            ctx.globalAlpha = sw.alpha * 0.8;
            ctx.lineWidth = 4 * (1 - sw.radius / sw.maxRadius) + 1;
            ctx.beginPath();
            ctx.arc(cx, cy, sw.radius, 0, Math.PI * 2);
            ctx.stroke();
          }
        });
        ctx.globalAlpha = 1;

        // Draw Explosion Particles
        const particles = explosionParticlesRef.current;
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.985;
          p.vy *= 0.985;
          p.life -= 1;
          p.alpha = Math.max(0, p.life / p.maxLife);

          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Central blinding flash during first frames
        if (explosionProgressRef.current < 25) {
          const flashAlpha = (25 - explosionProgressRef.current) / 25;
          ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha * 0.9})`;
          ctx.fillRect(0, 0, width, height);
        }

        // Check if explosion is done
        if (state === 'exploding' && explosionProgressRef.current > 120) {
          if (onExplosionComplete) {
            onExplosionComplete();
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [state, universes, selectedUniverseId, onExplosionComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 block w-full h-full"
    />
  );
};
