import { useState } from 'react';
import { FormModal } from '@/components/common/FormModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import type { Campaign } from '@/types/coupon.types';
import { Save } from 'lucide-react';

interface CampaignBuilderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: Campaign | null;
  onSave: (campaign: Campaign) => void;
}

export function CampaignBuilderModal({
  open,
  onOpenChange,
  campaign,
  onSave,
}: CampaignBuilderModalProps) {
  const isNew = !campaign;

  const [name, setName] = useState(campaign?.name ?? '');
  const [description, setDescription] = useState(campaign?.description ?? '');
  const [status, setStatus] = useState<Campaign['status']>(campaign?.status ?? 'draft');
  const [discountType, setDiscountType] = useState<Campaign['discount_type']>(
    campaign?.discount_type ?? 'percentage'
  );
  const [discountValue, setDiscountValue] = useState(campaign?.discount_value?.toString() ?? '');
  const [startDate, setStartDate] = useState(
    campaign?.start_date ? campaign.start_date.slice(0, 10) : ''
  );
  const [endDate, setEndDate] = useState(
    campaign?.end_date ? campaign.end_date.slice(0, 10) : ''
  );
  const [targetZones, setTargetZones] = useState(campaign?.target_zones?.join(', ') ?? '');
  const [targetGates, setTargetGates] = useState(campaign?.target_gates?.join(', ') ?? '');
  const [budgetCap, setBudgetCap] = useState(campaign?.budget_cap?.toString() ?? '');

  const handleSave = () => {
    if (!name.trim() || !discountValue || !startDate || !endDate) return;

    const saved: Campaign = {
      id: campaign?.id ?? `camp-new-${Date.now()}`,
      shop_id: campaign?.shop_id ?? 'sky-lounge-premier',
      name: name.trim(),
      description: description.trim(),
      status,
      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString(),
      time_window_start: campaign?.time_window_start ?? '00:00',
      time_window_end: campaign?.time_window_end ?? '23:59',
      target_zones: targetZones
        .split(',')
        .map((z) => z.trim())
        .filter(Boolean),
      target_gates: targetGates
        .split(',')
        .map((g) => g.trim())
        .filter(Boolean),
      discount_type: discountType,
      discount_value: parseFloat(discountValue),
      budget_cap: budgetCap ? parseFloat(budgetCap) : null,
      budget_spent: campaign?.budget_spent ?? 0,
      impressions: campaign?.impressions ?? 0,
      redemptions: campaign?.redemptions ?? 0,
      revenue_attributed: campaign?.revenue_attributed ?? 0,
      created_by: campaign?.created_by ?? 'merchant',
      created_at: campaign?.created_at ?? new Date().toISOString(),
    };
    onSave(saved);
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isNew ? 'New Campaign' : `Edit: ${campaign?.name}`}
      subtitle="Set up a promotional campaign for your shop"
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim() || !discountValue || !startDate || !endDate}>
            <Save className="h-4 w-4 mr-1" />
            {isNew ? 'Create Campaign' : 'Save Changes'}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Campaign Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Morning Rush" />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex items-center gap-2 h-10">
              {(['draft', 'scheduled', 'active', 'paused'] as Campaign['status'][]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`text-xs px-3 py-1.5 rounded-md border capitalize ${
                    status === s
                      ? 'border-brand bg-brand/10 text-brand font-medium'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the campaign"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>End Date</Label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Discount Type</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDiscountType('percentage')}
                className={`text-xs px-3 py-1.5 rounded-md border ${
                  discountType === 'percentage'
                    ? 'border-brand bg-brand/10 text-brand'
                    : 'border-border text-muted-foreground'
                }`}
              >
                Percentage
              </button>
              <button
                type="button"
                onClick={() => setDiscountType('fixed')}
                className={`text-xs px-3 py-1.5 rounded-md border ${
                  discountType === 'fixed'
                    ? 'border-brand bg-brand/10 text-brand'
                    : 'border-border text-muted-foreground'
                }`}
              >
                Fixed
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>{discountType === 'percentage' ? 'Discount (%)' : 'Discount (AED)'}</Label>
            <Input
              type="number"
              min="0"
              step={discountType === 'percentage' ? '1' : '0.5'}
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Budget Cap (AED)</Label>
            <Input
              type="number"
              min="0"
              value={budgetCap}
              onChange={(e) => setBudgetCap(e.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Target Zones (comma-separated)</Label>
            <Input
              value={targetZones}
              onChange={(e) => setTargetZones(e.target.value)}
              placeholder="e.g. Terminal 1, Concourse A"
            />
          </div>
          <div className="space-y-2">
            <Label>Target Gates (comma-separated)</Label>
            <Input
              value={targetGates}
              onChange={(e) => setTargetGates(e.target.value)}
              placeholder="e.g. B1, B2, B3"
            />
          </div>
        </div>

        {/* Metrics (view only for existing campaigns) */}
        {!isNew && campaign && (
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <p className="text-xs font-semibold text-foreground mb-2">Campaign Metrics</p>
            <div className="grid grid-cols-4 gap-4 text-center text-xs">
              <div>
                <p className="text-lg font-bold text-foreground">{campaign.impressions.toLocaleString()}</p>
                <p className="text-muted-foreground">Impressions</p>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{campaign.redemptions}</p>
                <p className="text-muted-foreground">Redeemed</p>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">AED {campaign.revenue_attributed.toFixed(0)}</p>
                <p className="text-muted-foreground">Revenue</p>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">AED {campaign.budget_spent.toFixed(0)}</p>
                <p className="text-muted-foreground">Spent</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </FormModal>
  );
}
