export interface ModifierOption {
  id: string;
  name: string;
  price: number;
  is_available: boolean;
}

export interface ModifierGroup {
  id: string;
  name: string;
  required: boolean;
  min_select: number;
  max_select: number;
  options: ModifierOption[];
}

export type DietType = 'veg' | 'non-veg' | 'egg';

export interface MenuItem {
  id: string;
  category_id: string;
  subcategory_id: string | null;
  name: string;
  description: string;
  price: number;
  currency: string;
  image_url: string | null;
  is_available: boolean;
  is_out_of_stock: boolean;
  prep_time_minutes: number;
  allergens: string[];
  tags: string[];
  diet_type: DietType;
  modifier_groups: ModifierGroup[];
  status: 'draft' | 'published';
  sort_order: number;
}

export interface MenuSubcategory {
  id: string;
  category_id: string;
  name: string;
  sort_order: number;
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  is_available: boolean;
  subcategories: MenuSubcategory[];
  items: MenuItem[];
}
