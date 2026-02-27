// ──────────────────────────────────────
// Unfocus Shield Overlay
// Blurs the screen when the user switches away (tab/window loses focus).
// Stays blurred until user returns and interacts (click/tap or button).
// Uses direct DOM manipulation for instant response.
// ──────────────────────────────────────

import { useEffect, useRef } from 'react';
import { EyeOff } from 'lucide-react';
import { useSettingsStore } from '@/store/settings.store';

const UNFOCUS_SHIELD_ID = 'aits-unfocus-shield';

function activateUnfocusShield() {
  const el = document.getElementById(UNFOCUS_SHIELD_ID);
  if (!el || el.dataset.active === '1') return;
  el.dataset.active = '1';
  el.style.opacity = '1';
  el.style.visibility = 'visible';
  el.style.pointerEvents = 'auto';
}

function deactivateUnfocusShield() {
  const el = document.getElementById(UNFOCUS_SHIELD_ID);
  if (!el || el.dataset.active !== '1') return;
  el.dataset.active = '0';
  el.style.opacity = '0';
  el.style.visibility = 'hidden';
  el.style.pointerEvents = 'none';
}

export function UnfocusShield() {
  const unfocusProtection = useSettingsStore((s) => s.unfocusProtection);
  const enabledRef = useRef(unfocusProtection);
  enabledRef.current = unfocusProtection;

  useEffect(() => {
    if (!unfocusProtection) {
      // If turned off while active, dismiss immediately
      deactivateUnfocusShield();
      return;
    }

    const handleBlur = () => {
      if (enabledRef.current) {
        activateUnfocusShield();
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden' && enabledRef.current) {
        activateUnfocusShield();
      }
    };

    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [unfocusProtection]);

  return (
    <div
      id={UNFOCUS_SHIELD_ID}
      data-active="0"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999998, // just below screenshot shield
        opacity: 0,
        visibility: 'hidden',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        backdropFilter: 'blur(50px)',
        WebkitBackdropFilter: 'blur(50px)',
        backgroundColor: 'rgba(0, 0, 0, 0.88)',
        transition: 'opacity 0.05s ease-out, visibility 0s',
      }}
      // Clicking anywhere on the overlay dismisses it
      onClick={() => deactivateUnfocusShield()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="flex flex-col items-center gap-5 text-center px-6">
        <div className="h-20 w-20 rounded-full bg-blue-500/20 flex items-center justify-center">
          <EyeOff className="h-10 w-10 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-white font-poppins tracking-tight">
          Unfocus Mode Enabled
        </h2>
        <p className="text-sm text-white/60 font-lexend max-w-xs">
          Dashboard content is hidden while the window is not in focus.
          Click anywhere or press the button below to resume.
        </p>
        <button
          className="mt-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-lexend font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400/50"
          onClick={(e) => {
            e.stopPropagation();
            deactivateUnfocusShield();
          }}
        >
          I&apos;m Back
        </button>
      </div>
    </div>
  );
}
