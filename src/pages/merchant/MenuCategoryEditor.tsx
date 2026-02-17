import { useState } from 'react';
import { FormModal } from '@/components/common/FormModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import type { MenuCategory } from '@/types/menu.types';
import { Save } from 'lucide-react';

interface MenuCategoryEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: MenuCategory | null;
  onSave: (category: MenuCategory) => void;
}

export function MenuCategoryEditor({
  open,
  onOpenChange,
  category,
  onSave,
}: MenuCategoryEditorProps) {
  const isNew = !category;
  const [name, setName] = useState(category?.name ?? '');
  const [description, setDescription] = useState(category?.description ?? '');

  const handleSave = () => {
    if (!name.trim()) return;
    const saved: MenuCategory = {
      id: category?.id ?? `cat-new-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      sort_order: category?.sort_order ?? 99,
      is_available: category?.is_available ?? true,
      items: category?.items ?? [],
    };
    onSave(saved);
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isNew ? 'New Category' : 'Edit Category'}
      subtitle="Manage category name and description"
      size="sm"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            <Save className="h-4 w-4 mr-1" />
            {isNew ? 'Create' : 'Save'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Category Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Hot Drinks"
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
          />
        </div>
      </div>
    </FormModal>
  );
}
