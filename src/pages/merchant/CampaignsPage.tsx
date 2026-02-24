import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Megaphone, Plus, Percent, Eye, ChevronRight, ChevronLeft,
  Play, Pause, X, Trash2, BarChart3, Users, Tag, ShoppingBag, Gift, Globe, Timer,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { RequirePermission } from '@/components/merchant/RequirePermission';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Switch } from '@/components/ui/Switch';
import { useCampaignStore, type CampaignDraft } from '@/store/campaign.store';
import type { Campaign } from '@/types/coupon.types';

// ─── Constants ────────────────────────────────────────────────────────
const WIZARD_STEPS = ['Details', 'Schedule', 'Targeting', 'Languages', 'Preview'] as const;
const ZONES = ['Zone A - Departures', 'Zone B - International', 'Zone C - Arrivals', 'Zone D - VIP'];
const GATES = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'D1', 'D2'];
const DISCOUNT_TYPES = [
  { value: 'percentage' as const, label: 'Percentage Off', icon: Percent },
  { value: 'fixed' as const, label: 'Fixed Amount', icon: Tag },
  { value: 'bogo' as const, label: 'Buy One Get One', icon: ShoppingBag },
  { value: 'freebie' as const, label: 'Freebie', icon: Gift },
];

const STATUS_BADGE: Record<Campaign['status'], { variant: 'success' | 'warning' | 'info' | 'secondary' | 'destructive'; label: string }> = {
  active: { variant: 'success', label: 'Active' },
  paused: { variant: 'warning', label: 'Paused' },
  scheduled: { variant: 'info', label: 'Scheduled' },
  draft: { variant: 'secondary', label: 'Draft' },
  ended: { variant: 'destructive', label: 'Ended' },
};

