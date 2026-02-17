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
import { SectionCard } from '@/components/common/SectionCard';
import { ContractStatusBadge } from '@/components/shops/ContractStatusBadge';
import { ShopCategoryBadge } from '@/components/shops/ShopCategoryBadge';
import { ContractTimeline } from '@/components/offers/ContractTimeline';
import { useShopsStore } from '@/store/shops.store';
import { offersData } from '@/data/mock/offers.mock';
import { cn } from '@/lib/utils';

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'contract', label: 'Contract' },
  { id: 'offers', label: 'Offers' },
  { id: 'visitors', label: 'Visitor Stats' },
  { id: 'documents', label: 'Documents' },
];

export default function ShopDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const shops = useShopsStore((s) => s.shops);
  const [activeTab, setActiveTab] = useState('overview');

  const shop = shops.find((s) => s.id === id);

  const shopOffers = useMemo(
    () => offersData.filter((o) => shop && o.shop_id === shop.id),
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
                <Button variant="outline" className="w-full justify-start" onClick={() => toast.info('Edit contract coming soon')}>Edit Contract</Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => toast.info('Renewal initiated')}>Renew Contract</Button>
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

      {activeTab === 'offers' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{shopOffers.length} offers found</p>
            <Button size="sm" onClick={() => navigate('/dashboard/offers')}><Tag className="h-4 w-4 mr-1" />Add Offer</Button>
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
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{offer.impressions.toLocaleString()} impressions</span>
                    <span>{offer.redemptions.toLocaleString()} redeemed</span>
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
    </motion.div>
  );
}
