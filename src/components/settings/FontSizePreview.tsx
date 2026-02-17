import { cn } from '@/lib/utils';

interface FontSizePreviewProps {
  size: 'small' | 'medium' | 'large' | 'xlarge';
}

const sizeMap = {
  small: { heading: 'text-base', body: 'text-xs', caption: 'text-[10px]', label: 'Small (14px)' },
  medium: { heading: 'text-lg', body: 'text-sm', caption: 'text-xs', label: 'Medium (16px)' },
  large: { heading: 'text-xl', body: 'text-base', caption: 'text-sm', label: 'Large (18px)' },
  xlarge: { heading: 'text-2xl', body: 'text-lg', caption: 'text-base', label: 'Extra Large (20px)' },
};

export function FontSizePreview({ size }: FontSizePreviewProps) {
  const s = sizeMap[size];

  return (
    <div className="rounded-lg border border-border/50 bg-muted/30 p-4 space-y-2">
      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">
        Preview — {s.label}
      </p>
      <p className={cn(s.heading, 'font-montserrat font-bold text-foreground')}>
        Dashboard Heading
      </p>
      <p className={cn(s.body, 'font-lexend text-foreground')}>
        Body text for cards and descriptions appears at this size.
      </p>
      <p className={cn(s.caption, 'font-lexend text-muted-foreground')}>
        Caption text • table labels • timestamps
      </p>
    </div>
  );
}
