import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SolarEclipseProps {
  show: boolean;
  onComplete?: () => void;
}

const SUN_COLOR = '#FDB813';
const SUN_GLOW = '#FF8C00';
const CORONA_COLOR = '#A78BFA';
const MOON_COLOR = '#1a1a2e';

export function SolarEclipse({ show, onComplete }: SolarEclipseProps) {
  const [phase, setPhase] = useState<'sun' | 'eclipse' | 'corona' | 'complete'>('sun');

  useEffect(() => {
    if (!show) {
      setPhase('sun');
      return;
    }

    // Phase 1: Sun appears
    const eclipseTimer = setTimeout(() => setPhase('eclipse'), 600);
    // Phase 2: Corona visible during full eclipse
    const coronaTimer = setTimeout(() => setPhase('corona'), 1800);
    // Phase 3: Complete
    const completeTimer = setTimeout(() => {
      setPhase('complete');
      onComplete?.();
    }, 3500);

    return () => {
      clearTimeout(eclipseTimer);
      clearTimeout(coronaTimer);
      clearTimeout(completeTimer);
    };
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background darkening - simulates shadow cast */}
          <motion.div 
            className="absolute inset-0"
            initial={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
            animate={{ 
              backgroundColor: phase === 'corona' || phase === 'complete' 
                ? 'rgba(26, 15, 46, 0.95)' 
                : phase === 'eclipse' 
                ? 'rgba(10, 5, 20, 0.7)' 
                : 'rgba(0, 0, 0, 0.3)'
            }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />

          {/* Stars appearing during eclipse */}
          {(phase === 'corona' || phase === 'complete') && (
            <div className="absolute inset-0">
              {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: Math.random() * 3 + 1,
                    height: Math.random() * 3 + 1,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: Math.random() * 0.8 + 0.2 }}
                  transition={{ duration: 0.5, delay: Math.random() * 0.5 }}
                />
              ))}
            </div>
          )}

          {/* Sun */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 200,
              height: 200,
              background: `radial-gradient(circle, ${SUN_COLOR} 0%, ${SUN_GLOW} 70%, transparent 100%)`,
              boxShadow: `
                0 0 60px ${SUN_COLOR},
                0 0 100px ${SUN_GLOW},
                0 0 140px ${SUN_COLOR}80
              `,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: phase === 'sun' ? 1 : 1.1,
              opacity: phase === 'complete' ? 0.3 : 1,
            }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />

          {/* Corona effect - visible during full eclipse */}
          <AnimatePresence>
            {(phase === 'corona' || phase === 'complete') && (
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: 280,
                  height: 280,
                  background: `radial-gradient(circle, transparent 35%, ${CORONA_COLOR}40 50%, ${CORONA_COLOR}80 60%, ${CORONA_COLOR}40 70%, transparent 85%)`,
                  boxShadow: `
                    0 0 80px ${CORONA_COLOR},
                    0 0 120px ${CORONA_COLOR}80,
                    inset 0 0 60px ${CORONA_COLOR}40
                  `,
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            )}
          </AnimatePresence>

          {/* Moon passing in front */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 190,
              height: 190,
              backgroundColor: MOON_COLOR,
              boxShadow: phase === 'corona' || phase === 'complete'
                ? `0 0 30px rgba(0, 0, 0, 0.8), inset -20px -10px 40px rgba(50, 50, 80, 0.3)`
                : `0 0 20px rgba(0, 0, 0, 0.5)`,
            }}
            initial={{ x: -400, opacity: 0 }}
            animate={{ 
              x: phase === 'complete' ? 100 : phase === 'corona' ? 0 : phase === 'eclipse' ? -20 : -300,
              opacity: phase === 'sun' ? 0 : 1,
            }}
            transition={{ 
              duration: phase === 'complete' ? 1.5 : 1.2, 
              ease: 'easeInOut' 
            }}
          />

          {/* Eclipse Mode Text */}
          <AnimatePresence>
            {(phase === 'corona' || phase === 'complete') && (
              <motion.div
                className="absolute bottom-1/4 text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <motion.h1
                  className="text-5xl md:text-7xl font-bold font-montserrat tracking-[0.2em] uppercase"
                  style={{
                    color: CORONA_COLOR,
                    textShadow: `
                      0 0 10px ${CORONA_COLOR},
                      0 0 20px ${CORONA_COLOR},
                      0 0 40px ${CORONA_COLOR}
                    `,
                  }}
                >
                  ECLIPSE
                </motion.h1>
                <motion.p
                  className="text-xl md:text-2xl font-lexend tracking-[0.4em] uppercase mt-3"
                  style={{
                    color: '#c084fc',
                    textShadow: `0 0 10px #c084fc`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  MODE ACTIVATED
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Light rays during corona phase */}
          {(phase === 'corona' || phase === 'complete') && (
            <svg 
              className="absolute w-[600px] h-[600px]" 
              viewBox="0 0 600 600"
              style={{ filter: `drop-shadow(0 0 10px ${CORONA_COLOR})` }}
            >
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const innerRadius = 145;
                const outerRadius = 250 + Math.random() * 50;
                const x1 = 300 + Math.cos(angle) * innerRadius;
                const y1 = 300 + Math.sin(angle) * innerRadius;
                const x2 = 300 + Math.cos(angle) * outerRadius;
                const y2 = 300 + Math.sin(angle) * outerRadius;
                
                return (
                  <motion.line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={CORONA_COLOR}
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                  />
                );
              })}
            </svg>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
