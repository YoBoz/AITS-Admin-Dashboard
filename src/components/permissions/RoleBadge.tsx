import { cn } from '@/lib/utils';

interface RoleBadgeProps {
  label: string;
  color: string;
  size?: 'sm' | 'md';
}

export function RoleBadge({ label, color, size = 'sm' }: RoleBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium font-lexend border',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
      )}
      style={{
        color,
        borderColor: `${color}40`,
        backgroundColor: `${color}15`,
      }}
    >
      <span
        className="mr-1.5 h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}
