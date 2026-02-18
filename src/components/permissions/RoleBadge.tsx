import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/Tooltip';

interface RoleBadgeProps {
  label: string;
  color: string;
  size?: 'sm' | 'md';
}

export function RoleBadge({ label, color, size = 'sm' }: RoleBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <span
            className={cn(
              'inline-flex items-center rounded-full font-medium font-lexend border max-w-full',
              size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
            )}
            style={{
              color,
              borderColor: `${color}40`,
              backgroundColor: `${color}15`,
            }}
          >
            <span
              className="mr-1.5 h-1.5 w-1.5 rounded-full shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="truncate">{label}</span>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
