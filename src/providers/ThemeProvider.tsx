import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react';
import type { Theme, ThemeContextType } from '@/types/theme.types';
import { STORAGE_KEYS } from '@/lib/constants';
import { SolarEclipse } from '@/components/common/SolarEclipse';
import { TronGrid } from '@/components/common/TronGrid';

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem(STORAGE_KEYS.THEME);
  if (stored === 'light' || stored === 'dark' || stored === 'eclipse' || stored === 'tron') return stored;
  return 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [showSolarEclipse, setShowSolarEclipse] = useState(false);
  const [showTronGrid, setShowTronGrid] = useState(false);

  const applyTheme = useCallback((t: Theme) => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'eclipse', 'tron');
    root.classList.add(t);
    localStorage.setItem(STORAGE_KEYS.THEME, t);
  }, []);

  const setTheme = useCallback(
    (t: Theme) => {
      setThemeState(t);
      applyTheme(t);
    },
    [applyTheme]
  );

  const toggleTheme = useCallback(() => {
    // Only toggle between light and dark (not eclipse or tron)
    if (theme === 'eclipse' || theme === 'tron') {
      setTheme('light');
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  }, [theme, setTheme]);

  const toggleEclipse = useCallback(() => {
    const newTheme = theme === 'eclipse' ? 'light' : 'eclipse';
    setTheme(newTheme);
    // Show solar eclipse animation when activating eclipse mode
    if (newTheme === 'eclipse') {
      setShowSolarEclipse(true);
    }
  }, [theme, setTheme]);

  const toggleTron = useCallback(() => {
    const newTheme = theme === 'tron' ? 'light' : 'tron';
    setTheme(newTheme);
    // Show Tron grid animation when activating tron mode
    if (newTheme === 'tron') {
      setShowTronGrid(true);
    }
  }, [theme, setTheme]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, toggleEclipse, toggleTron }}>
      {children}
      <SolarEclipse show={showSolarEclipse} onComplete={() => setShowSolarEclipse(false)} />
      <TronGrid show={showTronGrid} onComplete={() => setShowTronGrid(false)} />
    </ThemeContext.Provider>
  );
}
