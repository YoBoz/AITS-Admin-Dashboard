import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, SkipForward } from 'lucide-react';
import type { OnboardingStep } from '@/hooks/useOnboarding';

interface OnboardingTourProps {
  isActive: boolean;
  steps: OnboardingStep[];
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onSkip: () => void;
}

export function OnboardingTour({
  isActive,
  steps,
  currentStep,
  totalSteps,
  onNext,
  onSkip,
}: OnboardingTourProps) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const step = steps[currentStep];

  const updateRect = useCallback(() => {
    if (!step) return;
    const el = document.querySelector(step.target);
    if (el) {
      setRect(el.getBoundingClientRect());
    } else {
      setRect(null);
    }
  }, [step]);

  useEffect(() => {
    if (!isActive) return;
    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [isActive, updateRect]);

  if (!isActive || !step) return null;

  const padding = 8;
  const spotlightRect = rect
    ? {
        x: rect.x - padding,
        y: rect.y - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      }
    : null;

  // Position popover to the right or below the target
  const popoverStyle: React.CSSProperties = rect
    ? {
        position: 'fixed',
        top: rect.bottom + 12,
        left: Math.min(rect.left, window.innerWidth - 340),
        zIndex: 10002,
      }
    : {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10002,
      };

  const isLast = currentStep === totalSteps - 1;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000]" aria-modal="true" role="dialog">
        {/* SVG overlay with spotlight cut-out */}
        <svg className="fixed inset-0 w-full h-full z-[10001]" style={{ pointerEvents: 'none' }}>
          <defs>
            <mask id="onboarding-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {spotlightRect && (
                <rect
                  x={spotlightRect.x}
                  y={spotlightRect.y}
                  width={spotlightRect.width}
                  height={spotlightRect.height}
                  rx="8"
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(0,0,0,0.6)"
            mask="url(#onboarding-mask)"
            style={{ pointerEvents: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          />
        </svg>

        {/* Popover */}
        <motion.div
          ref={popoverRef}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          key={currentStep}
          style={popoverStyle}
          className="w-80 rounded-xl border bg-popover shadow-xl p-4"
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-sm">{step.title}</h3>
            <button
              onClick={onSkip}
              className="p-1 rounded hover:bg-muted transition-colors"
              aria-label="Close tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{step.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {currentStep + 1} of {totalSteps}
            </span>

            <div className="flex gap-2">
              {!isLast && (
                <button
                  onClick={onSkip}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md hover:bg-muted transition-colors"
                >
                  <SkipForward className="w-3 h-3" />
                  Skip
                </button>
              )}
              <button
                onClick={onNext}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-[#BE052E] text-white hover:bg-[#a00425] transition-colors"
              >
                {isLast ? 'Done' : 'Next'}
                {!isLast && <ChevronRight className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Step dots */}
          <div className="flex justify-center gap-1 mt-3">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === currentStep ? 'bg-[#BE052E]' : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
