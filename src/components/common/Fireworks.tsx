import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  angle: number;
  velocity: number;
  size: number;
}

interface Firework {
  id: number;
  x: number;
  y: number;
  particles: Particle[];
}

const COLORS = [
  '#a855f7', // purple-500
  '#8b5cf6', // violet-500
  '#7c3aed', // violet-600
  '#c084fc', // purple-400
  '#d946ef', // fuchsia-500
  '#e879f9', // fuchsia-400
  '#f0abfc', // fuchsia-300
  '#6366f1', // indigo-500
  '#818cf8', // indigo-400
  '#a78bfa', // violet-400
];

function createParticles(x: number, y: number, count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x,
    y,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    angle: (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5,
    velocity: 180 + Math.random() * 200,
    size: 5 + Math.random() * 8,
  }));
}

function ParticleElement({ particle, duration }: { particle: Particle; duration: number }) {
  const endX = particle.x + Math.cos(particle.angle) * particle.velocity;
  const endY = particle.y + Math.sin(particle.angle) * particle.velocity + 120; // gravity

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: particle.size,
        height: particle.size,
        backgroundColor: particle.color,
        boxShadow: `0 0 ${particle.size * 3}px ${particle.color}, 0 0 ${particle.size * 6}px ${particle.color}`,
        left: particle.x,
        top: particle.y,
      }}
      initial={{ scale: 1.2, opacity: 1 }}
      animate={{
        x: endX - particle.x,
        y: endY - particle.y,
        scale: 0,
        opacity: [1, 1, 0.8, 0],
      }}
      transition={{
        duration,
        ease: 'easeOut',
      }}
    />
  );
}

interface FireworksProps {
  show: boolean;
  onComplete?: () => void;
}

export function Fireworks({ show, onComplete }: FireworksProps) {
  const [fireworks, setFireworks] = useState<Firework[]>([]);

  useEffect(() => {
    if (!show) {
      setFireworks([]);
      return;
    }

    // Create many fireworks covering the whole screen with staggered timing
    const positions = [
      // Top row
      { x: window.innerWidth * 0.15, y: window.innerHeight * 0.15 },
      { x: window.innerWidth * 0.5, y: window.innerHeight * 0.1 },
      { x: window.innerWidth * 0.85, y: window.innerHeight * 0.15 },
      // Middle row
      { x: window.innerWidth * 0.1, y: window.innerHeight * 0.4 },
      { x: window.innerWidth * 0.3, y: window.innerHeight * 0.35 },
      { x: window.innerWidth * 0.7, y: window.innerHeight * 0.35 },
      { x: window.innerWidth * 0.9, y: window.innerHeight * 0.4 },
      // Bottom row
      { x: window.innerWidth * 0.2, y: window.innerHeight * 0.65 },
      { x: window.innerWidth * 0.5, y: window.innerHeight * 0.7 },
      { x: window.innerWidth * 0.8, y: window.innerHeight * 0.65 },
      // Extra bursts
      { x: window.innerWidth * 0.4, y: window.innerHeight * 0.2 },
      { x: window.innerWidth * 0.6, y: window.innerHeight * 0.2 },
      { x: window.innerWidth * 0.35, y: window.innerHeight * 0.55 },
      { x: window.innerWidth * 0.65, y: window.innerHeight * 0.55 },
    ];

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    positions.forEach((pos, index) => {
      const timeout = setTimeout(() => {
        setFireworks((prev) => [
          ...prev,
          {
            id: Date.now() + index,
            x: pos.x,
            y: pos.y,
            particles: createParticles(pos.x, pos.y, 32),
          },
        ]);
      }, index * 120);
      timeouts.push(timeout);
    });

    // Clear fireworks and call onComplete after animation
    const clearTimeout_ = setTimeout(() => {
      setFireworks([]);
      onComplete?.();
    }, 3500);
    timeouts.push(clearTimeout_);

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Dark overlay for better visibility */}
          <motion.div
            className="absolute inset-0 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Eclipse Mode Activated text */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-center">
              <motion.h1
                className="text-5xl md:text-7xl font-bold font-montserrat tracking-tight"
                style={{
                  background: 'linear-gradient(135deg, #a855f7, #d946ef, #8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 40px rgba(168, 85, 247, 0.5)',
                }}
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Eclipse Mode
              </motion.h1>
              <motion.p
                className="text-2xl md:text-3xl text-purple-300 font-lexend mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Activated
              </motion.p>
            </div>
          </motion.div>

          {/* Firework particles */}
          {fireworks.map((firework) =>
            firework.particles.map((particle) => (
              <ParticleElement
                key={`${firework.id}-${particle.id}`}
                particle={particle}
                duration={1.4}
              />
            ))
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
