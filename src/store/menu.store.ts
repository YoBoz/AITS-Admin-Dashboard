import { create } from 'zustand';
import type { MenuCategory, MenuItem } from '@/types/menu.types';
import { mockMenuCategories } from '@/data/mock/menu.mock';
import { arrayMove } from '@dnd-kit/sortable';

// ─── Types ────────────────────────────────────────────────────────────
interface MenuState {
  categories: MenuCategory[];
  selectedCategoryId: string | null;
  hasDraftChanges: boolean;

  // Category actions
  selectCategory: (id: string) => void;
  addCategory: (name: string) => void;
  renameCategory: (id: string, name: string) => void;
  updateCategory: (id: string, updates: Partial<Pick<MenuCategory, 'name' | 'description' | 'is_available'>>) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (fromIndex: number, toIndex: number) => void;

  // Subcategory actions
  addSubcategory: (categoryId: string, name: string) => void;
  renameSubcategory: (categoryId: string, subId: string, name: string) => void;
  deleteSubcategory: (categoryId: string, subId: string) => void;
  reorderSubcategories: (categoryId: string, fromIndex: number, toIndex: number) => void;

  // Item actions
  addItem: (categoryId: string, item: Omit<MenuItem, 'id' | 'sort_order' | 'status'>) => void;
  updateItem: (itemId: string, updates: Partial<MenuItem>) => void;
  deleteItem: (itemId: string) => void;
  toggleItemAvailability: (itemId: string) => void;
  markOutOfStock: (itemId: string) => void;
  reorderItems: (categoryId: string, fromIndex: number, toIndex: number) => void;

  // Bulk actions
  bulkToggleAvailability: (itemIds: string[], available: boolean) => void;
  bulkMarkOutOfStock: (itemIds: string[]) => void;

  // Publish workflow
  publishAll: () => void;
  discardDrafts: () => void;

  // Counts
  totalItems: () => number;
  draftCount: () => number;
  outOfStockCount: () => number;
}

let nextCatId = 100;
let nextItemId = 100;
let nextSubId = 100;

