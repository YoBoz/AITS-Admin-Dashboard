// ──────────────────────────────────────
// Language Tab Bar — Phase 9
// ──────────────────────────────────────

import { cn } from '@/lib/utils';

interface Props {
  activeLanguage: string;
  onLanguageChange: (lang: string) => void;
  completionStats?: Record<string, number>; // percentage per language
}

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'Arabic' },
  { code: 'fr', label: 'French' },
];

export function LanguageTabBar({ activeLanguage, onLanguageChange, completionStats }: Props) {
  return (
    <div className="flex items-center gap-1 border-b border-border">
      {languages.map(({ code, label }) => {
        const active = code === activeLanguage;
        const pct = completionStats?.[code];
        return (
          <button
            key={code}
            onClick={() => onLanguageChange(code)}
            className={cn(
              'px-4 py-2 text-sm font-lexend border-b-2 transition-colors',
              active
                ? 'border-primary text-primary font-medium'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
            {pct !== undefined && (
              <span className={cn(
                'ml-2 text-[10px] font-mono',
                pct === 100 ? 'text-green-600' : pct >= 80 ? 'text-amber-600' : 'text-red-500',
              )}>
                {pct}%
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
