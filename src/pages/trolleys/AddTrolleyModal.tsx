import { useState } from 'react';
import { toast } from 'sonner';
import { FormModal } from '@/components/common/FormModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useTrolleysStore } from '@/store/trolleys.store';
import { cn } from '@/lib/utils';
import type { Trolley } from '@/types/trolley.types';

interface AddTrolleyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const manufacturers = ['SmartTroll Inc.', 'AeroCart Systems', 'TrolleyTech GmbH'];
const models = ['ST-200', 'ST-300', 'AC-Pro', 'AC-Lite', 'TT-X1', 'TT-X2'];
const tabModels = ['Samsung Galaxy Tab A8', 'Lenovo Tab M10', 'Samsung Galaxy Tab S6 Lite', 'iPad 10th Gen'];
const zones = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E', 'Zone F'];
const gates = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'D1', 'D2'];

export default function AddTrolleyModal({ open, onOpenChange }: AddTrolleyModalProps) {
  const [step, setStep] = useState(1);
  const addTrolley = useTrolleysStore((s) => s.addTrolley);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    imei: '',
    serial_number: '',
    manufacturer: manufacturers[0],
    model: models[0],
    firmware_version: '3.2.1',
    tab_model: tabModels[0],
    tab_serial: '',
    zone: zones[0],
    gate: gates[0],
    notes: '',
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.imei || form.imei.length < 15) errs.imei = 'IMEI must be 15 digits';
    if (!form.serial_number) errs.serial_number = 'Serial number is required';
    if (!form.tab_serial) errs.tab_serial = 'Tab serial is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = () => {
    const trolleyCount = useTrolleysStore.getState().trolleys.length;
    const newTrolley: Trolley = {
      id: `T-${String(trolleyCount + 1).padStart(4, '0')}`,
      imei: form.imei,
      serial_number: form.serial_number,
      status: 'idle',
      battery: 100,
      health_score: 100,
      location: { x: 400, y: 300, zone: form.zone, gate: form.gate },
      last_seen: new Date().toISOString(),
      assigned_gate: form.gate,
      firmware_version: form.firmware_version,
      total_trips: 0,
      today_trips: 0,
      manufacturer: form.manufacturer,
      model: form.model,
      registered_at: new Date().toISOString(),
      last_maintenance: new Date().toISOString(),
      tab_model: form.tab_model,
      tab_serial: form.tab_serial,
      notes: form.notes,
      maintenance_history: [],
    };

    addTrolley(newTrolley);
    toast.success(`Trolley ${newTrolley.id} added successfully`);
    onOpenChange(false);
    setStep(1);
    setForm({
      imei: '',
      serial_number: '',
      manufacturer: manufacturers[0],
      model: models[0],
      firmware_version: '3.2.1',
      tab_model: tabModels[0],
      tab_serial: '',
      zone: zones[0],
      gate: gates[0],
      notes: '',
    });
  };

  return (
    <FormModal
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setStep(1);
      }}
      title="Add New Trolley"
      subtitle={`Step ${step} of 2 — ${step === 1 ? 'Device Details' : 'Assignment'}`}
      size="lg"
      footer={
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => (step === 1 ? onOpenChange(false) : setStep(1))}
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          <Button onClick={step === 1 ? handleNext : handleSubmit}>
            {step === 1 ? 'Next' : 'Create Trolley'}
          </Button>
        </div>
      }
    >
      {/* Progress */}
      <div className="flex gap-2 mb-6">
        {[1, 2].map((s) => (
          <div
            key={s}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              s <= step ? 'bg-brand' : 'bg-muted'
            )}
          />
        ))}
      </div>

      {step === 1 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>IMEI (15 digits)</Label>
              <Input
                value={form.imei}
                onChange={(e) => updateField('imei', e.target.value)}
                placeholder="350000000000000"
                maxLength={15}
              />
              {errors.imei && <p className="text-xs text-destructive mt-1">{errors.imei}</p>}
            </div>
            <div>
              <Label>Serial Number</Label>
              <Input
                value={form.serial_number}
                onChange={(e) => updateField('serial_number', e.target.value)}
                placeholder="SN-XXXXXXXX"
              />
              {errors.serial_number && <p className="text-xs text-destructive mt-1">{errors.serial_number}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Manufacturer</Label>
              <select
                value={form.manufacturer}
                onChange={(e) => updateField('manufacturer', e.target.value)}
                className="w-full h-10 rounded-md border bg-background px-3 text-sm"
              >
                {manufacturers.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Model</Label>
              <select
                value={form.model}
                onChange={(e) => updateField('model', e.target.value)}
                className="w-full h-10 rounded-md border bg-background px-3 text-sm"
              >
                {models.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <Label>Firmware Version</Label>
            <Input
              value={form.firmware_version}
              onChange={(e) => updateField('firmware_version', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tab Model</Label>
              <select
                value={form.tab_model}
                onChange={(e) => updateField('tab_model', e.target.value)}
                className="w-full h-10 rounded-md border bg-background px-3 text-sm"
              >
                {tabModels.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Tab Serial</Label>
              <Input
                value={form.tab_serial}
                onChange={(e) => updateField('tab_serial', e.target.value)}
                placeholder="R5XXXXXXXXXX"
              />
              {errors.tab_serial && <p className="text-xs text-destructive mt-1">{errors.tab_serial}</p>}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Zone</Label>
              <select
                value={form.zone}
                onChange={(e) => updateField('zone', e.target.value)}
                className="w-full h-10 rounded-md border bg-background px-3 text-sm"
              >
                {zones.map((z) => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Gate</Label>
              <select
                value={form.gate}
                onChange={(e) => updateField('gate', e.target.value)}
                className="w-full h-10 rounded-md border bg-background px-3 text-sm"
              >
                {gates.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <Label>Notes</Label>
            <textarea
              value={form.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              rows={3}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm resize-none"
              placeholder="Optional notes about this trolley..."
            />
          </div>
        </div>
      )}
    </FormModal>
  );
}
