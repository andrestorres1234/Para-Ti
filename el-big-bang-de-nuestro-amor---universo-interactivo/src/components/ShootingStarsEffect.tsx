import React, { useEffect, useState } from 'react';

interface Meteor {
  id: number;
  left: string;
  top: string;
}

export const ShootingStarsEffect: React.FC = () => {
  const [meteors, setMeteors] = useState<Meteor[]>([]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const spawnMeteor = () => {
      const newMeteor: Meteor = {
        id: Date.now() + Math.random(),
        left: `${20 + Math.random() * 70}vw`,
        top: `${5 + Math.random() * 45}vh`,
      };

      setMeteors((prev) => [...prev.slice(-3), newMeteor]);

      // Remove after animation finishes
      setTimeout(() => {
        setMeteors((prev) => prev.filter((m) => m.id !== newMeteor.id));
      }, 1600);

      // Schedule next meteor
      timeoutId = setTimeout(spawnMeteor, 3000 + Math.random() * 4000);
    };

    timeoutId = setTimeout(spawnMeteor, 1800);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-1 overflow-hidden">
      {meteors.map((m) => (
        <div
          key={m.id}
          className="shooting-star-elem"
          style={{ left: m.left, top: m.top }}
        />
      ))}
    </div>
  );
};
