import { useState } from 'react';
import { FormModal } from '@/components/common/FormModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import type { ModifierGroup, ModifierOption } from '@/types/menu.types';
import { Save, Plus, Trash2 } from 'lucide-react';

interface ModifierGroupEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: ModifierGroup | null;
  onSave: (group: ModifierGroup) => void;
}

export function ModifierGroupEditor({
  open,
  onOpenChange,
  group,
  onSave,
}: ModifierGroupEditorProps) {
  const isNew = !group;

  const [name, setName] = useState(group?.name ?? '');
  const [required, setRequired] = useState(group?.required ?? false);
  const [minSelect, setMinSelect] = useState(group?.min_select?.toString() ?? '0');
  const [maxSelect, setMaxSelect] = useState(group?.max_select?.toString() ?? '1');
  const [options, setOptions] = useState<ModifierOption[]>(
    group?.options ?? [{ id: `mo-new-1`, name: '', price: 0, is_available: true }]
  );

  const handleAddOption = () => {
    setOptions((prev) => [
      ...prev,
      { id: `mo-new-${Date.now()}`, name: '', price: 0, is_available: true },
    ]);
  };

  const handleRemoveOption = (idx: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleOptionChange = (idx: number, field: keyof ModifierOption, value: string | number | boolean) => {
    setOptions((prev) =>
      prev.map((opt, i) => (i === idx ? { ...opt, [field]: value } : opt))
    );
  };

  const handleSave = () => {
    if (!name.trim() || options.length === 0) return;
    const saved: ModifierGroup = {
      id: group?.id ?? `mg-new-${Date.now()}`,
      name: name.trim(),
      required,
      min_select: parseInt(minSelect) || 0,
      max_select: parseInt(maxSelect) || 1,
      options: options.filter((o) => o.name.trim()),
    };
    onSave(saved);
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isNew ? 'New Modifier Group' : `Edit: ${group?.name}`}
      subtitle="Define options customers can choose from"
      size="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            <Save className="h-4 w-4 mr-1" />
            {isNew ? 'Create Group' : 'Save Group'}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <Label>Group Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Milk Type, Size"
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Switch checked={required} onCheckedChange={setRequired} />
            <Label className="text-sm">Required</Label>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Min Select</Label>
            <Input
              type="number"
              min="0"
              value={minSelect}
              onChange={(e) => setMinSelect(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Max Select</Label>
            <Input
              type="number"
              min="1"
              value={maxSelect}
              onChange={(e) => setMaxSelect(e.target.value)}
            />
          </div>
        </div>

        {/* Options */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Options</Label>
            <Button variant="ghost" size="sm" onClick={handleAddOption}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Option
            </Button>
          </div>

          <div className="space-y-2">
            {options.map((opt, idx) => (
              <div key={opt.id} className="flex items-center gap-2">
                <Input
                  value={opt.name}
                  onChange={(e) => handleOptionChange(idx, 'name', e.target.value)}
                  placeholder="Option name"
                  className="flex-1"
                />
                <Input
                  type="number"
                  step="0.5"
                  value={opt.price}
                  onChange={(e) =>
                    handleOptionChange(idx, 'price', parseFloat(e.target.value) || 0)
                  }
                  placeholder="+AED"
                  className="w-20"
                />
                <label className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0">
                  <input
                    type="checkbox"
                    checked={opt.is_available}
                    onChange={(e) => handleOptionChange(idx, 'is_available', e.target.checked)}
                    className="h-3 w-3"
                  />
                  Default
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveOption(idx)}
                  className="text-destructive hover:text-destructive shrink-0"
                  disabled={options.length <= 1}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FormModal>
  );
}
