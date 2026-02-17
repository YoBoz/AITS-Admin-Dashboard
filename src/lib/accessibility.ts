// ──────────────────────────────────────
// Accessibility utility helpers
// ──────────────────────────────────────

/** Create a screen-reader only className string */
export const srOnly =
  'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0';

/** Returns props for an aria-live region */
export function liveRegionProps(politeness: 'polite' | 'assertive' = 'polite') {
  return {
    'aria-live': politeness,
    'aria-atomic': true,
  } as const;
}

/** Generate an id for aria-describedby pairing */
let counter = 0;
export function generateDescriptionId(prefix = 'desc') {
  return `${prefix}-${++counter}`;
}

/** Announce a message to screen readers using a live region */
export function announce(message: string, politeness: 'polite' | 'assertive' = 'polite') {
  const el = document.createElement('div');
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', politeness);
  el.setAttribute('aria-atomic', 'true');
  el.className = srOnly;
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => document.body.removeChild(el), 1000);
}
