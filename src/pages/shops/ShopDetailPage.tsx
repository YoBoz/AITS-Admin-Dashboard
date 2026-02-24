import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Mail,
  Phone,
  User,
  Star,
  Users,
  Tag,
  FileText,
  Upload,
  Download,
  Trash2,
  ExternalLink,
  Megaphone,
  Ticket,
  ClipboardList,
  Percent,
  Gift,
  ShoppingBag,
  Clock,
  Play,
  Pause,
  Flag,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog';
import { SectionCard } from '@/components/common/SectionCard';
import { ContractStatusBadge } from '@/components/shops/ContractStatusBadge';
import { ShopCategoryBadge } from '@/components/shops/ShopCategoryBadge';
import { ContractTimeline } from '@/components/offers/ContractTimeline';
import { useShopsStore } from '@/store/shops.store';
import { useCouponStore } from '@/store/coupon.store';
import { useCampaignStore } from '@/store/campaign.store';
import { offersData } from '@/data/mock/offers.mock';
import { opsOrdersData } from '@/data/mock/ops-orders.mock';
import { cn } from '@/lib/utils';

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'contract', label: 'Contract' },
  { id: 'orders', label: 'Orders' },
  { id: 'campaigns', label: 'Campaigns' },
  { id: 'coupons', label: 'Coupons' },
  { id: 'offers', label: 'Offers' },
  { id: 'visitors', label: 'Visitor Stats' },
  { id: 'documents', label: 'Documents' },
];