// ─── Wizard Steps ─────────────────────────────────────────────────────
function StepDetails({ draft, update }: { draft: CampaignDraft; update: (u: Partial<CampaignDraft>) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs">Campaign Name</Label>
        <Input value={draft.name} onChange={(e) => update({ name: e.target.value })} placeholder="e.g. Spring Specials" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Description</Label>
        <textarea
          value={draft.description}
          onChange={(e) => update({ description: e.target.value })}
          placeholder="Brief description of the campaign"
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[80px] resize-none"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Discount Type</Label>
        <div className="grid grid-cols-2 gap-2">
          {DISCOUNT_TYPES.map((dt) => {
            const Icon = dt.icon;
            const active = draft.discount_type === dt.value;
            return (
              <button
                key={dt.value}
                onClick={() => update({ discount_type: dt.value })}
                className={cn(
                  'flex items-center gap-2 rounded-lg border p-3 text-left text-xs transition-all',
                  active ? 'border-brand bg-brand/5 text-brand' : 'border-border hover:border-foreground/20'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {dt.label}
              </button>
            );
          })}
        </div>
      </div>
      {(draft.discount_type === 'percentage' || draft.discount_type === 'fixed') && (
        <div className="space-y-1.5">
          <Label className="text-xs">Discount Value {draft.discount_type === 'percentage' ? '(%)' : '(AED)'}</Label>
          <Input
            type="number"
            min={0}
            value={draft.discount_value}
            onChange={(e) => update({ discount_value: Number(e.target.value) })}
          />
        </div>
      )}
      <div className="space-y-1.5">
        <Label className="text-xs">Budget Cap (AED, optional)</Label>
        <Input
          type="number"
          min={0}
          value={draft.budget_cap ?? ''}
          onChange={(e) => update({ budget_cap: e.target.value ? Number(e.target.value) : null })}
          placeholder="No limit"
        />
      </div>
    </div>
  );
}

function StepSchedule({ draft, update }: { draft: CampaignDraft; update: (u: Partial<CampaignDraft>) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Start Date</Label>
          <Input type="date" value={draft.start_date} onChange={(e) => update({ start_date: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">End Date</Label>
          <Input type="date" value={draft.end_date} onChange={(e) => update({ end_date: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Time Window Start</Label>
          <Input type="time" value={draft.time_window_start} onChange={(e) => update({ time_window_start: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Time Window End</Label>
          <Input type="time" value={draft.time_window_end} onChange={(e) => update({ time_window_end: e.target.value })} />
        </div>
      </div>
    </div>
  );
}

function StepTargeting({ draft, update }: { draft: CampaignDraft; update: (u: Partial<CampaignDraft>) => void }) {
  const toggleZone = (zone: string) => {
    const next = draft.target_zones.includes(zone)
      ? draft.target_zones.filter((z) => z !== zone)
      : [...draft.target_zones, zone];
    update({ target_zones: next });
  };
  const toggleGate = (gate: string) => {
    const next = draft.target_gates.includes(gate)
      ? draft.target_gates.filter((g) => g !== gate)
      : [...draft.target_gates, gate];
    update({ target_gates: next });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs">Target Zones</Label>
        <div className="flex flex-wrap gap-2">
          {ZONES.map((z) => (
            <button
              key={z}
              onClick={() => toggleZone(z)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs transition-all',
                draft.target_zones.includes(z)
                  ? 'border-brand bg-brand/10 text-brand'
                  : 'border-border hover:border-foreground/20'
              )}
            >
              {z}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Target Gates (optional)</Label>
        <div className="flex flex-wrap gap-2">
          {GATES.map((g) => (
            <button
              key={g}
              onClick={() => toggleGate(g)}
              className={cn(
                'rounded-md border w-10 h-8 text-xs transition-all',
                draft.target_gates.includes(g)
                  ? 'border-brand bg-brand/10 text-brand'
                  : 'border-border hover:border-foreground/20'
              )}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepLanguages({ draft, update }: { draft: CampaignDraft; update: (u: Partial<CampaignDraft>) => void }) {
  const LANGUAGES: { key: 'en' | 'ar' | 'fr'; label: string }[] = [
    { key: 'en', label: 'English' },
    { key: 'ar', label: 'العربية (Arabic)' },
    { key: 'fr', label: 'Français (French)' },
  ];

  const getVersion = (lang: 'en' | 'ar' | 'fr') =>
    draft.language_versions.find((v) => v.language === lang);

  const toggleLanguage = (lang: 'en' | 'ar' | 'fr') => {
    const exists = getVersion(lang);
    if (exists) {
      update({ language_versions: draft.language_versions.filter((v) => v.language !== lang) });
    } else {
      update({
        language_versions: [
          ...draft.language_versions,
          { language: lang, name: draft.name, description: draft.description },
        ],
      });
    }
  };

  const updateVersion = (lang: 'en' | 'ar' | 'fr', field: 'name' | 'description', value: string) => {
    update({
      language_versions: draft.language_versions.map((v) =>
        v.language === lang ? { ...v, [field]: value } : v
      ),
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs">Language Versions</Label>
        <p className="text-[10px] text-muted-foreground">
          Add translations for the campaign name and description. The default language uses the values from the Details step.
        </p>
      </div>

      <div className="space-y-3">
        {LANGUAGES.map(({ key, label }) => {
          const version = getVersion(key);
          const isEnabled = !!version;
          return (
            <div key={key} className="rounded-lg border border-border p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-brand" />
                  <span className="text-xs font-medium">{label}</span>
                </div>
                <Switch
                  checked={isEnabled}
                  onCheckedChange={() => toggleLanguage(key)}
                />
              </div>

              {isEnabled && (
                <div className="space-y-2 pl-5">
                  <div className="space-y-1">
                    <Label className="text-[10px]">Campaign Name ({key.toUpperCase()})</Label>
                    <Input
                      value={version!.name}
                      onChange={(e) => updateVersion(key, 'name', e.target.value)}
                      placeholder={`Campaign name in ${label}`}
                      dir={key === 'ar' ? 'rtl' : 'ltr'}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px]">Description ({key.toUpperCase()})</Label>
                    <textarea
                      value={version!.description}
                      onChange={(e) => updateVersion(key, 'description', e.target.value)}
                      placeholder={`Description in ${label}`}
                      dir={key === 'ar' ? 'rtl' : 'ltr'}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[60px] resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Auto-Execute Scheduler */}
      <div className="rounded-lg border border-border p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer className="h-3.5 w-3.5 text-brand" />
            <div>
              <span className="text-xs font-medium">Scheduler Auto-Execute</span>
              <p className="text-[10px] text-muted-foreground">
                Automatically activate this campaign on the start date
              </p>
            </div>
          </div>
          <Switch
            checked={draft.auto_execute}
            onCheckedChange={(checked) => update({ auto_execute: checked })}
          />
        </div>
      </div>
    </div>
  );
}

function StepPreview({ draft }: { draft: CampaignDraft }) {
  return (
    <div className="space-y-3 text-sm">
      <h4 className="text-xs text-muted-foreground uppercase tracking-wider">Campaign Preview</h4>
      <div className="rounded-lg border border-border divide-y divide-border">
        <Row label="Name" value={draft.name || '—'} />
        <Row label="Description" value={draft.description || '—'} />
        <Row label="Discount" value={
          draft.discount_type === 'percentage' ? `${draft.discount_value}% off` :
          draft.discount_type === 'fixed' ? `${draft.discount_value} AED off` :
          draft.discount_type === 'bogo' ? 'Buy One Get One' : 'Freebie'
        } />
        <Row label="Schedule" value={draft.start_date && draft.end_date ? `${draft.start_date} → ${draft.end_date}` : '—'} />
        <Row label="Time Window" value={`${draft.time_window_start} – ${draft.time_window_end}`} />
        <Row label="Zones" value={draft.target_zones.length ? draft.target_zones.join(', ') : 'All zones'} />
        <Row label="Gates" value={draft.target_gates.length ? draft.target_gates.join(', ') : 'All gates'} />
        <Row label="Budget" value={draft.budget_cap ? `${draft.budget_cap} AED` : 'Unlimited'} />
        <Row label="Languages" value={draft.language_versions.length > 0 ? draft.language_versions.map((lv) => lv.language.toUpperCase()).join(', ') : 'Default only'} />
        <Row label="Auto-Execute" value={draft.auto_execute ? 'Yes — scheduler will activate on start date' : 'No — manual activation required'} />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between px-3 py-2">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="text-xs font-medium text-foreground text-right max-w-[60%]">{value}</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────
export default function CampaignsPage() {
  const {
    campaigns, draft, wizardStep,
    updateDraft, resetDraft, setWizardStep,
    saveDraft, activateCampaign, pauseCampaign, endCampaign, deleteCampaign,
  } = useCampaignStore();
  const [showWizard, setShowWizard] = useState(false);

  const openWizard = () => { resetDraft(); setShowWizard(true); };
  const closeWizard = () => { resetDraft(); setShowWizard(false); };

  const canNext = (() => {
    if (wizardStep === 0) return !!draft.name.trim();
    if (wizardStep === 1) return !!draft.start_date && !!draft.end_date;
    return true;
  })();

  const handleSave = () => {
    saveDraft();
    toast.success('Campaign saved as draft');
    setShowWizard(false);
  };

  const handleActivate = (id: string) => {
    activateCampaign(id);
    toast.success('Campaign activated');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-foreground">Campaigns</h1>
          <p className="text-xs text-muted-foreground font-lexend mt-0.5">
            Create and manage promotional campaigns
          </p>
        </div>
        <RequirePermission permission="campaigns.create" disableInstead>
          <Button size="sm" onClick={openWizard} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Create Campaign
          </Button>
        </RequirePermission>
      </div>

      {/* ─── Wizard Overlay ────────────────────────────────── */}
      <AnimatePresence>
        {showWizard && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <Card>
              <CardContent className="p-5 space-y-5">
                {/* Stepper */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {WIZARD_STEPS.map((label, i) => (
                      <div key={label} className="flex items-center gap-1">
                        <button
                          onClick={() => i <= wizardStep && setWizardStep(i)}
                          className={cn(
                            'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all',
                            i === wizardStep ? 'bg-brand text-white' :
                            i < wizardStep ? 'bg-brand/10 text-brand cursor-pointer' :
                            'bg-muted text-muted-foreground'
                          )}
                        >
                          <span className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px]">{i + 1}</span>
                          <span className="hidden sm:inline">{label}</span>
                        </button>
                        {i < WIZARD_STEPS.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                      </div>
                    ))}
                  </div>
                  <button onClick={closeWizard} className="p-1 rounded-md hover:bg-muted">
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={wizardStep}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.15 }}
                  >
                    {wizardStep === 0 && <StepDetails draft={draft} update={updateDraft} />}
                    {wizardStep === 1 && <StepSchedule draft={draft} update={updateDraft} />}
                    {wizardStep === 2 && <StepTargeting draft={draft} update={updateDraft} />}
                    {wizardStep === 3 && <StepLanguages draft={draft} update={updateDraft} />}
                    {wizardStep === 4 && <StepPreview draft={draft} />}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between pt-2 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => wizardStep > 0 ? setWizardStep(wizardStep - 1) : closeWizard()}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-3 w-3" />
                    {wizardStep > 0 ? 'Back' : 'Cancel'}
                  </Button>
                  <div className="flex gap-2">
                    {wizardStep === 4 ? (
                      <Button size="sm" onClick={handleSave} className="gap-1">
                        Save as Draft
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => setWizardStep(wizardStep + 1)}
                        disabled={!canNext}
                        className="gap-1"
                      >
                        Next <ChevronRight className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Campaign List ─────────────────────────────────── */}
      <div className="space-y-3">
        {campaigns.length === 0 && (
          <Card>
            <CardContent className="p-10 text-center">
              <Megaphone className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No campaigns yet. Create one to get started.</p>
            </CardContent>
          </Card>
        )}

        {campaigns.map((camp) => {
          const sb = STATUS_BADGE[camp.status];
          const budgetPct = camp.budget_cap ? Math.round((camp.budget_spent / camp.budget_cap) * 100) : null;
          return (
            <Card key={camp.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand shrink-0">
                      <Megaphone className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold font-montserrat truncate">{camp.name}</span>
                        <Badge variant={sb.variant} className="text-[9px] px-1.5 py-0">{sb.label}</Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">{camp.description}</p>
                    </div>
                  </div>

                  {/* Analytics stub */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                    <span className="flex items-center gap-1" title="Impressions"><Eye className="h-3 w-3" />{camp.impressions}</span>
                    <span className="flex items-center gap-1" title="Redemptions"><Users className="h-3 w-3" />{camp.redemptions}</span>
                    <span className="flex items-center gap-1" title="Revenue"><BarChart3 className="h-3 w-3" />{camp.revenue_attributed} AED</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {camp.status === 'draft' && (
                      <RequirePermission permission="campaigns.create" disableInstead>
                        <Button size="sm" variant="default" onClick={() => handleActivate(camp.id)} className="gap-1 text-xs h-7">
                          <Play className="h-3 w-3" /> Activate
                        </Button>
                      </RequirePermission>
                    )}
                    {camp.status === 'active' && (
                      <Button size="sm" variant="outline" onClick={() => { pauseCampaign(camp.id); toast.info('Campaign paused'); }} className="gap-1 text-xs h-7">
                        <Pause className="h-3 w-3" /> Pause
                      </Button>
                    )}
                    {camp.status === 'paused' && (
                      <>
                        <Button size="sm" variant="default" onClick={() => handleActivate(camp.id)} className="gap-1 text-xs h-7">
                          <Play className="h-3 w-3" /> Resume
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { endCampaign(camp.id); toast.info('Campaign ended'); }} className="gap-1 text-xs h-7">
                          <X className="h-3 w-3" /> End
                        </Button>
                      </>
                    )}
                    {(camp.status === 'draft' || camp.status === 'ended') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { deleteCampaign(camp.id); toast.success('Campaign deleted'); }}
                        className="gap-1 text-xs h-7 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Budget bar */}
                {budgetPct !== null && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                      <span>Budget: {camp.budget_spent} / {camp.budget_cap} AED</span>
                      <span>{budgetPct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all', budgetPct >= 90 ? 'bg-red-500' : budgetPct >= 70 ? 'bg-amber-500' : 'bg-brand')}
                        style={{ width: `${Math.min(budgetPct, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
