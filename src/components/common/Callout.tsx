import { Info, AlertTriangle, CheckCircle, AlertCircle, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type CalloutVariant = 'info' | 'warning' | 'success' | 'error';

interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const variantConfig: Record<CalloutVariant, { icon: LucideIcon; bg: string; border: string; text: string }> = {
  info: {
    icon: Info,
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-700 dark:text-blue-300',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-700 dark:text-amber-300',
  },
  success: {
    icon: CheckCircle,
    bg: 'bg-green-50 dark:bg-green-950/40',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-700 dark:text-green-300',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-red-50 dark:bg-red-950/40',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-700 dark:text-red-300',
  },
};

export function Callout({ variant = 'info', title, children, className }: CalloutProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex gap-3 rounded-lg border p-4',
        config.bg,
        config.border,
        className
      )}
      role="alert"
    >
      <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', config.text)} aria-hidden="true" />
      <div className="flex-1 text-sm">
        {title && <p className={cn('font-medium mb-1', config.text)}>{title}</p>}
        <div className="text-foreground/80">{children}</div>
      </div>
    </div>
  );
}
