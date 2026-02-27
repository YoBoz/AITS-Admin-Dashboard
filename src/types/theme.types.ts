export type Theme = 'light' | 'dark' | 'eclipse' | 'tron';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  toggleEclipse: () => void;
  toggleTron: () => void;
}
