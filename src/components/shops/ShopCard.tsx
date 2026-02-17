import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Users, Star, Tag } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { ShopCategoryBadge } from './ShopCategoryBadge';
import { ContractStatusBadge } from './ContractStatusBadge';
import { cn } from '@/lib/utils';
import type { Shop } from '@/types/shop.types';

interface ShopCardProps {
  shop: Shop;
  onClick?: () => void;
}

export function ShopCard({ shop, onClick }: ShopCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
      <Card
        className="p-4 cursor-pointer hover:border-brand/30 transition-colors"
        onClick={onClick || (() => navigate(`/dashboard/shops/${shop.id}`))}
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          {shop.logo_url ? (
            <img
              src={shop.logo_url}
              alt={shop.name}
              className="h-10 w-10 rounded-lg object-cover border"
            />
          ) : (
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
              {shop.name.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold font-poppins text-foreground truncate">{shop.name}</p>
            <p className="text-xs text-muted-foreground truncate">{shop.company_name}</p>
          </div>
          <ShopCategoryBadge category={shop.category} showIcon={false} />
        </div>

        {/* Contract Status */}
        <div className="flex items-center justify-between mb-3">
          <ContractStatusBadge status={shop.contract.status} />
          <span className={cn(
            'text-xs font-medium px-2 py-0.5 rounded-full',
            shop.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
            shop.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
            'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
          )}>
            {shop.status}
          </span>
        </div>

        {/* Info rows */}
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{shop.location.zone} — {shop.location.unit_number}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{shop.total_visitors.toLocaleString()} visitors</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-amber-500" />
            <span>{shop.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            <span>{shop.offers_count} offers</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
