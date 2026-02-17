import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockCampaigns, mockCoupons } from '@/data/mock/merchant-campaigns.mock';
import { CampaignCard } from '@/components/merchant/CampaignCard';
import { CouponRedeemPanel } from './CouponRedeemPanel';
import { CampaignBuilderModal } from './CampaignBuilderModal';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useMerchantAuth } from '@/hooks/useMerchantAuth';
import type { Campaign, Coupon } from '@/types/coupon.types';
import { Plus, Search, Ticket, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';

type TabType = 'coupons' | 'campaigns';

export default function CouponsPage() {
  const { canDo } = useMerchantAuth();

  const [activeTab, setActiveTab] = useState<TabType>('coupons');
  const [coupons] = useState<Coupon[]>(mockCoupons);
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [search, setSearch] = useState('');
  const [showRedeemPanel, setShowRedeemPanel] = useState(false);
  const [showCampaignBuilder, setShowCampaignBuilder] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  // Filtered coupons
  const filteredCoupons = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  // Filtered campaigns
  const filteredCampaigns = campaigns.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  const statusVariant = (status: string) => {
    const map: Record<string, 'success' | 'warning' | 'secondary' | 'destructive' | 'info' | 'outline'> = {
      active: 'success',
      paused: 'warning',
      expired: 'secondary',
      depleted: 'destructive',
      scheduled: 'info',
      ended: 'secondary',
      draft: 'outline',
    };
    return map[status] ?? 'outline';
  };

  const handleSaveCampaign = (campaign: Campaign) => {
    setCampaigns((prev) => {
      const idx = prev.findIndex((c) => c.id === campaign.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = campaign;
        return updated;
      }
      return [...prev, campaign];
    });
    setEditingCampaign(null);
    setShowCampaignBuilder(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-montserrat text-foreground">Coupons & Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage discount codes and promotional campaigns.</p>
        </div>
        <div className="flex items-center gap-2">
          {canDo('coupons.validate') && (
            <Button variant="outline" onClick={() => setShowRedeemPanel(true)}>
              <Ticket className="h-4 w-4 mr-1" /> Redeem Code
            </Button>
          )}
          {canDo('campaigns.create') && (
            <Button onClick={() => setShowCampaignBuilder(true)}>
              <Plus className="h-4 w-4 mr-1" /> New Campaign
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-border">
        {(['coupons', 'campaigns'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'relative pb-2 text-sm font-medium transition-colors capitalize',
              activeTab === tab
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="coupons-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-full"
              />
            )}
          </button>
        ))}
        <div className="ml-auto pb-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-8 h-8 w-48 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'coupons' ? (
          <motion.div
            key="coupons"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {filteredCoupons.length === 0 ? (
              <EmptyState icon={Ticket} title="No coupons" description="No coupons match your search." />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCoupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold font-mono text-foreground">
                        {coupon.code}
                      </span>
                      <Badge variant={statusVariant(coupon.status)} className="text-[10px] capitalize">
                        {coupon.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{coupon.description}</p>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>
                        {coupon.type === 'percentage'
                          ? `${coupon.value}% off`
                          : coupon.type === 'fixed'
                          ? `AED ${coupon.value} off`
                          : coupon.type === 'bogo'
                          ? 'Buy one get one'
                          : 'Freebie'}
                      </span>
                      <span>
                        {coupon.used_count}/{coupon.max_uses ?? '∞'} used
                      </span>
                    </div>
                    {coupon.min_order_value && (
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Min order: AED {coupon.min_order_value}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="campaigns"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {filteredCampaigns.length === 0 ? (
              <EmptyState
                icon={Megaphone}
                title="No campaigns"
                description="Create your first campaign to drive sales."
                action={
                  canDo('campaigns.create') ? (
                    <Button size="sm" onClick={() => setShowCampaignBuilder(true)}>
                      <Plus className="h-3.5 w-3.5 mr-1" /> New Campaign
                    </Button>
                  ) : undefined
                }
              />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCampaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    onClick={() => {
                      setEditingCampaign(campaign);
                      setShowCampaignBuilder(true);
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Redeem Panel */}
      {showRedeemPanel && (
        <CouponRedeemPanel
          open={showRedeemPanel}
          onOpenChange={setShowRedeemPanel}
          coupons={coupons}
        />
      )}

      {/* Campaign Builder Modal */}
      {showCampaignBuilder && (
        <CampaignBuilderModal
          open={showCampaignBuilder}
          onOpenChange={(v) => {
            if (!v) {
              setEditingCampaign(null);
              setShowCampaignBuilder(false);
            }
          }}
          campaign={editingCampaign}
          onSave={handleSaveCampaign}
        />
      )}
    </div>
  );
}
