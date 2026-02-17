import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import type { Campaign } from '@/types/coupon.types';
import { Calendar, MapPin, Tag, Users, TrendingUp } from 'lucide-react';

const statusVariant: Record<Campaign['status'], 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'> = {
  draft: 'outline',
  scheduled: 'info',
  active: 'success',
  paused: 'warning',
  ended: 'secondary',
};

interface CampaignCardProps {
  campaign: Campaign;
  onClick?: () => void;
  className?: string;
}

export function CampaignCard({ campaign, onClick, className }: CampaignCardProps) {
  const redemptionRate =
    campaign.impressions > 0
      ? ((campaign.redemptions / campaign.impressions) * 100).toFixed(1)
      : '0.0';

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold font-poppins text-foreground truncate pr-2">
          {campaign.name}
        </h3>
        <Badge variant={statusVariant[campaign.status]} className="capitalize text-[10px] shrink-0">
          {campaign.status}
        </Badge>
      </div>

      {/* Description */}
      {campaign.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{campaign.description}</p>
      )}

      {/* Meta */}
      <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground mb-3">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {new Date(campaign.start_date).toLocaleDateString()} –{' '}
          {new Date(campaign.end_date).toLocaleDateString()}
        </span>
        <span className="flex items-center gap-1">
          <Tag className="h-3 w-3" />
          {campaign.discount_type === 'percentage'
            ? `${campaign.discount_value}% off`
            : `AED ${campaign.discount_value} off`}
        </span>
        {campaign.target_zones.length > 0 && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {campaign.target_zones.join(', ')}
          </span>
        )}
        {campaign.target_gates.length > 0 && (
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            Gates: {campaign.target_gates.slice(0, 3).join(', ')}
            {campaign.target_gates.length > 3 && ` +${campaign.target_gates.length - 3}`}
          </span>
        )}
      </div>

      {/* Metrics */}
      <div className="flex items-center gap-4 border-t border-border pt-2">
        <div className="flex items-center gap-1 text-xs">
          <TrendingUp className="h-3 w-3 text-status-success" />
          <span className="font-medium">{campaign.redemptions}</span>
          <span className="text-muted-foreground">redeemed</span>
        </div>
        <div className="text-xs text-muted-foreground">
          {redemptionRate}% rate
        </div>
        <div className="ml-auto text-xs font-medium text-foreground">
          AED {campaign.revenue_attributed.toFixed(0)}
        </div>
      </div>
    </button>
  );
}
