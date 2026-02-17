import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ThemePreviewCardProps {
  mode: 'light' | 'dark' | 'system';
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function ThemePreviewCard({ mode, label, selected, onClick }: ThemePreviewCardProps) {
  const bgColor = mode === 'dark' ? '#1a1a2e' : '#f8f9fb';
  const sidebarColor = mode === 'dark' ? '#16162a' : '#ffffff';
  const navColor = mode === 'dark' ? '#1e1e38' : '#ffffff';
  const card1 = mode === 'dark' ? '#252545' : '#ffffff';
  const card2 = mode === 'dark' ? '#252545' : '#ffffff';
  const textColor = mode === 'dark' ? '#94a3b8' : '#64748b';
  const borderColor = mode === 'dark' ? '#334155' : '#e2e8f0';

  // System = half-and-half
  const isSystem = mode === 'system';

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all',
        selected
          ? 'border-primary bg-primary/5 shadow-sm'
          : 'border-border hover:border-primary/40',
      )}
    >
      {selected && (
        <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
          <Check className="h-3 w-3 text-white" />
        </div>
      )}

      {/* SVG Preview */}
      <svg width="150" height="100" viewBox="0 0 150 100" className="rounded">
        {isSystem ? (
          <>
            <defs>
              <clipPath id="left-half">
                <rect x="0" y="0" width="75" height="100" />
              </clipPath>
              <clipPath id="right-half">
                <rect x="75" y="0" width="75" height="100" />
              </clipPath>
            </defs>
            {/* Light half */}
            <g clipPath="url(#left-half)">
              <rect width="150" height="100" fill="#f8f9fb" />
              <rect x="0" y="0" width="30" height="100" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
              <rect x="4" y="8" width="22" height="3" rx="1" fill="#BE052E" />
              <rect x="4" y="16" width="18" height="2" rx="1" fill="#e2e8f0" />
              <rect x="4" y="22" width="18" height="2" rx="1" fill="#e2e8f0" />
              <rect x="4" y="28" width="18" height="2" rx="1" fill="#e2e8f0" />
              <rect x="36" y="4" width="108" height="8" rx="2" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
              <rect x="36" y="18" width="50" height="36" rx="3" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
              <rect x="90" y="18" width="50" height="36" rx="3" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
              <rect x="36" y="60" width="104" height="32" rx="3" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
            </g>
            {/* Dark half */}
            <g clipPath="url(#right-half)">
              <rect width="150" height="100" fill="#1a1a2e" />
              <rect x="0" y="0" width="30" height="100" fill="#16162a" stroke="#334155" strokeWidth="0.5" />
              <rect x="4" y="8" width="22" height="3" rx="1" fill="#BE052E" />
              <rect x="4" y="16" width="18" height="2" rx="1" fill="#334155" />
              <rect x="4" y="22" width="18" height="2" rx="1" fill="#334155" />
              <rect x="4" y="28" width="18" height="2" rx="1" fill="#334155" />
              <rect x="36" y="4" width="108" height="8" rx="2" fill="#1e1e38" stroke="#334155" strokeWidth="0.5" />
              <rect x="36" y="18" width="50" height="36" rx="3" fill="#252545" stroke="#334155" strokeWidth="0.5" />
              <rect x="90" y="18" width="50" height="36" rx="3" fill="#252545" stroke="#334155" strokeWidth="0.5" />
              <rect x="36" y="60" width="104" height="32" rx="3" fill="#252545" stroke="#334155" strokeWidth="0.5" />
            </g>
            {/* Divider */}
            <line x1="75" y1="0" x2="75" y2="100" stroke="#BE052E" strokeWidth="1" />
          </>
        ) : (
          <>
            <rect width="150" height="100" fill={bgColor} />
            {/* Sidebar */}
            <rect x="0" y="0" width="30" height="100" fill={sidebarColor} stroke={borderColor} strokeWidth="0.5" />
            <rect x="4" y="8" width="22" height="3" rx="1" fill="#BE052E" />
            <rect x="4" y="16" width="18" height="2" rx="1" fill={borderColor} />
            <rect x="4" y="22" width="18" height="2" rx="1" fill={borderColor} />
            <rect x="4" y="28" width="18" height="2" rx="1" fill={borderColor} />
            <rect x="4" y="34" width="18" height="2" rx="1" fill={borderColor} />
            {/* Top bar */}
            <rect x="36" y="4" width="108" height="8" rx="2" fill={navColor} stroke={borderColor} strokeWidth="0.5" />
            {/* Cards */}
            <rect x="36" y="18" width="50" height="36" rx="3" fill={card1} stroke={borderColor} strokeWidth="0.5" />
            <rect x="40" y="24" width="20" height="2" rx="1" fill={textColor} />
            <rect x="40" y="30" width="30" height="6" rx="1" fill="#BE052E" opacity="0.15" />
            <rect x="90" y="18" width="50" height="36" rx="3" fill={card2} stroke={borderColor} strokeWidth="0.5" />
            <rect x="94" y="24" width="20" height="2" rx="1" fill={textColor} />
            <rect x="94" y="30" width="30" height="6" rx="1" fill="#BE052E" opacity="0.15" />
            {/* Bottom table */}
            <rect x="36" y="60" width="104" height="32" rx="3" fill={card1} stroke={borderColor} strokeWidth="0.5" />
            <rect x="40" y="66" width="96" height="2" rx="1" fill={borderColor} />
            <rect x="40" y="72" width="96" height="2" rx="1" fill={borderColor} opacity="0.5" />
            <rect x="40" y="78" width="96" height="2" rx="1" fill={borderColor} opacity="0.5" />
            <rect x="40" y="84" width="96" height="2" rx="1" fill={borderColor} opacity="0.5" />
          </>
        )}
      </svg>

      <span className="text-xs font-medium font-lexend text-foreground">{label}</span>
    </button>
  );
}
