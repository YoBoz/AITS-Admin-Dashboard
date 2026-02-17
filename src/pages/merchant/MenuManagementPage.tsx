import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockMenuCategories } from '@/data/mock/merchant-menu.mock';
import { MenuItemCard } from '@/components/merchant/MenuItemCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { MenuCategoryEditor } from './MenuCategoryEditor';
import { MenuItemEditor } from './MenuItemEditor';
import type { MenuCategory, MenuItem } from '@/types/menu.types';
import { Plus, Search, FolderOpen, ChefHat, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MenuManagementPage() {
  const [categories, setCategories] = useState<MenuCategory[]>(mockMenuCategories);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    categories[0]?.id ?? null
  );
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [showNewItem, setShowNewItem] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [search, setSearch] = useState('');

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId) ?? null;

  const filteredItems = selectedCategory
    ? selectedCategory.items.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const handleToggleItemAvailability = (itemId: string, available: boolean) => {
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        items: cat.items.map((item) =>
          item.id === itemId ? { ...item, is_available: available } : item
        ),
      }))
    );
  };

  const handleToggleCategoryAvailability = (catId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === catId ? { ...cat, is_available: !cat.is_available } : cat
      )
    );
  };

  const handleSaveItem = (item: MenuItem) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== selectedCategoryId) return cat;
        const existing = cat.items.findIndex((i) => i.id === item.id);
        if (existing >= 0) {
          const updated = [...cat.items];
          updated[existing] = item;
          return { ...cat, items: updated };
        }
        return { ...cat, items: [...cat.items, item] };
      })
    );
    setEditingItem(null);
    setShowNewItem(false);
  };

  const handleSaveCategory = (cat: MenuCategory) => {
    setCategories((prev) => {
      const existing = prev.findIndex((c) => c.id === cat.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], name: cat.name, description: cat.description };
        return updated;
      }
      return [...prev, cat];
    });
    setEditingCategory(null);
    setShowNewCategory(false);
  };

  return (
    <div className="flex gap-4 h-[calc(100vh-8rem)]">
      {/* Left — Categories */}
      <div className="w-56 shrink-0 flex flex-col border-r border-border pr-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold font-poppins text-foreground">Categories</h2>
          <Button variant="ghost" size="sm" onClick={() => setShowNewCategory(true)}>
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={cn(
                'w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                cat.id === selectedCategoryId
                  ? 'bg-brand/8 text-brand font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <GripVertical className="h-3 w-3 shrink-0 text-muted-foreground/40" />
              <span className="flex-1 truncate">{cat.name}</span>
              <Badge variant={cat.is_available ? 'success' : 'secondary'} className="text-[9px] px-1.5">
                {cat.items.length}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Center — Items list */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedCategory ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold font-poppins text-foreground truncate">
                    {selectedCategory.name}
                  </h2>
                  <button
                    onClick={() => setEditingCategory(selectedCategory)}
                    className="text-xs text-brand hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleCategoryAvailability(selectedCategory.id)}
                    className={cn(
                      'text-xs',
                      selectedCategory.is_available ? 'text-status-success' : 'text-muted-foreground'
                    )}
                  >
                    {selectedCategory.is_available ? 'Available' : 'Hidden'}
                  </button>
                </div>
                {selectedCategory.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">{selectedCategory.description}</p>
                )}
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search items..."
                    className="pl-8 h-8 w-48 text-xs"
                  />
                </div>
                <Button size="sm" onClick={() => setShowNewItem(true)}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Item
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              <AnimatePresence>
                {filteredItems.length === 0 ? (
                  <EmptyState
                    icon={ChefHat}
                    title="No items"
                    description="Add menu items to this category."
                    action={
                      <Button size="sm" onClick={() => setShowNewItem(true)}>
                        <Plus className="h-3.5 w-3.5 mr-1" /> Add Item
                      </Button>
                    }
                  />
                ) : (
                  filteredItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                    >
                      <MenuItemCard
                        item={item}
                        onEdit={() => setEditingItem(item)}
                        onToggleAvailability={(v) => handleToggleItemAvailability(item.id, v)}
                      />
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <EmptyState
            icon={FolderOpen}
            title="Select a category"
            description="Choose a category from the left to manage its items."
          />
        )}
      </div>

      {/* Item Editor Modal */}
      {(editingItem || showNewItem) && (
        <MenuItemEditor
          open
          onOpenChange={(v) => {
            if (!v) {
              setEditingItem(null);
              setShowNewItem(false);
            }
          }}
          item={editingItem}
          categoryId={selectedCategoryId ?? ''}
          onSave={handleSaveItem}
        />
      )}

      {/* Category Editor Modal */}
      {(editingCategory || showNewCategory) && (
        <MenuCategoryEditor
          open
          onOpenChange={(v) => {
            if (!v) {
              setEditingCategory(null);
              setShowNewCategory(false);
            }
          }}
          category={editingCategory}
          onSave={handleSaveCategory}
        />
      )}
    </div>
  );
}