export const useMenuStore = create<MenuState>((set, get) => ({
  categories: mockMenuCategories,
  selectedCategoryId: mockMenuCategories[0]?.id ?? null,
  hasDraftChanges: mockMenuCategories.some((c) => c.items.some((i) => i.status === 'draft')),

  // ─── Category Actions ───────────────────────────────────────────
  selectCategory: (id) => set({ selectedCategoryId: id }),

  addCategory: (name) => {
    const id = `cat-new-${++nextCatId}`;
    set((s) => ({
      categories: [
        ...s.categories,
        {
          id,
          name,
          description: null,
          sort_order: s.categories.length,
          is_available: true,
          subcategories: [],
          items: [],
        },
      ],
      selectedCategoryId: id,
      hasDraftChanges: true,
    }));
  },

  renameCategory: (id, name) =>
    set((s) => ({
      categories: s.categories.map((c) => (c.id === id ? { ...c, name } : c)),
      hasDraftChanges: true,
    })),

  updateCategory: (id, updates) =>
    set((s) => ({
      categories: s.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),

  deleteCategory: (id) =>
    set((s) => {
      const filtered = s.categories.filter((c) => c.id !== id);
      return {
        categories: filtered,
        selectedCategoryId: s.selectedCategoryId === id ? (filtered[0]?.id ?? null) : s.selectedCategoryId,
      };
    }),

  reorderCategories: (fromIndex, toIndex) =>
    set((s) => {
      const cats = arrayMove([...s.categories], fromIndex, toIndex);
      return { categories: cats.map((c, i) => ({ ...c, sort_order: i })) };
    }),

  // ─── Subcategory Actions ────────────────────────────────────────
  addSubcategory: (categoryId, name) =>
    set((s) => ({
      categories: s.categories.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              subcategories: [
                ...c.subcategories,
                {
                  id: `sub-new-${++nextSubId}`,
                  category_id: categoryId,
                  name,
                  sort_order: c.subcategories.length,
                },
              ],
            }
          : c
      ),
      hasDraftChanges: true,
    })),

  renameSubcategory: (categoryId, subId, name) =>
    set((s) => ({
      categories: s.categories.map((c) =>
        c.id === categoryId
          ? { ...c, subcategories: c.subcategories.map((sc) => (sc.id === subId ? { ...sc, name } : sc)) }
          : c
      ),
      hasDraftChanges: true,
    })),

  deleteSubcategory: (categoryId, subId) =>
    set((s) => ({
      categories: s.categories.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              subcategories: c.subcategories.filter((sc) => sc.id !== subId),
              // Reset items that had this subcategory
              items: c.items.map((i) => (i.subcategory_id === subId ? { ...i, subcategory_id: null } : i)),
            }
          : c
      ),
      hasDraftChanges: true,
    })),

  reorderSubcategories: (categoryId, fromIndex, toIndex) =>
    set((s) => ({
      categories: s.categories.map((c) => {
        if (c.id !== categoryId) return c;
        const subs = arrayMove([...c.subcategories], fromIndex, toIndex);
        return { ...c, subcategories: subs.map((sc, i) => ({ ...sc, sort_order: i })) };
      }),
    })),

  // ─── Item Actions ───────────────────────────────────────────────
  addItem: (categoryId, itemData) =>
    set((s) => ({
      categories: s.categories.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              items: [
                ...c.items,
                {
                  ...itemData,
                  id: `item-new-${++nextItemId}`,
                  sort_order: c.items.length,
                  status: 'draft' as const,
                },
              ],
            }
          : c
      ),
      hasDraftChanges: true,
    })),

  updateItem: (itemId, updates) =>
    set((s) => ({
      categories: s.categories.map((c) => ({
        ...c,
        items: c.items.map((i) =>
          i.id === itemId ? { ...i, ...updates, status: 'draft' as const } : i
        ),
      })),
      hasDraftChanges: true,
    })),

  deleteItem: (itemId) =>
    set((s) => ({
      categories: s.categories.map((c) => ({
        ...c,
        items: c.items.filter((i) => i.id !== itemId),
      })),
      hasDraftChanges: true,
    })),

  toggleItemAvailability: (itemId) =>
    set((s) => ({
      categories: s.categories.map((c) => ({
        ...c,
        items: c.items.map((i) =>
          i.id === itemId
            ? { ...i, is_available: !i.is_available, is_out_of_stock: !i.is_available ? false : i.is_out_of_stock, status: 'draft' as const }
            : i
        ),
      })),
      hasDraftChanges: true,
    })),

  markOutOfStock: (itemId) =>
    set((s) => ({
      categories: s.categories.map((c) => ({
        ...c,
        items: c.items.map((i) =>
          i.id === itemId
            ? { ...i, is_out_of_stock: true, is_available: false, status: 'draft' as const }
            : i
        ),
      })),
      hasDraftChanges: true,
    })),

  reorderItems: (categoryId, fromIndex, toIndex) =>
    set((s) => ({
      categories: s.categories.map((c) => {
        if (c.id !== categoryId) return c;
        const items = arrayMove([...c.items], fromIndex, toIndex);
        return { ...c, items: items.map((it, i) => ({ ...it, sort_order: i })) };
      }),
    })),

  // ─── Bulk Actions ───────────────────────────────────────────────
  bulkToggleAvailability: (itemIds, available) =>
    set((s) => ({
      categories: s.categories.map((c) => ({
        ...c,
        items: c.items.map((i) =>
          itemIds.includes(i.id)
            ? { ...i, is_available: available, is_out_of_stock: available ? false : i.is_out_of_stock, status: 'draft' as const }
            : i
        ),
      })),
      hasDraftChanges: true,
    })),

  bulkMarkOutOfStock: (itemIds) =>
    set((s) => ({
      categories: s.categories.map((c) => ({
        ...c,
        items: c.items.map((i) =>
          itemIds.includes(i.id)
            ? { ...i, is_out_of_stock: true, is_available: false, status: 'draft' as const }
            : i
        ),
      })),
      hasDraftChanges: true,
    })),

  // ─── Publish Workflow ───────────────────────────────────────────
  publishAll: () =>
    set((s) => ({
      categories: s.categories.map((c) => ({
        ...c,
        items: c.items.map((i) => ({ ...i, status: 'published' as const })),
      })),
      hasDraftChanges: false,
    })),

  discardDrafts: () =>
    set({
      categories: mockMenuCategories,
      hasDraftChanges: false,
    }),

  // ─── Counts ─────────────────────────────────────────────────────
  totalItems: () => get().categories.reduce((sum, c) => sum + c.items.length, 0),
  draftCount: () =>
    get().categories.reduce(
      (sum, c) => sum + c.items.filter((i) => i.status === 'draft').length,
      0
    ),
  outOfStockCount: () =>
    get().categories.reduce(
      (sum, c) => sum + c.items.filter((i) => i.is_out_of_stock).length,
      0
    ),
}));
