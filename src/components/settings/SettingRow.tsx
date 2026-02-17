import { cn } from '@/lib/utils';

interface SettingRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function SettingRow({ label, description, children, className, disabled }: SettingRowProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 py-4 border-b border-border/40 last:border-b-0',
        disabled && 'opacity-50 pointer-events-none',
        className,
      )}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium font-lexend text-foreground">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground font-lexend mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}
