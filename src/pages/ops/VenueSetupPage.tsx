// ──────────────────────────────────────
// Venue Setup Page — Phase 8
// Configure terminal structure and zones
// ──────────────────────────────────────

import { useState } from 'react';
import { useVenueStore } from '@/store/venue.store';
import { VenueFloorPlan } from '@/components/ops';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import { 
  Building2, 
  MapPin, 
  Plus,
  Edit,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { VenueZone, Gate } from '@/types/venue.types';

export default function VenueSetupPage({ embedded }: { embedded?: boolean }) {
  const { terminal, selectedNodeId, selectNode, updateZone, getAllGates, getAllZones } = useVenueStore();
  
  const [selectedFloor, setSelectedFloor] = useState<string>('all');
  const [isZoneEditorOpen, setIsZoneEditorOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<VenueZone | null>(null);

  // Get zones and gates from store
  const zones = getAllZones();
  const gates = getAllGates();

  // Filter zones by floor
  const filteredZones = selectedFloor === 'all' 
    ? zones 
    : zones.filter((z: VenueZone) => z.floorId === selectedFloor);

  // Stats
  const totalZones = zones.length;
  const restrictedZones = zones.filter((z: VenueZone) => z.isRestricted).length;
  const totalGates = gates.length;
  const activeGates = gates.filter((g: Gate) => g.status !== 'closed').length;

  const handleZoneClick = (zone: VenueZone) => {
    selectNode(zone.id, 'zone');
    setEditingZone(zone);
  };

  const handleGateClick = (gate: Gate) => {
    selectNode(gate.id, 'gate');
  };

  const handleSaveZone = () => {
    if (editingZone) {
      updateZone(editingZone.id, editingZone);
      setIsZoneEditorOpen(false);
      setEditingZone(null);
    }
  };

  const openZoneEditor = (zone: VenueZone) => {
    setEditingZone({ ...zone });
    setIsZoneEditorOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {!embedded && (
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              Venue Setup
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Configure terminal structure, zones, and gates
            </p>
          </div>
        )}
        
        <div className="flex items-center gap-2 ml-auto">
          <Select value={selectedFloor} onValueChange={setSelectedFloor}>
            <SelectTrigger className="w-40">
              <Layers className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Floor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Floors</SelectItem>
              {terminal?.floors.map((floor) => (
                <SelectItem key={floor.id} value={floor.id}>
                  {floor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            Add Zone
          </Button>
        </div>
      </div>

      {/* Terminal Info */}
      {terminal && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{terminal.name}</h2>
                <p className="text-sm text-muted-foreground">{terminal.iata_code}</p>
              </div>
              <div className="grid grid-cols-4 gap-6 text-center">
                <div>
                  <p className="text-2xl font-bold">{terminal.floors.length}</p>
                  <p className="text-xs text-muted-foreground">Floors</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalZones}</p>
                  <p className="text-xs text-muted-foreground">Zones</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalGates}</p>
                  <p className="text-xs text-muted-foreground">Gates</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{restrictedZones}</p>
                  <p className="text-xs text-muted-foreground">Restricted</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Zone List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Zones</CardTitle>
            <CardDescription>
              {filteredZones.length} zones configured
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[500px] overflow-y-auto">
            {filteredZones.map((zone: VenueZone) => (
              <div
                key={zone.id}
                className={cn(
                  'p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/50',
                  selectedNodeId === zone.id && 'ring-2 ring-primary'
                )}
                onClick={() => handleZoneClick(zone)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{zone.name}</span>
                  <div className="flex items-center gap-1">
                    {zone.isRestricted && (
                      <Badge variant="destructive" className="text-[10px]">
                        Restricted
                      </Badge>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        openZoneEditor(zone);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="capitalize">{zone.type.replace('-', ' ')}</span>
                  <span>•</span>
                  <span>{zone.trolleyCount} trolleys</span>
                </div>
              </div>
            ))}
            
            {filteredZones.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No zones on this floor</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Floor Plan */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Floor Plan</CardTitle>
            <CardDescription>
              Interactive venue layout
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VenueFloorPlan
              zones={filteredZones}
              gates={gates}
              selectedZoneId={selectedNodeId || undefined}
              onZoneClick={handleZoneClick}
              onGateClick={handleGateClick}
            />
          </CardContent>
        </Card>
      </div>

      {/* Gates Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gates Configuration</CardTitle>
          <CardDescription>
            {activeGates} of {totalGates} gates active
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-16 gap-2">
            {gates.map((gate: Gate) => (
              <div
                key={gate.id}
                className={cn(
                  'p-2 rounded border text-center cursor-pointer transition-all hover:scale-105',
                  gate.status === 'boarding' && 'bg-emerald-500/20 border-emerald-500',
                  gate.status === 'delayed' && 'bg-amber-500/20 border-amber-500',
                  gate.status === 'closed' && 'bg-gray-500/20 border-gray-500',
                  gate.status === 'open' && 'bg-blue-500/20 border-blue-500'
                )}
                onClick={() => handleGateClick(gate)}
              >
                <p className="font-bold text-sm">{gate.code}</p>
                <p className="text-[10px] capitalize text-muted-foreground">{gate.status}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Zone Editor Dialog */}
      <Dialog open={isZoneEditorOpen} onOpenChange={setIsZoneEditorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Zone</DialogTitle>
            <DialogDescription>
              Configure zone settings and restrictions
            </DialogDescription>
          </DialogHeader>
          
          {editingZone && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Zone Name</Label>
                <Input
                  value={editingZone.name}
                  onChange={(e) => setEditingZone({ ...editingZone, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Zone Type</Label>
                <Select 
                  value={editingZone.type}
                  onValueChange={(v) => setEditingZone({ ...editingZone, type: v as VenueZone['type'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="food-court">Food Court</SelectItem>
                    <SelectItem value="gate">Gate</SelectItem>
                    <SelectItem value="lounge">Lounge</SelectItem>
                    <SelectItem value="duty-free">Duty Free</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="corridor">Corridor</SelectItem>
                    <SelectItem value="restricted">Restricted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Restricted Zone</Label>
                  <p className="text-xs text-muted-foreground">
                    Trolleys cannot enter this zone
                  </p>
                </div>
                <Switch
                  checked={editingZone.isRestricted}
                  onCheckedChange={(checked) => setEditingZone({ ...editingZone, isRestricted: checked })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Max Trolleys</Label>
                  <Input
                    type="number"
                    value={editingZone.maxTrolleys || 0}
                    onChange={(e) => setEditingZone({ ...editingZone, maxTrolleys: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Current Trolleys</Label>
                  <Input
                    type="number"
                    value={editingZone.trolleyCount}
                    onChange={(e) => setEditingZone({ ...editingZone, trolleyCount: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsZoneEditorOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveZone}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
