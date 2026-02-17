import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import { useSidebarStore } from '@/store/sidebar.store';
import { useUIStore } from '@/store/ui.store';

/**
 * Global keyboard shortcuts handler.
 * Registers shortcuts defined in lib/keyboard.ts.
 */
export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();
  const { toggle: toggleSidebar } = useSidebarStore();
  const {
    setCommandPaletteOpen,
    setKeyboardShortcutsOpen,
    setNotificationPanelOpen,
  } = useUIStore();

  const isInputFocused = useCallback(() => {
    const el = document.activeElement;
    if (!el) return false;
    const tag = el.tagName.toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select' || (el as HTMLElement).isContentEditable;
  }, []);

  useEffect(() => {
    let gPrefix = false;
    let gTimeout: ReturnType<typeof setTimeout>;

    const handleKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;

      // Ctrl+K — command palette
      if (ctrl && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }

      // Ctrl+/ — keyboard shortcuts dialog
      if (ctrl && e.key === '/') {
        e.preventDefault();
        setKeyboardShortcutsOpen(true);
        return;
      }

      // Ctrl+D — toggle theme
      if (ctrl && e.key === 'd') {
        e.preventDefault();
        toggleTheme();
        return;
      }

      // Ctrl+B — toggle sidebar
      if (ctrl && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
        return;
      }

      // Skip other shortcuts when typing in input
      if (isInputFocused()) return;

      // N — notifications
      if (e.key === 'n' || e.key === 'N') {
        if (!ctrl) {
          e.preventDefault();
          setNotificationPanelOpen(true);
          return;
        }
      }

      // G-prefix shortcuts (G then O/T/S/A/M)
      if (e.key === 'g' || e.key === 'G') {
        if (!ctrl) {
          gPrefix = true;
          clearTimeout(gTimeout);
          gTimeout = setTimeout(() => { gPrefix = false; }, 1000);
          return;
        }
      }

      if (gPrefix) {
        gPrefix = false;
        clearTimeout(gTimeout);
        const routes: Record<string, string> = {
          o: '/dashboard/overview',
          t: '/dashboard/trolleys',
          s: '/dashboard/shops',
          a: '/dashboard/alerts',
          m: '/dashboard/map',
        };
        const route = routes[e.key.toLowerCase()];
        if (route) {
          e.preventDefault();
          navigate(route);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(gTimeout);
    };
  }, [navigate, toggleTheme, toggleSidebar, setCommandPaletteOpen, setKeyboardShortcutsOpen, setNotificationPanelOpen, isInputFocused]);
}
