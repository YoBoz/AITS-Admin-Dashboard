// ──────────────────────────────────────
// Copy Editor Row — Phase 9
// ──────────────────────────────────────

import { useState } from 'react';
import { Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CopyEntry } from '@/types/content.types';

interface Props {
  entry: CopyEntry;
  activeLanguage: string;
  onSave: (key: string, lang: string, value: string) => void;
}

export function CopyEditorRow({ entry, activeLanguage, onSave }: Props) {
  const currentValue = entry.translations[activeLanguage] || '';
  const [localValue, setLocalValue] = useState(currentValue);
  const isDirty = localValue !== currentValue;
  const enRef = entry.translations.en || '';

  return (
    <tr className={cn('border-b border-border/50', isDirty && 'bg-amber-500/5')}>
      <td className="px-3 py-2 align-top">
        <code className="text-[10px] font-mono text-muted-foreground break-all">{entry.key}</code>
      </td>
      <td className="px-3 py-2 align-top">
        <p className="text-xs text-foreground/70 leading-relaxed max-w-[200px]">{enRef}</p>
      </td>
      <td className="px-3 py-2 align-top">
        <textarea
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          rows={2}
          className={cn(
            'w-full px-2 py-1.5 rounded border text-xs resize-none bg-background',
            isDirty ? 'border-amber-500' : 'border-border',
          )}
          dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
        />
      </td>
      <td className="px-3 py-2 align-top">
        <span className={cn(
          'text-[9px] font-semibold px-2 py-0.5 rounded-full',
          entry.is_published
            ? 'bg-green-500/10 text-green-700 dark:text-green-400'
            : 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
        )}>
          {entry.is_published ? 'Published' : 'Draft'}
        </span>
      </td>
      <td className="px-3 py-2 align-top">
        <button
          onClick={() => {
            onSave(entry.key, activeLanguage, localValue);
          }}
          disabled={!isDirty}
          className={cn(
            'p-1.5 rounded transition-colors',
            isDirty ? 'text-primary hover:bg-primary/10' : 'text-muted-foreground/30 cursor-not-allowed',
          )}
        >
          <Save className="h-3.5 w-3.5" />
        </button>
      </td>
    </tr>
  );
}
