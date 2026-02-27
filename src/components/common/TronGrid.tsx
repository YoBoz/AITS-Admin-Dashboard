import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GridLine {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay: number;
}

interface LightTrail {
  id: number;
  startX: number;
  startY: number;
  direction: 'horizontal' | 'vertical';
  length: number;
  delay: number;
}

interface TronGridProps {
  show: boolean;
  onComplete?: () => void;
}

const TRON_GREEN = '#00FF66';
const TRON_CYAN = '#00E5FF';

function createGridLines(): GridLine[] {
  const lines: GridLine[] = [];
  const width = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const height = typeof window !== 'undefined' ? window.innerHeight : 1080;
  const spacing = 80;
  let id = 0;

  // Horizontal lines
  for (let y = 0; y <= height; y += spacing) {
    lines.push({
      id: id++,
      x1: 0,
      y1: y,
      x2: width,
      y2: y,
      delay: Math.random() * 0.3,
    });
  }

  // Vertical lines
  for (let x = 0; x <= width; x += spacing) {
    lines.push({
      id: id++,
      x1: x,
      y1: 0,
      x2: x,
      y2: height,
      delay: Math.random() * 0.3,
    });
  }

  return lines;
}

function createLightTrails(): LightTrail[] {
  const trails: LightTrail[] = [];
  const width = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const height = typeof window !== 'undefined' ? window.innerHeight : 1080;

  // Create random light trails
  for (let i = 0; i < 12; i++) {
    const isHorizontal = Math.random() > 0.5;
    trails.push({
      id: i,
      startX: isHorizontal ? 0 : Math.random() * width,
      startY: isHorizontal ? Math.random() * height : 0,
      direction: isHorizontal ? 'horizontal' : 'vertical',
      length: isHorizontal ? width : height,
      delay: i * 0.1,
    });
  }

  return trails;
}

function GridLineElement({ line }: { line: GridLine }) {
  return (
    <motion.line
      x1={line.x1}
      y1={line.y1}
      x2={line.x2}
      y2={line.y2}
      stroke={TRON_GREEN}
      strokeWidth="1"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: [0, 0.6, 0.3] }}
      transition={{
        duration: 0.8,
        delay: line.delay,
        ease: 'easeOut',
      }}
    />
  );
}

function LightTrailElement({ trail }: { trail: LightTrail }) {
  const isHorizontal = trail.direction === 'horizontal';
  
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: trail.startX,
        top: trail.startY,
        width: isHorizontal ? 150 : 4,
        height: isHorizontal ? 4 : 150,
        background: `linear-gradient(${isHorizontal ? '90deg' : '180deg'}, transparent, ${TRON_CYAN}, ${TRON_GREEN}, transparent)`,
        boxShadow: `0 0 20px ${TRON_GREEN}, 0 0 40px ${TRON_GREEN}`,
        borderRadius: '2px',
      }}
      initial={{ 
        x: isHorizontal ? -150 : 0, 
        y: isHorizontal ? 0 : -150,
        opacity: 0 
      }}
      animate={{ 
        x: isHorizontal ? trail.length : 0, 
        y: isHorizontal ? 0 : trail.length,
        opacity: [0, 1, 1, 0] 
      }}
      transition={{
        duration: 1.2,
        delay: trail.delay,
        ease: 'easeInOut',
      }}
    />
  );
}

export function TronGrid({ show, onComplete }: TronGridProps) {
  const [gridLines, setGridLines] = useState<GridLine[]>([]);
  const [lightTrails, setLightTrails] = useState<LightTrail[]>([]);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (!show) {
      setGridLines([]);
      setLightTrails([]);
      setShowText(false);
      return;
    }

    // Create grid and trails
    setGridLines(createGridLines());
    setLightTrails(createLightTrails());
    
    // Show text after grid appears
    const textTimer = setTimeout(() => setShowText(true), 400);
    
    // Complete after animation
    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, 2500);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(completeTimer);
    };
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Dark overlay */}
          <motion.div 
            className="absolute inset-0 bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />

          {/* Grid SVG */}
          <svg 
            className="absolute inset-0 w-full h-full"
            style={{ filter: 'drop-shadow(0 0 2px #00FF66)' }}
          >
            {gridLines.map((line) => (
              <GridLineElement key={line.id} line={line} />
            ))}
          </svg>

          {/* Light trails */}
          {lightTrails.map((trail) => (
            <LightTrailElement key={trail.id} trail={trail} />
          ))}

          {/* TRON MODE Text */}
          <AnimatePresence>
            {showText && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <div className="text-center">
                  <motion.h1
                    className="text-6xl md:text-8xl font-bold font-montserrat tracking-[0.3em] uppercase"
                    style={{
                      color: TRON_GREEN,
                      textShadow: `
                        0 0 10px ${TRON_GREEN},
                        0 0 20px ${TRON_GREEN},
                        0 0 40px ${TRON_GREEN},
                        0 0 80px ${TRON_GREEN}
                      `,
                    }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                  >
                    TRON
                  </motion.h1>
                  <motion.p
                    className="text-2xl md:text-3xl font-lexend tracking-[0.5em] uppercase mt-4"
                    style={{
                      color: TRON_CYAN,
                      textShadow: `
                        0 0 10px ${TRON_CYAN},
                        0 0 20px ${TRON_CYAN}
                      `,
                    }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    MODE ACTIVATED
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Corner decorations */}
          <svg className="absolute top-4 left-4 w-24 h-24" viewBox="0 0 100 100">
            <motion.path
              d="M 0 30 L 0 0 L 30 0"
              stroke={TRON_GREEN}
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              style={{ filter: `drop-shadow(0 0 4px ${TRON_GREEN})` }}
            />
          </svg>
          <svg className="absolute top-4 right-4 w-24 h-24" viewBox="0 0 100 100">
            <motion.path
              d="M 70 0 L 100 0 L 100 30"
              stroke={TRON_GREEN}
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              style={{ filter: `drop-shadow(0 0 4px ${TRON_GREEN})` }}
            />
          </svg>
          <svg className="absolute bottom-4 left-4 w-24 h-24" viewBox="0 0 100 100">
            <motion.path
              d="M 0 70 L 0 100 L 30 100"
              stroke={TRON_GREEN}
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              style={{ filter: `drop-shadow(0 0 4px ${TRON_GREEN})` }}
            />
          </svg>
          <svg className="absolute bottom-4 right-4 w-24 h-24" viewBox="0 0 100 100">
            <motion.path
              d="M 70 100 L 100 100 L 100 70"
              stroke={TRON_GREEN}
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              style={{ filter: `drop-shadow(0 0 4px ${TRON_GREEN})` }}
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
