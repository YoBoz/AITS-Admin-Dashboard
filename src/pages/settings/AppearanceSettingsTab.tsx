import { useEffect, useState } from 'react';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { ThemePreviewCard } from '@/components/settings/ThemePreviewCard';
import { FontSizePreview } from '@/components/settings/FontSizePreview';
import { ColorSchemeSelector } from '@/components/settings/ColorSchemeSelector';
import { useSettingsStore } from '@/store/settings.store';
import { useTheme } from '@/hooks/useTheme';

interface Props {
  onDirty: (dirty: boolean) => void;
  onSave: () => void;
}

const fontSizes = ['small', 'medium', 'large', 'xlarge'] as const;
const fontSizeLabels: Record<string, string> = {
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
  xlarge: 'Extra Large',
};

export default function AppearanceSettingsTab({ onDirty }: Props) {
  const store = useSettingsStore();
  const { setTheme } = useTheme();
  const [localState, setLocalState] = useState({
    theme: store.theme,
    fontSize: store.fontSize,
  });

  useEffect(() => {
    const isDirty =
      localState.theme !== store.theme ||
      localState.fontSize !== store.fontSize;
    onDirty(isDirty);
  }, [localState, store, onDirty]);

  const handleThemeChange = (mode: 'light' | 'dark' | 'system') => {
    setLocalState((s) => ({ ...s, theme: mode }));
    store.updateSetting('theme', mode);
    // Apply immediately via ThemeProvider
    if (mode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    } else {
      setTheme(mode);
    }
  };

  const handleFontSize = (size: typeof localState.fontSize) => {
    setLocalState((s) => ({ ...s, fontSize: size }));
    store.updateSetting('fontSize', size);
    document.documentElement.setAttribute('data-font-size', size);
  };

  return (
    <div className="space-y-6">
      {/* Theme */}
      <SettingsSection
        title="Theme"
        description="Choose between light and dark mode, or follow your system setting."
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ThemePreviewCard
            mode="light"
            label="Light Mode"
            selected={localState.theme === 'light'}
            onClick={() => handleThemeChange('light')}
          />
          <ThemePreviewCard
            mode="dark"
            label="Dark Mode"
            selected={localState.theme === 'dark'}
            onClick={() => handleThemeChange('dark')}
          />
          <ThemePreviewCard
            mode="system"
            label="System Default"
            selected={localState.theme === 'system'}
            onClick={() => handleThemeChange('system')}
          />
        </div>
      </SettingsSection>

      {/* Accent Color */}
      <SettingsSection
        title="Accent Color"
        description="The primary accent color is fixed to the Ai-TS brand color #BE052E. This cannot be changed."
      >
        <ColorSchemeSelector />
      </SettingsSection>

      {/* Font Size */}
      <SettingsSection
        title="Font Size"
        description="Adjust the base font size for comfortable reading."
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {fontSizes.map((size) => (
              <button
                key={size}
                onClick={() => handleFontSize(size)}
                className={`px-3 py-1.5 rounded-md text-xs font-lexend transition-colors ${
                  localState.fontSize === size
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {fontSizeLabels[size]}
              </button>
            ))}
          </div>
          <FontSizePreview size={localState.fontSize} />
        </div>
      </SettingsSection>

    </div>
  );
}
