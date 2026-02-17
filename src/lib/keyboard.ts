// ──────────────────────────────────────
// Keyboard shortcut definitions
// ──────────────────────────────────────

export interface ShortcutDef {
  keys: string;
  label: string;
  category: 'navigation' | 'ui' | 'pages';
  action: string;
  global: boolean;
}

export const shortcuts: ShortcutDef[] = [
  // UI Controls
  { keys: 'Ctrl+K', label: 'Open command palette', category: 'ui', action: 'commandPalette', global: true },
  { keys: 'Ctrl+/', label: 'Keyboard shortcuts', category: 'ui', action: 'shortcutsDialog', global: true },
  { keys: 'Ctrl+D', label: 'Toggle dark/light mode', category: 'ui', action: 'toggleTheme', global: true },
  { keys: 'Ctrl+B', label: 'Toggle sidebar', category: 'ui', action: 'toggleSidebar', global: true },
  { keys: 'Escape', label: 'Close modal/panel', category: 'ui', action: 'escape', global: true },
  { keys: 'N', label: 'Open notifications', category: 'ui', action: 'notifications', global: true },

  // Pages (G then letter)
  { keys: 'G then O', label: 'Go to Overview', category: 'pages', action: 'goto:/dashboard/overview', global: true },
  { keys: 'G then T', label: 'Go to Trolleys', category: 'pages', action: 'goto:/dashboard/trolleys', global: true },
  { keys: 'G then S', label: 'Go to Shops', category: 'pages', action: 'goto:/dashboard/shops', global: true },
  { keys: 'G then A', label: 'Go to Alerts', category: 'pages', action: 'goto:/dashboard/alerts', global: true },
  { keys: 'G then M', label: 'Go to Terminal Map', category: 'pages', action: 'goto:/dashboard/map', global: true },
];

export const categoryLabels: Record<string, string> = {
  ui: 'UI Controls',
  pages: 'Page Navigation',
  navigation: 'Navigation',
};
