import { Lock } from 'lucide-react';

export function ColorSchemeSelector() {
  return (
    <div className="flex items-center gap-3">
      <div
        className="relative h-10 w-10 rounded-full border-2 border-primary"
        style={{ backgroundColor: '#BE052E' }}
        title="Brand color locked"
      >
        <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-muted border border-border flex items-center justify-center">
          <Lock className="h-2.5 w-2.5 text-muted-foreground" />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium font-lexend text-foreground">#BE052E</p>
        <p className="text-xs text-muted-foreground">Brand color — locked</p>
      </div>
    </div>
  );
}
