// ──────────────────────────────────────
// Screenshot Watermark Overlay
//
// When screenshot protection is ON, this renders a persistent
// semi-transparent watermark across the entire page with the
// current user's identity (name + email) and a timestamp.
//
// This is the MOST EFFECTIVE browser-based defense: even if
// the OS captures the screen, the watermark is baked into the
// image, making leaked screenshots traceable to the user.
// ──────────────────────────────────────

import { useEffect, useState } from 'react';
import { useSettingsStore } from '@/store/settings.store';
import { useAuth } from '@/hooks/useAuth';
import { WATERMARK_ELEMENT_ID, useScreenshotProtection } from '@/hooks/useScreenshotProtection';

export function ScreenshotWatermark() {
  const screenshotProtection = useSettingsStore((s) => s.screenshotProtection);
  const { user } = useAuth();
  const [timestamp, setTimestamp] = useState('');

  // Hook handles key blocking, toast warnings, and print blocking
  useScreenshotProtection(screenshotProtection);

  // Update timestamp every minute
  useEffect(() => {
    if (!screenshotProtection) return;
    const update = () => {
      setTimestamp(
        new Date().toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, [screenshotProtection]);

  if (!screenshotProtection) return null;

  const label = [
    user?.name || 'Unknown',
    user?.email || '',
    `ID: ${user?.id || '—'}`,
    timestamp,
  ]
    .filter(Boolean)
    .join('  •  ');

  // Generate a grid of diagonal watermark lines
  const rows = 8;
  const cols = 3;

  return (
    <div
      id={WATERMARK_ELEMENT_ID}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999990,
        pointerEvents: 'none',
        userSelect: 'none',
        overflow: 'hidden',
        // Not visible to casual eye, but captured in screenshots
        opacity: 0.04,
      }}
      aria-hidden="true"
    >
      <div
        style={{
          width: '200%',
          height: '200%',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          transform: 'rotate(-30deg)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'stretch',
        }}
      >
        {Array.from({ length: rows }).map((_, row) => (
          <div
            key={row}
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              whiteSpace: 'nowrap',
              gap: '80px',
            }}
          >
            {Array.from({ length: cols }).map((_, col) => (
              <span
                key={col}
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  fontFamily: 'monospace',
                  letterSpacing: '0.05em',
                  color: 'currentColor',
                }}
              >
                {label}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
