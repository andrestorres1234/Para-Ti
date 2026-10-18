import React, { useEffect, useRef } from 'react';

interface HeartParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
}

export const HeartParticlesFX: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const heartsRef = useRef<HeartParticle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const spawnHearts = (clientX: number, clientY: number, count = 14) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const x = clientX * dpr;
      const y = clientY * dpr;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.8 + Math.random() * 1.5;
        heartsRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: -(1.0 + Math.random() * 1.8),
          life: 1.0,
          size: (12 + Math.random() * 14) * dpr,
        });
      }
    };

    const drawHeart = (x: number, y: number, size: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      ctx.moveTo(0, -0.25 * size);
      ctx.bezierCurveTo(0.5 * size, -0.9 * size, 1.4 * size, -0.1 * size, 0, 0.9 * size);
      ctx.bezierCurveTo(-1.4 * size, -0.1 * size, -0.5 * size, -0.9 * size, 0, -0.25 * size);

      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
      grad.addColorStop(0, 'rgba(255, 180, 220, 0.95)');
      grad.addColorStop(0.5, 'rgba(244, 63, 94, 0.6)');
      grad.addColorStop(1, 'rgba(236, 72, 153, 0)');
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    };

    const handleClick = (e: MouseEvent) => {
      spawnHearts(e.clientX, e.clientY, 16);
    };

    const handleTouch = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        const t = e.touches[0];
        spawnHearts(t.clientX, t.clientY, 16);
      }
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('touchend', handleTouch);

    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const hearts = heartsRef.current;
      for (let i = hearts.length - 1; i >= 0; i--) {
        const h = hearts[i];
        h.x += h.vx;
        h.y += h.vy;
        h.vy -= 0.02; // floating upward acceleration
        h.life -= 0.016;

        if (h.life <= 0) {
          hearts.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = Math.max(0, h.life);
        drawHeart(h.x, h.y, h.size);
        ctx.globalAlpha = 1;
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchend', handleTouch);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20 block"
    />
  );
};