export default function ShopDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const shops = useShopsStore((s) => s.shops);
  const coupons = useCouponStore((s) => s.coupons);
  const campaigns = useCampaignStore((s) => s.campaigns);
  const updateShop = useShopsStore((s) => s.updateShop);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Contract modal states
  const [showEditContract, setShowEditContract] = useState(false);
  const [showRenewContract, setShowRenewContract] = useState(false);
  
  // Edit contract form state
  const [editForm, setEditForm] = useState({
    monthly_fee: 0,
    revenue_share_percent: 0,
    auto_renew: false,
  });
  
  // Renew contract form state
  const [renewForm, setRenewForm] = useState({
    duration_months: 12,
    new_monthly_fee: 0,
    new_revenue_share: 0,
  });

  const shop = shops.find((s) => s.id === id);

  const shopOffers = useMemo(
    () => offersData.filter((o) => shop && o.shop_id === shop.id),
    [shop]
  );

  const shopCoupons = useMemo(
    () => coupons.filter((c) => shop && c.shop_id === shop.id),
    [shop, coupons]
  );

  const shopCampaigns = useMemo(
    () => campaigns.filter((c) => shop && c.shop_id === shop.id),
    [shop, campaigns]
  );

  const shopOrders = useMemo(
    () => opsOrdersData.filter((o) => shop && o.shop_id === shop.id),
    [shop]
  );

  const visitorData = useMemo(() => {
    if (!shop) return [];
    const seed = parseInt(shop.id.replace(/\D/g, '')) || 1;
    return Array.from({ length: 30 }, (_, i) => ({
      day: format(new Date(Date.now() - (29 - i) * 86400000), 'MMM dd'),
      visitors: Math.floor(pseudoRandom(seed + i * 11) * 500) + 100,
    }));
  }, [shop]);

  const mockDocuments = useMemo(() => [
    { name: 'Contract Agreement.pdf', type: 'PDF', size: '2.4 MB', date: '2024-01-15' },
    { name: 'Insurance Certificate.pdf', type: 'PDF', size: '1.1 MB', date: '2024-02-20' },
    { name: 'Trade License.pdf', type: 'PDF', size: '890 KB', date: '2024-03-01' },
    { name: 'Logo Assets.zip', type: 'ZIP', size: '5.2 MB', date: '2024-01-10' },
  ], []);

  if (!shop) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg text-muted-foreground">Shop not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/dashboard/shops')}>
          Back to Shops
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Back button & breadcrumb */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/shops')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <nav className="flex items-center gap-1 text-sm text-muted-foreground font-lexend">
          <button onClick={() => navigate('/dashboard/shops')} className="hover:text-foreground">
            Shops
          </button>
          <span>/</span>
          <span className="text-foreground font-medium">{shop.name}</span>
        </nav>
      </div>

      {/* Header */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          {shop.logo_url ? (
            <img src={shop.logo_url} alt={shop.name} className="h-16 w-16 rounded-lg object-cover border" />
          ) : (
            <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center text-xl font-bold text-muted-foreground">
              {shop.name.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold font-poppins text-foreground">{shop.name}</h1>
              <ShopCategoryBadge category={shop.category} />
            </div>
            <p className="text-sm text-muted-foreground">{shop.company_name}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{shop.location.zone} — {shop.location.unit_number}</span>
              <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-500" />{shop.rating.toFixed(1)}</span>
              <span className="flex items-center gap-1"><Users className="h-3 w-3" />{shop.total_visitors.toLocaleString()} visitors</span>
            </div>
          </div>
          <ContractStatusBadge status={shop.contract.status} />
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2.5 text-sm font-lexend font-medium whitespace-nowrap transition-colors border-b-2 -mb-px',
              activeTab === tab.id
                ? 'border-brand text-brand'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
            {tab.id === 'offers' && shopOffers.length > 0 && (
              <span className="ml-1.5 text-xs bg-muted px-1.5 py-0.5 rounded-full">{shopOffers.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard title="Shop Information">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{shop.description}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <ShopCategoryBadge category={shop.category} className="mt-1" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <span className={cn(
                    'inline-flex mt-1 px-2 py-0.5 rounded-full text-xs font-medium',
                    shop.status === 'active' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
                    shop.status === 'pending' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                  )}>
                    {shop.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Registered</p>
                  <p className="font-medium">{format(new Date(shop.registered_at), 'MMM dd, yyyy')}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Offers</p>
                  <p className="font-medium">{shop.offers_count} active</p>
                </div>
              </div>
            </div>
          </SectionCard>
          <SectionCard title="Location">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /><span>{shop.location.zone} — Unit {shop.location.unit_number}, Floor {shop.location.floor}</span></div>
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/map')}>
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                Show on Map
              </Button>
            </div>
          </SectionCard>
          <SectionCard title="Contact" className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /><span>{shop.contact.name}</span></div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><span>{shop.contact.email}</span></div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /><span>{shop.contact.phone}</span></div>
            </div>
          </SectionCard>
        </div>
      )}

      {activeTab === 'contract' && (
        <div className="space-y-6">
          <SectionCard title="Contract Timeline">
            <ContractTimeline
              startDate={shop.contract.start_date}
              endDate={shop.contract.end_date}
              status={shop.contract.status}
            />
          </SectionCard>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SectionCard title="Contract Details">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Contract ID</span>
                  <span className="font-mono font-medium">{shop.contract.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Start Date</span>
                  <span className="font-medium">{format(new Date(shop.contract.start_date), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">End Date</span>
                  <span className="font-medium">{format(new Date(shop.contract.end_date), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Monthly Fee</span>
                  <span className="font-medium">${shop.contract.monthly_fee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Revenue Share</span>
                  <span className="font-medium">{shop.contract.revenue_share_percent}%</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Auto-Renew</span>
                  <span className="font-medium">{shop.contract.auto_renew ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Status</span>
                  <ContractStatusBadge status={shop.contract.status} />
                </div>
              </div>
            </SectionCard>
            <SectionCard title="Actions">
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => {
                    setEditForm({
                      monthly_fee: shop.contract.monthly_fee,
                      revenue_share_percent: shop.contract.revenue_share_percent,
                      auto_renew: shop.contract.auto_renew,
                    });
                    setShowEditContract(true);
                  }}
                >
                  Edit Contract
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => {
                    setRenewForm({
                      duration_months: 12,
                      new_monthly_fee: shop.contract.monthly_fee,
                      new_revenue_share: shop.contract.revenue_share_percent,
                    });
                    setShowRenewContract(true);
                  }}
                >
                  Renew Contract
                </Button>
                {shop.contract.terms_file_url && (
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />Download Terms
                  </Button>
                )}
              </div>
            </SectionCard>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{shopOrders.length} orders found</p>
          </div>
          {shopOrders.length > 0 ? (
            <div className="space-y-3">
              {shopOrders.slice(0, 20).map((order) => (
                <Card key={order.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold font-mono">{order.order_number}</p>
                        <Badge variant={
                          order.status === 'delivered' ? 'success' :
                          order.status === 'in_transit' ? 'info' :
                          order.status === 'preparing' ? 'warning' :
                          order.status === 'new' ? 'secondary' :
                          'destructive'
                        }>
                          {order.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {order.items.length} items • AED {order.total.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(order.created_at), 'MMM dd, HH:mm')}
                        </span>
                        <span>Gate {order.destination_gate}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <ClipboardList className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No orders for this shop yet</p>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{shopCampaigns.length} campaigns found</p>
            <p className="text-xs text-muted-foreground italic">Managed via merchant dashboard</p>
          </div>
          {shopCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shopCampaigns.map((campaign) => (
                <Card key={campaign.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-semibold font-poppins">{campaign.name}</p>
                    <Badge variant={
                      campaign.status === 'active' ? 'success' :
                      campaign.status === 'scheduled' ? 'info' :
                      campaign.status === 'paused' ? 'warning' :
                      campaign.status === 'ended' ? 'destructive' :
                      'secondary'
                    }>
                      {campaign.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{campaign.description}</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-2 bg-muted rounded">
                      <p className="font-semibold">{campaign.impressions.toLocaleString()}</p>
                      <p className="text-muted-foreground">Impressions</p>
                    </div>
                    <div className="text-center p-2 bg-muted rounded">
                      <p className="font-semibold">{campaign.redemptions.toLocaleString()}</p>
                      <p className="text-muted-foreground">Redemptions</p>
                    </div>
                    <div className="text-center p-2 bg-muted rounded">
                      <p className="font-semibold">AED {campaign.revenue_attributed.toLocaleString()}</p>
                      <p className="text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                    <span>{format(new Date(campaign.start_date), 'MMM dd')} - {format(new Date(campaign.end_date), 'MMM dd, yyyy')}</span>
                    <div className="flex items-center gap-1">
                      {campaign.status === 'active' && (
                        <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => toast.success('Campaign paused by admin')} title="Pause campaign">
                          <Pause className="h-3 w-3" />
                        </Button>
                      )}
                      {campaign.status === 'paused' && (
                        <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => toast.success('Campaign resumed')} title="Resume campaign">
                          <Play className="h-3 w-3" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-amber-500 hover:text-amber-600" onClick={() => toast.warning('Campaign flagged for review')} title="Flag for review">
                        <Flag className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Megaphone className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No campaigns for this shop yet</p>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'coupons' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{shopCoupons.length} coupons found</p>
            <p className="text-xs text-muted-foreground italic">Managed via merchant dashboard</p>
          </div>
          {shopCoupons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {shopCoupons.map((coupon) => {
                const TypeIcon = coupon.type === 'percentage' ? Percent : 
                  coupon.type === 'fixed' ? Tag :
                  coupon.type === 'bogo' ? ShoppingBag : Gift;
                return (
                  <Card key={coupon.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-brand/10 flex items-center justify-center">
                          <TypeIcon className="h-4 w-4 text-brand" />
                        </div>
                        <div>
                          <p className="text-sm font-mono font-semibold">{coupon.code}</p>
                          <p className="text-xs text-muted-foreground">{coupon.type}</p>
                        </div>
                      </div>
                      <Badge variant={
                        coupon.status === 'active' ? 'success' :
                        coupon.status === 'expired' ? 'destructive' :
                        coupon.status === 'depleted' ? 'warning' :
                        'secondary'
                      }>
                        {coupon.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{coupon.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Used: {coupon.used_count}{coupon.max_uses ? ` / ${coupon.max_uses}` : ''}
                      </span>
                      <span className="text-muted-foreground">
                        Expires: {format(new Date(coupon.valid_to), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border">
                      {coupon.status === 'active' && (
                        <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => toast.success('Coupon paused by admin')} title="Pause coupon">
                          <Pause className="h-3 w-3" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-amber-500 hover:text-amber-600" onClick={() => toast.warning('Coupon flagged for review')} title="Flag for review">
                        <Flag className="h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Ticket className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No coupons for this shop yet</p>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'offers' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{shopOffers.length} offers found</p>
            <p className="text-xs text-muted-foreground italic">Managed via merchant dashboard</p>
          </div>
          {shopOffers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {shopOffers.map((offer) => (
                <Card key={offer.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-semibold font-poppins">{offer.title}</p>
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full font-medium',
                      offer.status === 'active' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
                      offer.status === 'scheduled' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                      offer.status === 'expired' && 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
                      offer.status === 'paused' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                    )}>
                      {offer.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{offer.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span>{offer.impressions.toLocaleString()} impressions</span>
                      <span>{offer.redemptions.toLocaleString()} redeemed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {offer.status === 'active' && (
                        <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => toast.success('Offer paused by admin')} title="Pause offer">
                          <Pause className="h-3 w-3" />
                        </Button>
                      )}
                      {offer.status === 'paused' && (
                        <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => toast.success('Offer resumed')} title="Resume offer">
                          <Play className="h-3 w-3" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-amber-500 hover:text-amber-600" onClick={() => toast.warning('Offer flagged for review')} title="Flag for review">
                        <Flag className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Tag className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No offers for this shop yet</p>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'visitors' && (
        <div className="space-y-6">
          <SectionCard title="Visitors Per Day" subtitle="Last 30 days">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={visitorData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={4} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="visitors" fill="#BE052E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm"><Upload className="h-4 w-4 mr-1" />Upload Document</Button>
          </div>
          <Card>
            <div className="divide-y divide-border">
              {mockDocuments.map((doc, i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-3">
                  <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.type} — {doc.size} — {format(new Date(doc.date), 'MMM dd, yyyy')}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Edit Contract Modal */}
      <Dialog open={showEditContract} onOpenChange={setShowEditContract}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Contract</DialogTitle>
            <DialogDescription>
              Update contract terms for {shop.name}. Changes will take effect immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="monthly_fee">Monthly Fee (USD)</Label>
              <Input
                id="monthly_fee"
                type="number"
                value={editForm.monthly_fee}
                onChange={(e) => setEditForm({ ...editForm, monthly_fee: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="revenue_share">Revenue Share (%)</Label>
              <Input
                id="revenue_share"
                type="number"
                min={0}
                max={100}
                value={editForm.revenue_share_percent}
                onChange={(e) => setEditForm({ ...editForm, revenue_share_percent: Number(e.target.value) })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto_renew">Auto-Renew</Label>
              <Switch
                id="auto_renew"
                checked={editForm.auto_renew}
                onCheckedChange={(checked) => setEditForm({ ...editForm, auto_renew: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditContract(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                updateShop(shop.id, {
                  contract: {
                    ...shop.contract,
                    monthly_fee: editForm.monthly_fee,
                    revenue_share_percent: editForm.revenue_share_percent,
                    auto_renew: editForm.auto_renew,
                  },
                });
                toast.success('Contract updated successfully');
                setShowEditContract(false);
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Renew Contract Modal */}
      <Dialog open={showRenewContract} onOpenChange={setShowRenewContract}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Renew Contract</DialogTitle>
            <DialogDescription>
              Initiate contract renewal for {shop.name}. Current contract ends on {format(new Date(shop.contract.end_date), 'MMM dd, yyyy')}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-muted rounded-lg text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground">Current Monthly Fee:</span>
                <span className="font-medium">${shop.contract.monthly_fee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Revenue Share:</span>
                <span className="font-medium">{shop.contract.revenue_share_percent}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Renewal Duration</Label>
              <select
                id="duration"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={renewForm.duration_months}
                onChange={(e) => setRenewForm({ ...renewForm, duration_months: Number(e.target.value) })}
              >
                <option value={6}>6 Months</option>
                <option value={12}>12 Months</option>
                <option value={24}>24 Months</option>
                <option value={36}>36 Months</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new_monthly_fee">New Monthly Fee (USD)</Label>
              <Input
                id="new_monthly_fee"
                type="number"
                value={renewForm.new_monthly_fee}
                onChange={(e) => setRenewForm({ ...renewForm, new_monthly_fee: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new_revenue_share">New Revenue Share (%)</Label>
              <Input
                id="new_revenue_share"
                type="number"
                min={0}
                max={100}
                value={renewForm.new_revenue_share}
                onChange={(e) => setRenewForm({ ...renewForm, new_revenue_share: Number(e.target.value) })}
              />
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg text-sm">
              <p className="font-medium text-emerald-700 dark:text-emerald-400">New Contract Period</p>
              <p className="text-emerald-600 dark:text-emerald-500">
                {format(new Date(shop.contract.end_date), 'MMM dd, yyyy')} → {format(new Date(new Date(shop.contract.end_date).getTime() + renewForm.duration_months * 30 * 24 * 60 * 60 * 1000), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenewContract(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const currentEnd = new Date(shop.contract.end_date);
                const newEnd = new Date(currentEnd.getTime() + renewForm.duration_months * 30 * 24 * 60 * 60 * 1000);
                updateShop(shop.id, {
                  contract: {
                    ...shop.contract,
                    end_date: newEnd.toISOString(),
                    monthly_fee: renewForm.new_monthly_fee,
                    revenue_share_percent: renewForm.new_revenue_share,
                    status: 'active',
                  },
                });
                toast.success(`Contract renewed for ${renewForm.duration_months} months`);
                setShowRenewContract(false);
              }}
            >
              Confirm Renewal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
