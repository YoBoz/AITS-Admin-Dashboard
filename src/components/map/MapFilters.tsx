import { Switch } from '@/components/ui/Switch';
import { useMapStore } from '@/store/map.store';
import { cn } from '@/lib/utils';
import {
  ShoppingBag,
  ShoppingCart,
  CoffeeIcon,
  Eye,
  MapPin,
  DoorOpen,
  Info,
} from 'lucide-react';

interface MapFiltersProps {
  className?: string;
}

const layers = [
  { id: 'zones', label: 'Zones', icon: MapPin },
  { id: 'trolleys', label: 'Trolleys', icon: ShoppingCart },
  { id: 'shops', label: 'Shops', icon: ShoppingBag },
  { id: 'lounges', label: 'Lounges', icon: CoffeeIcon },
  { id: 'washrooms', label: 'Washrooms', icon: Eye },
  { id: 'gates', label: 'Gates', icon: DoorOpen },
  { id: 'pois', label: 'POI', icon: Info },
];

export function MapFilters({ className }: MapFiltersProps) {
  const { activeMapLayers, toggleLayer } = useMapStore();

  return (
    <div className={cn('space-y-3', className)}>
      <p className="text-xs font-semibold font-lexend text-muted-foreground uppercase tracking-wider">
        Layer Controls
      </p>
      <div className="space-y-2">
        {layers.map(({ id, label, icon: Icon }) => (
          <div key={id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm text-foreground">{label}</span>
            </div>
            <Switch
              checked={activeMapLayers.includes(id)}
              onCheckedChange={() => toggleLayer(id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
