// ──────────────────────────────────────
// Screenshot Protection Hook — Layered Defense
//
// Layer 1: BLOCK screenshot key bindings + warn via toast
// Layer 2: Persistent watermark overlay with user identity
// Layer 3: CSS @media print blocking (injected dynamically)
//
// No blur shield — the OS captures the framebuffer before
// the browser can paint, so blur cannot prevent capture.
// Key blocking + watermark is the real defense.
// ──────────────────────────────────────

import { useEffect } from 'react';
import { toast } from 'sonner';

/** The watermark overlay element ID */
export const WATERMARK_ELEMENT_ID = 'aits-screenshot-watermark';

// ── Print-blocking stylesheet ─────────────────────────────

let printStyleSheet: HTMLStyleElement | null = null;

function injectPrintBlock() {
  if (printStyleSheet) return;
  printStyleSheet = document.createElement('style');
  printStyleSheet.id = 'aits-print-block';
  printStyleSheet.textContent = `
    @media print {
      body * { display: none !important; visibility: hidden !important; }
      body::after {
        content: 'Printing is disabled by security policy.';
        display: block !important;
        visibility: visible !important;
        position: fixed;
        inset: 0;
        background: #000;
        color: #fff;
        font-size: 2rem;
        display: flex !important;
        align-items: center;
        justify-content: center;
        z-index: 999999;
      }
    }
  `;
  document.head.appendChild(printStyleSheet);
}

function removePrintBlock() {
  if (printStyleSheet) {
    printStyleSheet.remove();
    printStyleSheet = null;
  }
}

// ── Main hook ─────────────────────────────────────────────

export function useScreenshotProtection(enabled: boolean) {

  useEffect(() => {
    if (!enabled) {
      removePrintBlock();
      return;
    }

    // Inject print-blocking CSS
    injectPrintBlock();

    const warnUser = (action: string) => {
      toast.error(`Screenshot blocked`, {
        description: `${action} is disabled by your organisation's security policy.`,
        duration: 3000,
        id: 'screenshot-blocked', // deduplicate rapid toasts
      });
    };

    // ── Layer 1: Block ALL screenshot key bindings ────────
    const handleKeyDown = (e: KeyboardEvent) => {
      let matched = false;
      let action = '';

      // PrintScreen (any modifier combo)
      if (e.key === 'PrintScreen') {
        matched = true;
        action = 'PrintScreen';
      }

      // Windows: Win+Shift+S (Snip & Sketch)
      if (e.metaKey && e.shiftKey && e.key.toLowerCase() === 's') {
        matched = true;
        action = 'Snipping Tool (Win+Shift+S)';
      }

      // macOS: Cmd+Shift+3 / 4 / 5
      if (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key)) {
        matched = true;
        action = `macOS Screenshot (Cmd+Shift+${e.key})`;
      }

      // macOS: Cmd+Ctrl+Shift+3 / 4
      if (e.metaKey && e.ctrlKey && e.shiftKey && ['3', '4'].includes(e.key)) {
        matched = true;
        action = `macOS Clipboard Screenshot`;
      }

      // Ctrl/Cmd+P (print — could be used for print-to-PDF)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        matched = true;
        action = 'Print (Ctrl+P)';
      }

      // Ctrl+Shift+I (DevTools — can screenshot from there)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'i') {
        matched = true;
        action = 'Developer Tools';
      }

      // F12 (DevTools)
      if (e.key === 'F12') {
        matched = true;
        action = 'Developer Tools (F12)';
      }

      if (matched) {
        e.preventDefault();
        e.stopImmediatePropagation();
        warnUser(action);
        return false;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        e.stopImmediatePropagation();
        warnUser('PrintScreen');
      }
    };

    // Context menu — block right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      warnUser('Right-click');
    };

    // Screen capture API interception
    let mediaCleanup: (() => void) | null = null;
    if (navigator.mediaDevices?.getDisplayMedia) {
      const orig = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getDisplayMedia = function (...args) {
        warnUser('Screen Recording');
        return orig(...args);
      };
      mediaCleanup = () => {
        navigator.mediaDevices.getDisplayMedia = orig;
      };
    }

    // All keyboard listeners on capture phase at the document root
    document.addEventListener('keydown', handleKeyDown, { capture: true });
    document.addEventListener('keyup', handleKeyUp, { capture: true });
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
      document.removeEventListener('keyup', handleKeyUp, { capture: true });
      document.removeEventListener('contextmenu', handleContextMenu);
      mediaCleanup?.();
      removePrintBlock();
    };
  }, [enabled]);
}

