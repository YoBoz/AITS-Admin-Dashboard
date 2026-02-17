import { useState } from 'react';
import { toast } from 'sonner';
import { FormModal } from '@/components/common/FormModal';
import { FileUpload } from '@/components/common/FileUpload';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useShopsStore } from '@/store/shops.store';
import { cn } from '@/lib/utils';
import type { Shop, ShopCategory } from '@/types/shop.types';

interface AddShopModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories: ShopCategory[] = [
  'retail', 'restaurant', 'cafe', 'lounge', 'pharmacy',
  'electronics', 'fashion', 'services', 'bank', 'other',
];
const zones = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E', 'Zone F'];

export default function AddShopModal({ open, onOpenChange }: AddShopModalProps) {
  const [step, setStep] = useState(1);
  const addShop = useShopsStore((s) => s.addShop);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    company_name: '',
    shop_name: '',
    category: 'retail' as ShopCategory,
    description: '',
    zone: zones[0],
    unit_number: '',
    floor: '1',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    start_date: '',
    end_date: '',
    monthly_fee: '',
    revenue_share: '',
    auto_renew: false,
  });

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.company_name) errs.company_name = 'Required';
    if (!form.shop_name) errs.shop_name = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.unit_number) errs.unit_number = 'Required';
    if (!form.contact_name) errs.contact_name = 'Required';
    if (!form.contact_email) errs.contact_email = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    const shopCount = useShopsStore.getState().shops.length;
    const newShop: Shop = {
      id: `SHOP-${String(shopCount + 1).padStart(3, '0')}`,
      name: form.shop_name,
      company_name: form.company_name,
      category: form.category,
      logo_url: null,
      location: {
        zone: form.zone,
        unit_number: form.unit_number,
        floor: parseInt(form.floor),
        coordinates: { x: 500, y: 300 },
      },
      contact: {
        name: form.contact_name,
        email: form.contact_email,
        phone: form.contact_phone,
      },
      contract: {
        id: `CTR-${String(shopCount + 1).padStart(4, '0')}`,
        start_date: form.start_date || new Date().toISOString(),
        end_date: form.end_date || new Date(Date.now() + 365 * 86400000).toISOString(),
        monthly_fee: parseFloat(form.monthly_fee) || 5000,
        revenue_share_percent: parseFloat(form.revenue_share) || 10,
        status: 'active',
        auto_renew: form.auto_renew,
        terms_file_url: null,
        signed_at: new Date().toISOString(),
      },
      status: 'pending',
      registered_at: new Date().toISOString(),
      offers_count: 0,
      total_visitors: 0,
      rating: 0,
      description: form.description,
    };

    addShop(newShop);
    toast.success(`${newShop.name} added successfully`);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setStep(1);
    setForm({
      company_name: '',
      shop_name: '',
      category: 'retail',
      description: '',
      zone: zones[0],
      unit_number: '',
      floor: '1',
      contact_name: '',
      contact_email: '',
      contact_phone: '',
      start_date: '',
      end_date: '',
      monthly_fee: '',
      revenue_share: '',
      auto_renew: false,
    });
    setErrors({});
  };

  const stepLabels = ['Company Info', 'Location & Contact', 'Contract'];

  return (
    <FormModal
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) resetForm();
      }}
      title="Add New Shop"
      subtitle={`Step ${step} of 3 — ${stepLabels[step - 1]}`}
      size="lg"
      footer={
        <div className="flex justify-between">
          <Button variant="outline" onClick={step === 1 ? () => onOpenChange(false) : handleBack}>
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          <Button onClick={step === 3 ? handleSubmit : handleNext}>
            {step === 3 ? 'Create Shop' : 'Next'}
          </Button>
        </div>
      }
    >
      {/* Progress */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              s <= step ? 'bg-brand' : 'bg-muted'
            )}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <Label>Company Name</Label>
            <Input value={form.company_name} onChange={(e) => updateField('company_name', e.target.value)} placeholder="Company legal name" />
            {errors.company_name && <p className="text-xs text-destructive mt-1">{errors.company_name}</p>}
          </div>
          <div>
            <Label>Shop Display Name</Label>
            <Input value={form.shop_name} onChange={(e) => updateField('shop_name', e.target.value)} placeholder="Name shown to visitors" />
            {errors.shop_name && <p className="text-xs text-destructive mt-1">{errors.shop_name}</p>}
          </div>
          <div>
            <Label>Category</Label>
            <select
              value={form.category}
              onChange={(e) => updateField('category', e.target.value)}
              className="w-full h-10 rounded-md border bg-background px-3 text-sm"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Description</Label>
            <textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={3}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm resize-none"
              placeholder="Brief description of the shop..."
            />
          </div>
          <div>
            <Label>Logo</Label>
            <FileUpload accept="image/*" label="Upload shop logo" />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Zone</Label>
              <select
                value={form.zone}
                onChange={(e) => updateField('zone', e.target.value)}
                className="w-full h-10 rounded-md border bg-background px-3 text-sm"
              >
                {zones.map((z) => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>
            <div>
              <Label>Unit Number</Label>
              <Input value={form.unit_number} onChange={(e) => updateField('unit_number', e.target.value)} placeholder="A12" />
              {errors.unit_number && <p className="text-xs text-destructive mt-1">{errors.unit_number}</p>}
            </div>
            <div>
              <Label>Floor</Label>
              <select
                value={form.floor}
                onChange={(e) => updateField('floor', e.target.value)}
                className="w-full h-10 rounded-md border bg-background px-3 text-sm"
              >
                <option value="1">Floor 1</option>
                <option value="2">Floor 2</option>
              </select>
            </div>
          </div>
          <div>
            <Label>Contact Person Name</Label>
            <Input value={form.contact_name} onChange={(e) => updateField('contact_name', e.target.value)} />
            {errors.contact_name && <p className="text-xs text-destructive mt-1">{errors.contact_name}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <Input type="email" value={form.contact_email} onChange={(e) => updateField('contact_email', e.target.value)} />
              {errors.contact_email && <p className="text-xs text-destructive mt-1">{errors.contact_email}</p>}
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.contact_phone} onChange={(e) => updateField('contact_phone', e.target.value)} placeholder="+971 5XXXXXXXX" />
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Contract Start Date</Label>
              <Input type="date" value={form.start_date} onChange={(e) => updateField('start_date', e.target.value)} />
            </div>
            <div>
              <Label>Contract End Date</Label>
              <Input type="date" value={form.end_date} onChange={(e) => updateField('end_date', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Monthly Fee ($)</Label>
              <Input type="number" value={form.monthly_fee} onChange={(e) => updateField('monthly_fee', e.target.value)} placeholder="5000" />
            </div>
            <div>
              <Label>Revenue Share (%)</Label>
              <Input type="number" value={form.revenue_share} onChange={(e) => updateField('revenue_share', e.target.value)} placeholder="10" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.auto_renew}
              onChange={(e) => updateField('auto_renew', e.target.checked)}
              className="h-4 w-4 rounded border"
              id="auto-renew"
            />
            <label htmlFor="auto-renew" className="text-sm text-foreground">Auto-renew contract</label>
          </div>
          <div>
            <Label>Contract Terms</Label>
            <FileUpload accept=".pdf,.doc,.docx" label="Upload contract document" />
          </div>

          {/* Review Summary */}
          <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-sm font-semibold text-foreground mb-2">Review Summary</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <span className="text-muted-foreground">Company:</span>
              <span className="font-medium">{form.company_name || '—'}</span>
              <span className="text-muted-foreground">Shop:</span>
              <span className="font-medium">{form.shop_name || '—'}</span>
              <span className="text-muted-foreground">Category:</span>
              <span className="font-medium">{form.category}</span>
              <span className="text-muted-foreground">Location:</span>
              <span className="font-medium">{form.zone} — {form.unit_number || '—'}</span>
              <span className="text-muted-foreground">Contact:</span>
              <span className="font-medium">{form.contact_name || '—'}</span>
              <span className="text-muted-foreground">Monthly Fee:</span>
              <span className="font-medium">${form.monthly_fee || '—'}</span>
            </div>
          </div>
        </div>
      )}
    </FormModal>
  );
}
