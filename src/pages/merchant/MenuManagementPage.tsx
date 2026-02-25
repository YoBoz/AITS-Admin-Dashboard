import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UtensilsCrossed, Plus, Trash2, Eye, EyeOff, PackageX,
  Pencil, Upload, RotateCcw, GripVertical, Check, Search, X,
  ChevronRight, FolderPlus, ImagePlus,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates,
  useSortable, verticalListSortingStrategy, rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { RequirePermission } from '@/components/merchant/RequirePermission';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import { Badge } from '@/components/ui/Badge';
import { useMenuStore } from '@/store/menu.store';
import { useMerchantAuth } from '@/hooks/useMerchantAuth';
import type { MenuItem, MenuCategory, MenuSubcategory } from '@/types/menu.types';

// ─── Sortable Subcategory Item ───────────────────────────────────────
interface SortableSubcategoryProps {
  sub: MenuSubcategory;
  canEdit: boolean;
  isRenaming: boolean;
  renameValue: string;
  onStartRename: () => void;
  onRenameChange: (v: string) => void;
  onConfirmRename: () => void;
  onCancelRename: () => void;
  onDelete: () => void;
}

function SortableSubcategoryItem({
  sub, canEdit, isRenaming, renameValue,
  onStartRename, onRenameChange, onConfirmRename, onCancelRename, onDelete,
}: SortableSubcategoryProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: sub.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group/sub flex items-center gap-1 px-2 py-1 rounded text-[11px] text-muted-foreground hover:bg-muted/50',
        isDragging && 'ring-1 ring-brand/30 bg-card shadow-sm'
      )}
    >
      {canEdit && (
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing shrink-0 touch-none"
        >
          <GripVertical className="h-2.5 w-2.5 opacity-30 hover:opacity-70" />
        </button>
      )}
      {!canEdit && <span className="w-1 h-1 rounded-full bg-muted-foreground/40 shrink-0" />}

      {isRenaming ? (
        <input
          autoFocus
          value={renameValue}
          onChange={(e) => onRenameChange(e.target.value)}
          onBlur={onConfirmRename}
          onKeyDown={(e) => { if (e.key === 'Enter') onConfirmRename(); if (e.key === 'Escape') onCancelRename(); }}
          className="flex-1 min-w-0 bg-transparent border-b border-brand/40 outline-none text-[11px] py-0"
        />
      ) : (
        <span className="truncate flex-1">{sub.name}</span>
      )}
      {canEdit && !isRenaming && (
        <div className="hidden group-hover/sub:flex items-center gap-0.5 shrink-0">
          <button onClick={onStartRename} className="rounded p-0.5 hover:bg-muted-foreground/10">
            <Pencil className="h-2 w-2" />
          </button>
          <button onClick={onDelete} className="rounded p-0.5 hover:bg-red-500/10 text-red-500">
            <Trash2 className="h-2 w-2" />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Sortable Subcategory List (extracted to avoid conditional hooks) ─
interface SubcategoryDndListProps {
  subcategories: MenuSubcategory[];
  canEdit: boolean;
  renamingSubId: string | null;
  subRenameValue: string;
  onStartRename: (subId: string, name: string) => void;
  onRenameChange: (v: string) => void;
  onConfirmRename: (subId: string) => void;
  onCancelRename: () => void;
  onDelete: (subId: string, name: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

function SubcategoryDndList({
  subcategories, canEdit, renamingSubId, subRenameValue,
  onStartRename, onRenameChange, onConfirmRename, onCancelRename,
  onDelete, onReorder,
}: SubcategoryDndListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const from = subcategories.findIndex((s) => s.id === active.id);
        const to = subcategories.findIndex((s) => s.id === over.id);
        if (from !== -1 && to !== -1) onReorder(from, to);
      }}
    >
      <SortableContext items={subcategories.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        {subcategories.map((sub) => (
          <SortableSubcategoryItem
            key={sub.id}
            sub={sub}
            canEdit={canEdit}
            isRenaming={renamingSubId === sub.id}
            renameValue={subRenameValue}
            onStartRename={() => onStartRename(sub.id, sub.name)}
            onRenameChange={onRenameChange}
            onConfirmRename={() => onConfirmRename(sub.id)}
            onCancelRename={onCancelRename}
            onDelete={() => onDelete(sub.id, sub.name)}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}

// ─── Sortable Category Item ──────────────────────────────────────────
interface SortableCategoryProps {
  cat: MenuCategory;
  isSelected: boolean;
  canEdit: boolean;
  onSelect: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
  onAddSubcategory: (name: string) => void;
  onRenameSubcategory: (subId: string, name: string) => void;
  onDeleteSubcategory: (subId: string) => void;
  onReorderSubcategories: (fromIndex: number, toIndex: number) => void;
}

function SortableCategoryItem({
  cat, isSelected, canEdit, onSelect, onRename, onDelete,
  onAddSubcategory, onRenameSubcategory, onDeleteSubcategory, onReorderSubcategories,
}: SortableCategoryProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cat.id });
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(cat.name);
  const [showSubInput, setShowSubInput] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [renamingSubId, setRenamingSubId] = useState<string | null>(null);
  const [subRenameValue, setSubRenameValue] = useState('');
  const renameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isRenaming && renameRef.current) renameRef.current.focus();
  }, [isRenaming]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const confirmRename = () => {
    if (renameValue.trim() && renameValue.trim() !== cat.name) {
      onRename(renameValue.trim());
      toast.success(`Category renamed to "${renameValue.trim()}"`);
    }
    setIsRenaming(false);
  };

  const handleAddSub = () => {
    if (!newSubName.trim()) return;
    onAddSubcategory(newSubName.trim());
    toast.success(`Subcategory "${newSubName.trim()}" added`);
    setNewSubName('');
    setShowSubInput(false);
  };

  const confirmSubRename = (subId: string) => {
    if (subRenameValue.trim()) {
      onRenameSubcategory(subId, subRenameValue.trim());
    }
    setRenamingSubId(null);
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* Main category row */}
      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(); } }}
        className={cn(
          'group flex w-full items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-lexend transition-all text-left cursor-pointer',
          isSelected
            ? 'bg-brand/10 text-brand font-medium'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          isDragging && 'ring-2 ring-brand/30 bg-card shadow-lg'
        )}
      >
        {canEdit && (
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing shrink-0 touch-none"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-3 w-3 opacity-40 hover:opacity-80" />
          </button>
        )}

        {isRenaming ? (
          <input
            ref={renameRef}
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onBlur={confirmRename}
            onKeyDown={(e) => { if (e.key === 'Enter') confirmRename(); if (e.key === 'Escape') setIsRenaming(false); }}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 min-w-0 bg-transparent border-b border-brand/50 outline-none text-xs py-0"
          />
        ) : (
          <span className="truncate flex-1">{cat.name}</span>
        )}

        <span className="text-[10px] tabular-nums opacity-50">{cat.items.length}</span>
        {!cat.is_available && <EyeOff className="h-3 w-3 text-red-400 shrink-0" />}

        {cat.subcategories.length > 0 && (
          <ChevronRight className={cn('h-3 w-3 shrink-0 transition-transform opacity-40', isSelected && 'rotate-90')} />
        )}

        {canEdit && !isRenaming && (
          <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setRenameValue(cat.name);
                setIsRenaming(true);
              }}
              className="rounded p-0.5 hover:bg-muted-foreground/10"
              title="Rename"
            >
              <Pencil className="h-2.5 w-2.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSubInput(!showSubInput);
              }}
              className="rounded p-0.5 hover:bg-muted-foreground/10"
              title="Add subcategory"
            >
              <FolderPlus className="h-2.5 w-2.5" />
            </button>
            {cat.items.length === 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="rounded p-0.5 hover:bg-red-500/10 text-red-500"
                title="Delete category"
              >
                <Trash2 className="h-2.5 w-2.5" />
              </button>
            )}
            {cat.items.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Delete "${cat.name}" and all its ${cat.items.length} item(s)?`)) {
                    onDelete();
                  }
                }}
                className="rounded p-0.5 hover:bg-red-500/10 text-red-500"
                title="Delete category"
              >
                <Trash2 className="h-2.5 w-2.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Subcategories (show when category is selected) — draggable */}
      {isSelected && (
        <div className="ml-5 mt-0.5 space-y-0.5">
          <SubcategoryDndList
            subcategories={cat.subcategories}
            canEdit={canEdit}
            renamingSubId={renamingSubId}
            subRenameValue={subRenameValue}
            onStartRename={(subId, name) => { setRenamingSubId(subId); setSubRenameValue(name); }}
            onRenameChange={setSubRenameValue}
            onConfirmRename={(subId) => confirmSubRename(subId)}
            onCancelRename={() => setRenamingSubId(null)}
            onDelete={(subId, name) => { onDeleteSubcategory(subId); toast.success(`Subcategory "${name}" deleted`); }}
            onReorder={onReorderSubcategories}
          />

          {/* Add subcategory inline */}
          <AnimatePresence>
            {showSubInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex gap-1 px-2 py-1">
                  <input
                    autoFocus
                    value={newSubName}
                    onChange={(e) => setNewSubName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSub()}
                    placeholder="Subcategory name"
                    className="flex-1 min-w-0 bg-transparent border-b border-border text-[11px] outline-none placeholder:text-muted-foreground/50"
                  />
                  <button onClick={handleAddSub} className="rounded p-0.5 hover:bg-muted">
                    <Check className="h-2.5 w-2.5 text-brand" />
                  </button>
                  <button onClick={() => { setShowSubInput(false); setNewSubName(''); }} className="rounded p-0.5 hover:bg-muted">
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ─── Sortable Item Card ──────────────────────────────────────────────
interface SortableItemCardProps {
  item: MenuItem;
  canEdit: boolean;
  bulkMode: boolean;
  isSelected: boolean;
  onBulkSelect: () => void;
  onToggleAvailability: () => void;
  onMarkOOS: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function SortableItemCard({
  item, canEdit, bulkMode, isSelected,
  onBulkSelect, onToggleAvailability, onMarkOOS, onEdit, onDelete,
}: SortableItemCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={cn(
        'relative overflow-hidden transition-all',
        !item.is_available && 'opacity-60',
        item.is_out_of_stock && 'border-red-500/30',
        item.status === 'draft' && 'border-amber-500/30',
        bulkMode && isSelected && 'ring-2 ring-brand',
        isDragging && 'ring-2 ring-brand/30 shadow-lg',
      )}>
        {/* Item image */}
        {item.image_url ? (
          <div className="w-full h-32 bg-muted overflow-hidden">
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="w-full h-20 bg-muted/50 flex items-center justify-center">
            <UtensilsCrossed className="h-6 w-6 text-muted-foreground/30" />
          </div>
        )}
        <CardContent className="p-4 space-y-2">
          {/* Drag handle + Bulk checkbox */}
          {bulkMode ? (
            <button
              onClick={onBulkSelect}
              className={cn(
                'absolute top-2 right-2 h-5 w-5 rounded border flex items-center justify-center transition-colors',
                isSelected ? 'bg-brand border-brand text-white' : 'border-border hover:border-brand/50'
              )}
            >
              {isSelected && <Check className="h-3 w-3" />}
            </button>
          ) : canEdit ? (
            <button
              {...attributes}
              {...listeners}
              className="absolute top-2 right-2 cursor-grab active:cursor-grabbing touch-none rounded p-1 hover:bg-muted text-muted-foreground/40 hover:text-muted-foreground transition-colors"
              title="Drag to reorder"
            >
              <GripVertical className="h-3.5 w-3.5" />
            </button>
          ) : null}

          {/* Header */}
          <div className="flex items-start justify-between gap-2 pr-6">
            <div className="min-w-0 flex items-start gap-1.5">
              {/* Veg / Non-Veg / Egg indicator */}
              <span
                className={cn(
                  'mt-0.5 flex-shrink-0 h-4 w-4 rounded-[3px] border-2 flex items-center justify-center',
                  item.diet_type === 'veg' && 'border-green-600',
                  item.diet_type === 'non-veg' && 'border-red-600',
                  item.diet_type === 'egg' && 'border-amber-500',
                )}
                title={item.diet_type === 'veg' ? 'Vegetarian' : item.diet_type === 'non-veg' ? 'Non-Vegetarian' : 'Contains Egg'}
              >
                <span
                  className={cn(
                    'h-2 w-2 rounded-full',
                    item.diet_type === 'veg' && 'bg-green-600',
                    item.diet_type === 'non-veg' && 'bg-red-600',
                    item.diet_type === 'egg' && 'bg-amber-500',
                  )}
                />
              </span>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold font-montserrat truncate">{item.name}</h4>
                <p className="text-[10px] text-muted-foreground truncate">{item.description}</p>
              </div>
            </div>
            <span className="text-sm font-bold font-mono text-brand whitespace-nowrap">
              {item.price} {item.currency}
            </span>
          </div>

          {/* Tags / badges */}
          <div className="flex flex-wrap gap-1">
            {item.status === 'draft' && (
              <Badge variant="warning" className="text-[9px] px-1.5 py-0">Draft</Badge>
            )}
            {item.is_out_of_stock && (
              <Badge variant="destructive" className="text-[9px] px-1.5 py-0">Out of Stock</Badge>
            )}
            {!item.is_available && !item.is_out_of_stock && (
              <Badge variant="secondary" className="text-[9px] px-1.5 py-0">Disabled</Badge>
            )}
            {item.tags.map((t) => (
              <Badge key={t} variant="outline" className="text-[9px] px-1.5 py-0 capitalize">{t}</Badge>
            ))}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span>Prep: {item.prep_time_minutes}m</span>
            {item.allergens.length > 0 && (
              <span className="truncate">⚠ {item.allergens.join(', ')}</span>
            )}
            {item.modifier_groups.length > 0 && (
              <span>{item.modifier_groups.length} modifier{item.modifier_groups.length > 1 ? 's' : ''}</span>
            )}
          </div>

          {/* Actions */}
          {!bulkMode && (
            <div className="flex items-center gap-1.5 pt-1 border-t border-border">
              <div className="flex items-center gap-1 mr-auto">
                <Switch
                  checked={item.is_available}
                  onCheckedChange={() => { if (canEdit) onToggleAvailability(); }}
                  disabled={!canEdit}
                />
                <span className="text-[10px] text-muted-foreground">
                  {item.is_available ? 'Available' : 'Off'}
                </span>
              </div>

              {/* Quick out-of-stock */}
              {canEdit && (
                <button
                  onClick={onMarkOOS}
                  className={cn(
                    'rounded p-1 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors',
                    item.is_out_of_stock && 'text-red-500'
                  )}
                  title="Mark out of stock"
                >
                  <PackageX className="h-3.5 w-3.5" />
                </button>
              )}

              {/* Edit */}
              {canEdit && (
                <button
                  onClick={onEdit}
                  className="rounded p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title="Edit item"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}

              {/* Delete */}
              {canEdit && (
                <button
                  onClick={onDelete}
                  className="rounded p-1 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                  title="Delete item"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Item Modal ───────────────────────────────────────────────────────
interface ItemModalProps {
  open: boolean;
  categoryId: string;
  subcategories: { id: string; name: string }[];
  editItem?: MenuItem | null;
  onClose: () => void;
}

function ItemModal({ open, categoryId, subcategories, editItem, onClose }: ItemModalProps) {
  const { addItem, updateItem } = useMenuStore();
  const isEdit = !!editItem;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(editItem?.name ?? '');
  const [description, setDescription] = useState(editItem?.description ?? '');
  const [price, setPrice] = useState(editItem?.price?.toString() ?? '');
  const [prepTime, setPrepTime] = useState(editItem?.prep_time_minutes?.toString() ?? '5');
  const [allergens, setAllergens] = useState(editItem?.allergens?.join(', ') ?? '');
  const [tags, setTags] = useState(editItem?.tags?.join(', ') ?? '');
  const [subcategoryId, setSubcategoryId] = useState<string>(editItem?.subcategory_id ?? '');
  const [dietType, setDietType] = useState<'veg' | 'non-veg' | 'egg'>(editItem?.diet_type ?? 'veg');
  const [imageUrl, setImageUrl] = useState<string | null>(editItem?.image_url ?? null);
  const [imagePreview, setImagePreview] = useState<string | null>(editItem?.image_url ?? null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be under 5 MB');
        return;
      }
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      setImageUrl(objectUrl);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error('Item name is required');
      return;
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    const data = {
      name: name.trim(),
      description: description.trim(),
      price: parsedPrice,
      currency: 'AED',
      image_url: imageUrl,
      is_available: editItem?.is_available ?? true,
      is_out_of_stock: editItem?.is_out_of_stock ?? false,
      prep_time_minutes: parseInt(prepTime, 10) || 5,
      allergens: allergens.split(',').map((a) => a.trim()).filter(Boolean),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      diet_type: dietType,
      modifier_groups: editItem?.modifier_groups ?? [],
      category_id: categoryId,
      subcategory_id: subcategoryId || null,
    };

    if (isEdit && editItem) {
      updateItem(editItem.id, data);
      toast.success(`"${name}" updated (draft)`);
    } else {
      addItem(categoryId, data);
      toast.success(`"${name}" added (draft)`);
    }
    onClose();
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative z-10 w-full max-w-md max-h-[90vh] rounded-xl bg-card border border-border shadow-xl p-6 mx-4 overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold font-montserrat">
            {isEdit ? 'Edit Item' : 'Add New Item'}
          </h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-muted transition-colors">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Name *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Flat White" />
          </div>

          {/* Image Upload */}
          <div className="space-y-1.5">
            <Label className="text-xs">Item Image</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {imagePreview ? (
              <div className="relative group rounded-lg overflow-hidden border border-border">
                <img src={imagePreview} alt="Preview" className="w-full h-36 object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-full bg-white/90 p-2 hover:bg-white transition-colors"
                  >
                    <Upload className="h-4 w-4 text-foreground" />
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="rounded-full bg-white/90 p-2 hover:bg-white transition-colors"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-28 rounded-lg border-2 border-dashed border-border hover:border-brand/50 transition-colors flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <ImagePlus className="h-6 w-6" />
                <span className="text-xs font-medium">Click to upload image</span>
                <span className="text-[10px] text-muted-foreground">PNG, JPG up to 5 MB</span>
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Price (AED) *</Label>
              <Input type="number" min={0} step={0.5} value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Prep Time (min)</Label>
              <Input type="number" min={1} max={120} value={prepTime} onChange={(e) => setPrepTime(e.target.value)} />
            </div>
          </div>

          {/* Diet type */}
          <div className="space-y-1.5">
            <Label className="text-xs">Diet Type *</Label>
            <div className="flex gap-2">
              {(['veg', 'non-veg', 'egg'] as const).map((dt) => (
                <button
                  key={dt}
                  type="button"
                  onClick={() => setDietType(dt)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                    dietType === dt
                      ? dt === 'veg' ? 'border-green-600 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                        : dt === 'non-veg' ? 'border-red-600 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'
                        : 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
                      : 'border-border text-muted-foreground hover:border-foreground/30'
                  )}
                >
                  <span className={cn(
                    'h-3 w-3 rounded-[2px] border-[1.5px] flex items-center justify-center',
                    dt === 'veg' && 'border-green-600',
                    dt === 'non-veg' && 'border-red-600',
                    dt === 'egg' && 'border-amber-500',
                  )}>
                    <span className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      dt === 'veg' && 'bg-green-600',
                      dt === 'non-veg' && 'bg-red-600',
                      dt === 'egg' && 'bg-amber-500',
                    )} />
                  </span>
                  {dt === 'veg' ? 'Veg' : dt === 'non-veg' ? 'Non-Veg' : 'Egg'}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategory select (optional) */}
          {subcategories.length > 0 && (
            <div className="space-y-1.5">
              <Label className="text-xs">Subcategory (optional)</Label>
              <select
                value={subcategoryId}
                onChange={(e) => setSubcategoryId(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-lexend"
              >
                <option value="">None</option>
                {subcategories.map((sc) => (
                  <option key={sc.id} value={sc.id}>{sc.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs">Allergens (comma separated)</Label>
            <Input value={allergens} onChange={(e) => setAllergens(e.target.value)} placeholder="dairy, gluten, nuts" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Tags (comma separated)</Label>
            <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="popular, new, vegan" />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit}>
            {isEdit ? 'Update' : 'Add Item'}
          </Button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

// ─── Main Page ────────────────────────────────────────────────────────
export default function MenuManagementPage() {
  const { canDo } = useMerchantAuth();
  const {
    categories, selectedCategoryId, hasDraftChanges,
    selectCategory, addCategory, renameCategory, updateCategory, deleteCategory,
    reorderCategories,
    addSubcategory, renameSubcategory, deleteSubcategory, reorderSubcategories,
    toggleItemAvailability, markOutOfStock, deleteItem,
    reorderItems,
    bulkToggleAvailability, bulkMarkOutOfStock,
    publishAll, discardDrafts,
    totalItems, draftCount, outOfStockCount,
  } = useMenuStore();

  const [itemModal, setItemModal] = useState<{ open: boolean; categoryId: string; editItem?: MenuItem | null }>({
    open: false, categoryId: '', editItem: null,
  });
  const [newCatName, setNewCatName] = useState('');
  const [showNewCat, setShowNewCat] = useState(false);
  const [search, setSearch] = useState('');
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // Current category
  const activeCategory = useMemo(
    () => categories.find((c) => c.id === selectedCategoryId) ?? null,
    [categories, selectedCategoryId]
  );

  const filteredItems = useMemo(() => {
    if (!activeCategory) return [];
    const q = search.toLowerCase();
    return q
      ? activeCategory.items.filter((i) => i.name.toLowerCase().includes(q) || i.tags.some((t) => t.toLowerCase().includes(q)))
      : activeCategory.items;
  }, [activeCategory, search]);

  // Group filtered items by subcategory when the category has subcategories
  const groupedItems = useMemo(() => {
    if (!activeCategory || activeCategory.subcategories.length === 0) return null;
    const groups: { id: string; name: string; items: typeof filteredItems }[] = [];
    const subMap = new Map(activeCategory.subcategories.map((s) => [s.id, s]));
    // one group per subcategory in sort order
    for (const sub of activeCategory.subcategories) {
      groups.push({ id: sub.id, name: sub.name, items: filteredItems.filter((i) => i.subcategory_id === sub.id) });
    }
    // uncategorized items (no subcategory_id or unknown id)
    const uncategorized = filteredItems.filter((i) => !i.subcategory_id || !subMap.has(i.subcategory_id));
    if (uncategorized.length > 0) {
      groups.push({ id: '__uncategorized__', name: 'Other', items: uncategorized });
    }
    return groups.filter((g) => g.items.length > 0);
  }, [activeCategory, filteredItems]);

  // ─── DnD Handlers ──────────────────────────────────────────────
  const handleCategoryDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const fromIndex = categories.findIndex((c) => c.id === active.id);
      const toIndex = categories.findIndex((c) => c.id === over.id);
      if (fromIndex !== -1 && toIndex !== -1) reorderCategories(fromIndex, toIndex);
    },
    [categories, reorderCategories]
  );

  const handleItemDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id || !activeCategory) return;
      const fromIndex = activeCategory.items.findIndex((i) => i.id === active.id);
      const toIndex = activeCategory.items.findIndex((i) => i.id === over.id);
      if (fromIndex !== -1 && toIndex !== -1) reorderItems(activeCategory.id, fromIndex, toIndex);
    },
    [activeCategory, reorderItems]
  );

  // Bulk actions
  const handleBulkSelect = (id: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const handleBulkAvailability = (available: boolean) => {
    bulkToggleAvailability(Array.from(selectedItems), available);
    toast.success(`${selectedItems.size} items ${available ? 'enabled' : 'disabled'}`);
    setSelectedItems(new Set());
  };
  const handleBulkOOS = () => {
    bulkMarkOutOfStock(Array.from(selectedItems));
    toast.success(`${selectedItems.size} items marked out of stock`);
    setSelectedItems(new Set());
  };

  const handlePublish = () => {
    publishAll();
    toast.success('All menu changes published!');
  };
  const handleDiscard = () => {
    discardDrafts();
    toast.info('Draft changes discarded');
  };

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim());
    toast.success(`Category "${newCatName}" added`);
    setNewCatName('');
    setShowNewCat(false);
  };

  const canEdit = canDo('menu.edit');

  return (
    <div className="space-y-4">
      {/* Header + Publish sticky bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-foreground">Menu Management</h1>
          <p className="text-xs text-muted-foreground font-lexend mt-0.5">
            {totalItems()} items · {draftCount()} drafts · {outOfStockCount()} out of stock
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasDraftChanges && (
            <>
              <RequirePermission permission="menu.edit">
                <Button variant="outline" size="sm" onClick={handleDiscard} className="gap-1.5">
                  <RotateCcw className="h-3.5 w-3.5" />
                  Discard
                </Button>
              </RequirePermission>
              <RequirePermission permission="menu.publish" disableInstead>
                <Button size="sm" onClick={handlePublish} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Upload className="h-3.5 w-3.5" />
                  Publish All
                </Button>
              </RequirePermission>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-4 items-start">
        {/* ─── LEFT: Categories Panel ───────────────────────────── */}
        <Card className="w-60 shrink-0 hidden md:block">
          <CardContent className="p-3 space-y-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold font-montserrat text-muted-foreground uppercase tracking-wider">
                Categories
              </h4>
              <RequirePermission permission="menu.edit">
                <button
                  onClick={() => setShowNewCat(!showNewCat)}
                  className="rounded-full p-1 hover:bg-muted transition-colors"
                >
                  <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </RequirePermission>
            </div>

            {/* Add category input */}
            <AnimatePresence>
              {showNewCat && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-1 mb-2">
                    <Input
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="Category name"
                      className="h-7 text-xs"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                    />
                    <Button size="sm" variant="ghost" className="h-7 px-2" onClick={handleAddCategory}>
                      <Check className="h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Draggable category list */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleCategoryDragEnd}
            >
              <SortableContext
                items={categories.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                {categories.map((cat) => (
                  <SortableCategoryItem
                    key={cat.id}
                    cat={cat}
                    isSelected={selectedCategoryId === cat.id}
                    canEdit={canEdit}
                    onSelect={() => selectCategory(cat.id)}
                    onRename={(name) => renameCategory(cat.id, name)}
                    onDelete={() => { deleteCategory(cat.id); toast.success(`Category "${cat.name}" deleted`); }}
                    onAddSubcategory={(name) => addSubcategory(cat.id, name)}
                    onRenameSubcategory={(subId, name) => renameSubcategory(cat.id, subId, name)}
                    onDeleteSubcategory={(subId) => deleteSubcategory(cat.id, subId)}
                    onReorderSubcategories={(from, to) => reorderSubcategories(cat.id, from, to)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>

        {/* ─── RIGHT: Items Grid ────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Mobile category select */}
          <div className="md:hidden">
            <select
              value={selectedCategoryId ?? ''}
              onChange={(e) => selectCategory(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-lexend"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.items.length})</option>
              ))}
            </select>
          </div>

          {/* Toolbar */}
          {activeCategory && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold font-montserrat text-foreground">{activeCategory.name}</h2>
                <span className="text-xs text-muted-foreground font-lexend">
                  {activeCategory.items.length} item{activeCategory.items.length !== 1 ? 's' : ''}
                </span>
                {activeCategory.description && (
                  <span className="text-xs text-muted-foreground/70 hidden sm:inline">· {activeCategory.description}</span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search items..."
                  className="pl-8 h-8 text-xs"
                />
              </div>

              <RequirePermission permission="menu.edit">
                <Button
                  size="sm"
                  variant={bulkMode ? 'default' : 'outline'}
                  className="h-8 text-xs gap-1"
                  onClick={() => { setBulkMode(!bulkMode); setSelectedItems(new Set()); }}
                >
                  {bulkMode ? 'Exit Bulk' : 'Bulk Edit'}
                </Button>
              </RequirePermission>

              {/* Category availability toggle */}
              <div className="flex items-center gap-1.5 ml-auto">
                <span className="text-[10px] text-muted-foreground">Category visible</span>
                <Switch
                  checked={activeCategory.is_available}
                  onCheckedChange={(val) => {
                    if (!canEdit) return;
                    updateCategory(activeCategory.id, { is_available: val });
                  }}
                  disabled={!canEdit}
                />
              </div>

              <RequirePermission permission="menu.edit">
                <Button
                  size="sm"
                  className="h-8 text-xs gap-1"
                  onClick={() => setItemModal({ open: true, categoryId: activeCategory.id, editItem: null })}
                >
                  <Plus className="h-3 w-3" />
                  Add Item
                </Button>
              </RequirePermission>
            </div>
            </div>
          )}

          {/* Bulk actions bar */}
          <AnimatePresence>
            {bulkMode && selectedItems.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-2 rounded-lg bg-brand/10 border border-brand/20 px-3 py-2"
              >
                <span className="text-xs font-semibold text-brand">{selectedItems.size} selected</span>
                <div className="ml-auto flex gap-1.5">
                  <RequirePermission permission="menu.edit" disableInstead>
                    <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => handleBulkAvailability(true)}>
                      <Eye className="h-3 w-3 mr-1" /> Enable
                    </Button>
                  </RequirePermission>
                  <RequirePermission permission="menu.edit" disableInstead>
                    <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => handleBulkAvailability(false)}>
                      <EyeOff className="h-3 w-3 mr-1" /> Disable
                    </Button>
                  </RequirePermission>
                  <RequirePermission permission="menu.edit" disableInstead>
                    <Button size="sm" variant="outline" className="h-7 text-[10px] text-red-500 hover:text-red-400" onClick={handleBulkOOS}>
                      <PackageX className="h-3 w-3 mr-1" /> Out of Stock
                    </Button>
                  </RequirePermission>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Items grid */}
          {activeCategory && filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <UtensilsCrossed className="h-10 w-10 text-muted-foreground/20 mb-3" />
              <p className="text-sm text-muted-foreground font-montserrat">
                {search ? 'No items match your search' : 'No items in this category'}
              </p>
            </div>
          ) : activeCategory && groupedItems ? (
            /* ── Grouped by subcategory ── */
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleItemDragEnd}
            >
              <div className="space-y-5">
                {groupedItems.map((group) => (
                  <div key={group.id}>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-semibold font-montserrat text-foreground/80">{group.name}</h3>
                      <span className="text-[10px] text-muted-foreground font-lexend">
                        {group.items.length} item{group.items.length !== 1 ? 's' : ''}
                      </span>
                      <div className="flex-1 border-t border-border/50" />
                    </div>
                    <SortableContext
                      items={group.items.map((i) => i.id)}
                      strategy={rectSortingStrategy}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                        {group.items.map((item) => (
                          <SortableItemCard
                            key={item.id}
                            item={item}
                            canEdit={canEdit}
                            bulkMode={bulkMode}
                            isSelected={selectedItems.has(item.id)}
                            onBulkSelect={() => handleBulkSelect(item.id)}
                            onToggleAvailability={() => toggleItemAvailability(item.id)}
                            onMarkOOS={() => { markOutOfStock(item.id); toast.info(`"${item.name}" marked out of stock`); }}
                            onEdit={() => setItemModal({ open: true, categoryId: item.category_id, editItem: item })}
                            onDelete={() => { deleteItem(item.id); toast.success(`"${item.name}" deleted`); }}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </div>
                ))}
              </div>
            </DndContext>
          ) : activeCategory ? (
            /* ── Flat grid (no subcategories) ── */
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleItemDragEnd}
            >
              <SortableContext
                items={filteredItems.map((i) => i.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {filteredItems.map((item) => (
                    <SortableItemCard
                      key={item.id}
                      item={item}
                      canEdit={canEdit}
                      bulkMode={bulkMode}
                      isSelected={selectedItems.has(item.id)}
                      onBulkSelect={() => handleBulkSelect(item.id)}
                      onToggleAvailability={() => toggleItemAvailability(item.id)}
                      onMarkOOS={() => { markOutOfStock(item.id); toast.info(`"${item.name}" marked out of stock`); }}
                      onEdit={() => setItemModal({ open: true, categoryId: item.category_id, editItem: item })}
                      onDelete={() => { deleteItem(item.id); toast.success(`"${item.name}" deleted`); }}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : null}
        </div>
      </div>

      {/* Item Create/Edit Modal */}
      <AnimatePresence>
        {itemModal.open && (
          <ItemModal
            open={itemModal.open}
            categoryId={itemModal.categoryId}
            subcategories={activeCategory?.subcategories ?? []}
            editItem={itemModal.editItem}
            onClose={() => setItemModal({ open: false, categoryId: '', editItem: null })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
