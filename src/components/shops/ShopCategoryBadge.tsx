import { cn } from '@/lib/utils';
import type { ShopCategory } from '@/types/shop.types';
import {
  ShoppingBag,
  UtensilsCrossed,
  Coffee,
  Sofa,
  Pill,
  Smartphone,
  Shirt,
  Wrench,
  Landmark,
  Bath,
  DoorOpen,
  Package,
} from 'lucide-react';

const categoryConfig: Record<ShopCategory, { label: string; icon: React.ElementType; color: string }> = {
  retail: { label: 'Retail', icon: ShoppingBag, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  restaurant: { label: 'Restaurant', icon: UtensilsCrossed, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  cafe: { label: 'Café', icon: Coffee, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  lounge: { label: 'Lounge', icon: Sofa, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  pharmacy: { label: 'Pharmacy', icon: Pill, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  electronics: { label: 'Electronics', icon: Smartphone, color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400' },
  fashion: { label: 'Fashion', icon: Shirt, color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
  services: { label: 'Services', icon: Wrench, color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' },
  bank: { label: 'Bank', icon: Landmark, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  washroom: { label: 'Washroom', icon: Bath, color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400' },
  gate: { label: 'Gate', icon: DoorOpen, color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400' },
  other: { label: 'Other', icon: Package, color: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400' },
};

interface ShopCategoryBadgeProps {
  category: ShopCategory;
  showIcon?: boolean;
  className?: string;
}

export function ShopCategoryBadge({ category, showIcon = true, className }: ShopCategoryBadgeProps) {
  const config = categoryConfig[category];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium font-lexend',
        config.color,
        className
      )}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </span>
  );
}
