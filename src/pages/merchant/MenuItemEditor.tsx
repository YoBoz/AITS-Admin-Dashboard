import { useState } from 'react';
import { FormModal } from '@/components/common/FormModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import { ModifierGroupEditor } from './ModifierGroupEditor';
import type { MenuItem, ModifierGroup } from '@/types/menu.types';
import { Save, Plus, Trash2 } from 'lucide-react';

interface MenuItemEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MenuItem | null;
  categoryId: string;
  onSave: (item: MenuItem) => void;
}

export function MenuItemEditor({
  open,
  onOpenChange,
  item,
  categoryId,
  onSave,
}: MenuItemEditorProps) {
  const isNew = !item;

  const [name, setName] = useState(item?.name ?? '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [price, setPrice] = useState(item?.price?.toString() ?? '');
  const [imageUrl, setImageUrl] = useState(item?.image_url ?? '');
  const [isAvailable, setIsAvailable] = useState(item?.is_available ?? true);
  const [status, setStatus] = useState<'draft' | 'published'>(item?.status ?? 'draft');
  const [prepTime, setPrepTime] = useState(item?.prep_time_minutes?.toString() ?? '8');
  const [allergens, setAllergens] = useState(item?.allergens?.join(', ') ?? '');
  const [tags, setTags] = useState(item?.tags?.join(', ') ?? '');
  const [modifierGroups, setModifierGroups] = useState<ModifierGroup[]>(item?.modifier_groups ?? []);
  const [editingModifier, setEditingModifier] = useState<ModifierGroup | null>(null);
  const [showNewModifier, setShowNewModifier] = useState(false);

  const handleSave = () => {
    if (!name.trim() || !price) return;
    const saved: MenuItem = {
      id: item?.id ?? `mi-new-${Date.now()}`,
      category_id: categoryId,
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      currency: item?.currency ?? 'AED',
      image_url: imageUrl || null,
      is_available: isAvailable,
      is_out_of_stock: item?.is_out_of_stock ?? false,
      status,
      sort_order: item?.sort_order ?? 99,
      prep_time_minutes: parseInt(prepTime) || 8,
      allergens: allergens
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean),
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      modifier_groups: modifierGroups,
    };
    onSave(saved);
  };

  const handleSaveModifier = (group: ModifierGroup) => {
    setModifierGroups((prev) => {
      const idx = prev.findIndex((g) => g.id === group.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = group;
        return updated;
      }
      return [...prev, group];
    });
    setEditingModifier(null);
    setShowNewModifier(false);
  };

  const handleRemoveModifier = (id: string) => {
    setModifierGroups((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <>
      <FormModal
        open={open}
        onOpenChange={onOpenChange}
        title={isNew ? 'New Menu Item' : `Edit: ${item?.name}`}
        subtitle="Configure item details, pricing, and modifiers"
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!name.trim() || !price}>
              <Save className="h-4 w-4 mr-1" />
              {isNew ? 'Create Item' : 'Save Changes'}
            </Button>
          </div>
        }
      >
        <div className="space-y-5">
          {/* Basic Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Item Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Americano" />
            </div>
            <div className="space-y-2">
              <Label>Price (AED)</Label>
              <Input
                type="number"
                min="0"
                step="0.5"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
            />
          </div>

          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Prep Time (minutes)</Label>
              <Input
                type="number"
                min="1"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center gap-3 h-10">
                <button
                  type="button"
                  onClick={() => setStatus('draft')}
                  className={`text-xs px-3 py-1.5 rounded-md border ${
                    status === 'draft'
                      ? 'border-brand bg-brand/10 text-brand'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  Draft
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('published')}
                  className={`text-xs px-3 py-1.5 rounded-md border ${
                    status === 'published'
                      ? 'border-status-success bg-status-success/10 text-status-success'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  Published
                </button>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Allergens (comma-separated)</Label>
              <Input
                value={allergens}
                onChange={(e) => setAllergens(e.target.value)}
                placeholder="e.g. dairy, gluten"
              />
            </div>
            <div className="space-y-2">
              <Label>Tags (comma-separated)</Label>
              <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. popular, vegan" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium text-foreground">Available</p>
              <p className="text-[10px] text-muted-foreground">Show this item on the menu</p>
            </div>
            <Switch checked={isAvailable} onCheckedChange={setIsAvailable} />
          </div>

          {/* Modifier Groups */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Modifier Groups</Label>
              <Button variant="ghost" size="sm" onClick={() => setShowNewModifier(true)}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Group
              </Button>
            </div>
            {modifierGroups.length === 0 ? (
              <p className="text-xs text-muted-foreground">No modifier groups yet.</p>
            ) : (
              <div className="space-y-2">
                {modifierGroups.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center justify-between rounded-md border border-border p-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{group.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {group.options.length} option{group.options.length !== 1 ? 's' : ''} &middot;{' '}
                        {group.required ? 'Required' : 'Optional'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingModifier(group)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveModifier(group.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </FormModal>

      {/* Modifier Group Editor sub-modal */}
      {(editingModifier || showNewModifier) && (
        <ModifierGroupEditor
          open
          onOpenChange={(v) => {
            if (!v) {
              setEditingModifier(null);
              setShowNewModifier(false);
            }
          }}
          group={editingModifier}
          onSave={handleSaveModifier}
        />
      )}
    </>
  );
}
