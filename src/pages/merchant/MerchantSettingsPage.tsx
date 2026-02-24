import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, RotateCcw, Store, Globe, Bell, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { RequirePermission } from '@/components/merchant/RequirePermission';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import { useMerchantAuth } from '@/hooks/useMerchantAuth';

// ─── Types ────────────────────────────────────────────────────────────
interface ShopSettings {
  shop_name: string;
  description: string;
  contact_phone: string;
  contact_email: string;
  default_language: 'en' | 'ar' | 'fr';
  timezone: string;
  operating_hours: { day: string; open: string; close: string; closed: boolean }[];
  notifications_enabled: boolean;
  order_sound_enabled: boolean;
  auto_print_receipts: boolean;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const defaultSettings: ShopSettings = {
  shop_name: 'Sky Lounge Premier',
  description: 'Premium airport dining experience',
  contact_phone: '+971-4-555-0100',
  contact_email: 'manager@demo.ai-ts',
  default_language: 'en',
  timezone: 'Asia/Dubai',
  operating_hours: DAYS.map((day) => ({
    day,
    open: '06:00',
    close: '23:00',
    closed: day === 'Friday',
  })),
  notifications_enabled: true,
  order_sound_enabled: true,
  auto_print_receipts: false,
};

// ─── Component ────────────────────────────────────────────────────────
export default function MerchantSettingsPage() {
  const { merchantRole, canDo } = useMerchantAuth();
  const canEdit = canDo('settings.edit');

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
    toast.success('Settings saved successfully');
  };

  const handleReset = () => {
    setDraft({ ...saved });
    toast.info('Changes discarded');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-foreground">Settings</h1>
          <p className="text-xs text-muted-foreground font-lexend mt-0.5">
            General shop settings, operating hours, and preferences · Role:{' '}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Shop Profile */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5 text-brand" />
                <h3 className="text-sm font-semibold font-montserrat">Shop Profile</h3>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Shop Name</Label>
                <Input
                  value={draft.shop_name}
                  onChange={(e) => setDraft((d) => ({ ...d, shop_name: e.target.value }))}
                  disabled={!canEdit}
                />
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
            </CardContent>
          </Card>
        </motion.div>

        {/* Localization & Preferences */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-brand" />
                <h3 className="text-sm font-semibold font-montserrat">Localization</h3>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Default Language</Label>
                <div className="flex gap-2">
                  {([
                    { key: 'en', label: 'English' },
                    { key: 'ar', label: 'العربية' },
                    { key: 'fr', label: 'Français' },
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

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-brand" />
                  <h3 className="text-sm font-semibold font-montserrat">Notifications</h3>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs">Push Notifications</Label>
                  <Switch
                    checked={draft.notifications_enabled}
                    onCheckedChange={(c) => setDraft((d) => ({ ...d, notifications_enabled: c }))}
                    disabled={!canEdit}
                  />
                </div>
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
            </CardContent>
          </Card>
        </motion.div>

        {/* Operating Hours */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
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
                      onCheckedChange={(open) =>
                        setDraft((d) => ({
                          ...d,
                          operating_hours: d.operating_hours.map((h, i) =>
                            i === idx ? { ...h, closed: !open } : h
                          ),
                        }))
                      }
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
    </div>
  );
}
