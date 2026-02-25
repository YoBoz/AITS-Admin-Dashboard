import { useState } from 'react';
import { motion } from 'framer-motion';
import Masonry from 'react-masonry-css';
import {
  Save, RotateCcw, Store, Globe, Bell, Clock,
  MapPin, Image, Wrench, Link2, AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { RequirePermission } from '@/components/merchant/RequirePermission';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import { Badge } from '@/components/ui/Badge';
import { useMerchantAuth } from '@/hooks/useMerchantAuth';
import { useMerchantAuditStore } from '@/store/merchant-audit.store';

// --- Types ------------------------------------------------------------------
interface ShopSettings {
  shop_name: string;
  description: string;
  contact_phone: string;
  contact_email: string;
  logo_url: string | null;
  location_terminal: string;
  location_zone: string;
  location_gate_range: string;
  closed_for_maintenance: boolean;
  default_language: 'en' | 'ar' | 'fr';
  timezone: string;
  operating_hours: { day: string; open: string; close: string; closed: boolean }[];
  notifications: {
    order_received: boolean;
    sla_at_risk: boolean;
    runner_pickup_delayed: boolean;
  };
  order_sound_enabled: boolean;
  auto_print_receipts: boolean;
  integrations: {
    pos_system: string;
    pos_connected: boolean;
    loyalty_program: string;
    loyalty_connected: boolean;
  };
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const defaultSettings: ShopSettings = {
  shop_name: 'Sky Lounge Premier',
  description: 'Premium airport dining experience',
  contact_phone: '+971-4-555-0100',
  contact_email: 'manager@demo.ai-ts',
  logo_url: null,
  location_terminal: 'Terminal 3',
  location_zone: 'Zone B - Concourse East',
  location_gate_range: 'Gates B1-B8',
  closed_for_maintenance: false,
  default_language: 'en',
  timezone: 'Asia/Dubai',
  operating_hours: DAYS.map((day) => ({
    day,
    open: '06:00',
    close: '23:00',
    closed: day === 'Friday',
  })),
  notifications: {
    order_received: true,
    sla_at_risk: true,
    runner_pickup_delayed: false,
  },
  order_sound_enabled: true,
  auto_print_receipts: false,
  integrations: {
    pos_system: 'Lightspeed POS',
    pos_connected: true,
    loyalty_program: 'Airport Miles',
    loyalty_connected: false,
  },
};

// --- Component --------------------------------------------------------------
export default function MerchantSettingsPage() {
  const { merchantRole, canDo, merchantUser } = useMerchantAuth();
  const canEdit = canDo('settings.edit');
  const addAudit = useMerchantAuditStore((s) => s.addEntry);

  if (!canDo('settings.view')) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">You do not have permission to view this page.</p>
      </div>
    );
  }

  const [draft, setDraft] = useState<ShopSettings>({ ...defaultSettings });
  const [saved, setSaved] = useState<ShopSettings>({ ...defaultSettings });

  const hasChanges = JSON.stringify(draft) !== JSON.stringify(saved);

  const handleSave = () => {
    setSaved({ ...draft });
    addAudit({
      eventType: 'merchant_settings_updated',
      actorName: merchantUser?.name ?? 'Unknown',
      actorRole: merchantRole ?? 'unknown',
      metadata: { closedForMaintenance: draft.closed_for_maintenance },
    });
    toast.success('Settings saved successfully');
  };

  const handleReset = () => {
    setDraft({ ...saved });
    toast.info('Changes discarded');
  };

  const handleLogoMock = () => {
    // Mock logo upload
    setDraft((d) => ({ ...d, logo_url: 'https://placehold.co/128x128/1e3a5f/white?text=SLP' }));
    toast.success('Logo uploaded (mock)');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-foreground">Settings</h1>
          <p className="text-xs text-muted-foreground font-lexend mt-0.5">
            General shop settings, location, notifications, and hours {'\u00B7'} Role:{' '}
            <span className="font-semibold capitalize text-foreground">{merchantRole}</span>
          </p>
        </div>
        <RequirePermission permission="settings.edit" disableInstead>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={!hasChanges} onClick={handleReset} className="gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </Button>
            <Button size="sm" disabled={!hasChanges} onClick={handleSave} className="gap-1.5">
              <Save className="h-3.5 w-3.5" /> Save Changes
            </Button>
          </div>
        </RequirePermission>
      </div>

      {/* Maintenance Banner */}
      {draft.closed_for_maintenance && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-3 flex items-center gap-2">
          <Wrench className="h-4 w-4 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-800 dark:text-amber-400 font-medium">
            Shop is currently closed for maintenance. Orders will not be accepted.
          </p>
        </div>
      )}

      <Masonry
        breakpointCols={{ default: 2, 1024: 2, 768: 1 }}
        className="masonry-grid"
        columnClassName="masonry-grid-column"
      >
        {/* Shop Profile */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5 text-brand" />
                <h3 className="text-sm font-semibold font-montserrat">Shop Profile</h3>
              </div>

              {/* Logo Upload */}
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 overflow-hidden">
                  {draft.logo_url ? (
                    <img src={draft.logo_url} alt="Logo" className="h-full w-full object-cover rounded-xl" />
                  ) : (
                    <Image className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <Button variant="outline" size="sm" onClick={handleLogoMock} disabled={!canEdit} className="gap-1">
                    <Image className="h-3 w-3" /> Upload Logo
                  </Button>
                  <p className="text-[10px] text-muted-foreground mt-1">PNG, JPG up to 2MB. 128{'\u00D7'}128 recommended.</p>
                </div>
              </div>

              {/* Shop Name - Read only */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Merchant Name (read-only)</Label>
                <div className="flex items-center gap-2">
                  <Input value={draft.shop_name} disabled className="bg-muted/50" />
                  <Badge variant="secondary" className="text-[9px] shrink-0">Admin-managed</Badge>
                </div>
                <p className="text-[10px] text-muted-foreground">Contact admin to change the merchant name</p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Description</Label>
                <textarea
                  value={draft.description}
                  onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                  disabled={!canEdit}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[60px] resize-none disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Contact Phone</Label>
                  <Input
                    value={draft.contact_phone}
                    onChange={(e) => setDraft((d) => ({ ...d, contact_phone: e.target.value }))}
                    disabled={!canEdit}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Contact Email</Label>
                  <Input
                    type="email"
                    value={draft.contact_email}
                    onChange={(e) => setDraft((d) => ({ ...d, contact_email: e.target.value }))}
                    disabled={!canEdit}
                  />
                </div>
              </div>

              {/* Closed for Maintenance */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-amber-500" />
                  <div>
                    <Label className="text-xs">Closed for Maintenance</Label>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Temporarily stop accepting all orders
                    </p>
                  </div>
                </div>
                <Switch
                  checked={draft.closed_for_maintenance}
                  onCheckedChange={(c) => setDraft((d) => ({ ...d, closed_for_maintenance: c }))}
                  disabled={!canEdit}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Location Metadata (read-only) + Localization */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-brand" />
                <h3 className="text-sm font-semibold font-montserrat">Location</h3>
                <Badge variant="secondary" className="text-[9px]">Read-only</Badge>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Terminal</Label>
                  <p className="text-sm font-medium">{draft.location_terminal}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Zone</Label>
                  <p className="text-sm font-medium">{draft.location_zone}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Gate Range</Label>
                  <p className="text-sm font-medium">{draft.location_gate_range}</p>
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-brand" />
                  <h3 className="text-sm font-semibold font-montserrat">Localization</h3>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Default Language</Label>
                  <div className="flex gap-2">
                    {([
                      { key: 'en', label: 'English' },
                      { key: 'ar', label: '\u0627\u0644\u0639\u0631\u0628\u064A\u0629' },
                      { key: 'fr', label: 'Fran\u00E7ais' },
                    ] as { key: 'en' | 'ar' | 'fr'; label: string }[]).map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => canEdit && setDraft((d) => ({ ...d, default_language: key }))}
                        disabled={!canEdit}
                        className={cn(
                          'flex-1 rounded-lg border py-2 text-xs font-medium transition-all',
                          draft.default_language === key
                            ? 'border-brand bg-brand/5 text-brand'
                            : 'border-border hover:border-foreground/20',
                          !canEdit && 'opacity-50 cursor-not-allowed',
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Timezone</Label>
                  <Input
                    value={draft.timezone}
                    onChange={(e) => setDraft((d) => ({ ...d, timezone: e.target.value }))}
                    disabled={!canEdit}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-brand" />
                <h3 className="text-sm font-semibold font-montserrat">Notifications</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs">Order Received</Label>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Notify when a new order arrives</p>
                  </div>
                  <Switch
                    checked={draft.notifications.order_received}
                    onCheckedChange={(c) => setDraft((d) => ({ ...d, notifications: { ...d.notifications, order_received: c } }))}
                    disabled={!canEdit}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs flex items-center gap-1">
                      SLA At Risk
                      <AlertCircle className="h-3 w-3 text-amber-500" />
                    </Label>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Alert when an order is approaching the SLA deadline
                    </p>
                  </div>
                  <Switch
                    checked={draft.notifications.sla_at_risk}
                    onCheckedChange={(c) => setDraft((d) => ({ ...d, notifications: { ...d.notifications, sla_at_risk: c } }))}
                    disabled={!canEdit}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs">Runner Pickup Delayed</Label>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Notify when a runner is late to pick up an order
                    </p>
                  </div>
                  <Switch
                    checked={draft.notifications.runner_pickup_delayed}
                    onCheckedChange={(c) => setDraft((d) => ({ ...d, notifications: { ...d.notifications, runner_pickup_delayed: c } }))}
                    disabled={!canEdit}
                  />
                </div>

                <div className="border-t border-border pt-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Order Sound Alerts</Label>
                    <Switch
                      checked={draft.order_sound_enabled}
                      onCheckedChange={(c) => setDraft((d) => ({ ...d, order_sound_enabled: c }))}
                      disabled={!canEdit}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Auto-Print Receipts</Label>
                    <Switch
                      checked={draft.auto_print_receipts}
                      onCheckedChange={(c) => setDraft((d) => ({ ...d, auto_print_receipts: c }))}
                      disabled={!canEdit}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Integrations */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2">
                <Link2 className="h-5 w-5 text-brand" />
                <h3 className="text-sm font-semibold font-montserrat">Integrations</h3>
              </div>

              <div className="space-y-4">
                {/* POS System */}
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                      <Store className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium">{draft.integrations.pos_system}</p>
                      <p className="text-[10px] text-muted-foreground">Point of Sale System</p>
                    </div>
                  </div>
                  <Badge variant={draft.integrations.pos_connected ? 'success' : 'secondary'} className="text-[9px]">
                    {draft.integrations.pos_connected ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>

                {/* Loyalty Program */}
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400">
                      <Link2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium">{draft.integrations.loyalty_program}</p>
                      <p className="text-[10px] text-muted-foreground">Loyalty Program</p>
                    </div>
                  </div>
                  <Badge variant={draft.integrations.loyalty_connected ? 'success' : 'secondary'} className="text-[9px]">
                    {draft.integrations.loyalty_connected ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>
              </div>

              <p className="text-[10px] text-muted-foreground">
                Integration management is handled by the platform admin. Contact support for changes.
              </p>
            </CardContent>
          </Card>
        </motion.div>

      </Masonry>

      {/* Operating Hours */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-brand" />
                <h3 className="text-sm font-semibold font-montserrat">Operating Hours</h3>
              </div>

              <div className="space-y-2">
                {draft.operating_hours.map((oh, idx) => (
                  <div key={oh.day} className="flex items-center gap-3">
                    <span className="w-24 text-xs font-medium">{oh.day}</span>
                    <Switch
                      checked={!oh.closed}
                      onCheckedChange={(open) => {
                        setDraft((d) => ({
                          ...d,
                          operating_hours: d.operating_hours.map((h, i) =>
                            i === idx ? { ...h, closed: !open } : h
                          ),
                        }));
                      }}
                      disabled={!canEdit}
                    />
                    {!oh.closed ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={oh.open}
                          onChange={(e) =>
                            setDraft((d) => ({
                              ...d,
                              operating_hours: d.operating_hours.map((h, i) =>
                                i === idx ? { ...h, open: e.target.value } : h
                              ),
                            }))
                          }
                          className="w-28"
                          disabled={!canEdit}
                        />
                        <span className="text-xs text-muted-foreground">to</span>
                        <Input
                          type="time"
                          value={oh.close}
                          onChange={(e) =>
                            setDraft((d) => ({
                              ...d,
                              operating_hours: d.operating_hours.map((h, i) =>
                                i === idx ? { ...h, close: e.target.value } : h
                              ),
                            }))
                          }
                          className="w-28"
                          disabled={!canEdit}
                        />
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">Closed</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
      </motion.div>
    </div>
  );
}
