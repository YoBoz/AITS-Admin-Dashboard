import { cn } from '@/lib/utils';

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function SettingsSection({ title, description, children, className }: SettingsSectionProps) {
  return (
    <div className={cn('rounded-lg border border-border/50 bg-card p-6', className)}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold font-poppins text-foreground">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground font-lexend mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}
