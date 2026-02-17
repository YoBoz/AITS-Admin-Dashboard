import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  Calendar,
  Eye,
  Tag,
  BarChart3,
  Edit,
  Trash2,
  Pause,
  Play,
} from 'lucide-react';
import type { Offer } from '@/types/offer.types';
import { cn } from '@/lib/utils';

interface OfferCardProps {
  offer: Offer;
  onEdit?: (offer: Offer) => void;
  onDelete?: (offer: Offer) => void;
  onToggleStatus?: (offer: Offer) => void;
  onView?: (offer: Offer) => void;
}

const statusStyles: Record<Offer['status'], { bg: string; text: string; dot: string }> = {
  active: { bg: 'bg-green-500/10', text: 'text-green-700 dark:text-green-400', dot: 'bg-green-500' },
  scheduled: { bg: 'bg-blue-500/10', text: 'text-blue-700 dark:text-blue-400', dot: 'bg-blue-500' },
  expired: { bg: 'bg-red-500/10', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-500' },
  paused: { bg: 'bg-amber-500/10', text: 'text-amber-700 dark:text-amber-400', dot: 'bg-amber-500' },
};

const discountLabel: Record<Offer['discount_type'], string> = {
  percentage: '%',
  fixed: 'OFF',
  bogo: 'BOGO',
  freebie: 'FREE',
};

export function OfferCard({ offer, onEdit, onDelete, onToggleStatus, onView }: OfferCardProps) {
  const st = statusStyles[offer.status];

  const discountDisplay = (() => {
    switch (offer.discount_type) {
      case 'percentage':
        return `${offer.discount_value}%`;
      case 'fixed':
        return `$${offer.discount_value}`;
      case 'bogo':
        return 'BOGO';
      case 'freebie':
        return 'FREE';
      default:
        return `${offer.discount_value}`;
    }
  })();

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="group relative bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-200"
    >
      {/* Header with discount badge */}
      <div className="relative h-24 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent flex items-center justify-center">
        <div className="text-center">
          <p className="text-3xl font-bold font-poppins text-primary">
            {discountDisplay}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            {discountLabel[offer.discount_type]}
          </p>
        </div>

        {/* Priority badge */}
        {offer.priority >= 8 && (
          <span className="absolute top-2 left-2 text-[10px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
            HIGH
          </span>
        )}

        {/* Status */}
        <span
          className={cn(
            'absolute top-2 right-2 flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full',
            st.bg,
            st.text
          )}
        >
          <span className={cn('h-1.5 w-1.5 rounded-full', st.dot)} />
          {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-sm font-semibold font-poppins text-foreground line-clamp-1">
            {offer.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
            {offer.description}
          </p>
        </div>

        {/* Shop */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Tag className="h-3 w-3" />
          <span className="truncate">{offer.shop_name}</span>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>
            {format(new Date(offer.start_date), 'MMM dd')} -{' '}
            {format(new Date(offer.end_date), 'MMM dd, yyyy')}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs">
            <Eye className="h-3 w-3 text-muted-foreground" />
            <span className="text-foreground font-medium">
              {offer.impressions >= 1000
                ? `${(offer.impressions / 1000).toFixed(1)}K`
                : offer.impressions}
            </span>
            <span className="text-muted-foreground">views</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <BarChart3 className="h-3 w-3 text-muted-foreground" />
            <span className="text-foreground font-medium">
              {offer.redemptions >= 1000
                ? `${(offer.redemptions / 1000).toFixed(1)}K`
                : offer.redemptions}
            </span>
            <span className="text-muted-foreground">used</span>
          </div>
        </div>

        {/* Categories */}
        {offer.target_categories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {offer.target_categories.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground capitalize"
              >
                {cat}
              </span>
            ))}
            {offer.target_categories.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                +{offer.target_categories.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions Menu */}
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Overlays the status badge on hover */}
      </div>
      <div className="px-4 pb-3 flex items-center gap-1">
        <button
          onClick={() => onView?.(offer)}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors"
        >
          <Eye className="h-3 w-3" />
          View
        </button>
        <button
          onClick={() => onEdit?.(offer)}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
        >
          <Edit className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onToggleStatus?.(offer)}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
        >
          {offer.status === 'paused' ? (
            <Play className="h-3.5 w-3.5" />
          ) : (
            <Pause className="h-3.5 w-3.5" />
          )}
        </button>
        <button
          onClick={() => onDelete?.(offer)}
          className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-500"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
