// ──────────────────────────────────────
// Shop Mock Data — 64 shops
// ──────────────────────────────────────

import type { Shop, ShopCategory, Contract } from '@/types/shop.types';

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const shopNames: { name: string; company: string; category: ShopCategory }[] = [
  { name: 'Starbucks Terminal A', company: 'Starbucks Corporation', category: 'cafe' },
  { name: 'Hudson News', company: 'Hudson Group', category: 'retail' },
  { name: "McDonald's Airside", company: "McDonald's UAE", category: 'restaurant' },
  { name: 'Duty Free Electronics', company: 'Al Futtaim Electronics', category: 'electronics' },
  { name: 'Zara Travel Collection', company: 'Inditex Group', category: 'fashion' },
  { name: 'Sky Lounge Premium', company: 'Plaza Premium Group', category: 'lounge' },
  { name: 'Pharma Plus', company: 'Pharma Plus LLC', category: 'pharmacy' },
  { name: 'HSBC Currency Exchange', company: 'HSBC Holdings', category: 'bank' },
  { name: 'Costa Coffee', company: 'Costa Limited', category: 'cafe' },
  { name: 'Samsung Experience Store', company: 'Samsung Electronics', category: 'electronics' },
  { name: 'WHSmith', company: 'WHSmith PLC', category: 'retail' },
  { name: 'Burger King Departures', company: 'Burger King Corp', category: 'restaurant' },
  { name: 'Ray-Ban Store', company: 'EssilorLuxottica', category: 'fashion' },
  { name: 'Travelex', company: 'Travelex Group', category: 'bank' },
  { name: 'Relay Bookshop', company: 'Lagardère Travel Retail', category: 'retail' },
  { name: 'Pret A Manger', company: 'Pret A Manger Ltd', category: 'cafe' },
  { name: 'The Body Shop', company: 'The Body Shop International', category: 'retail' },
  { name: 'Paul Bakery', company: 'Paul International', category: 'restaurant' },
  { name: 'Victoria\'s Secret', company: 'L Brands Inc', category: 'fashion' },
  { name: 'Guerlain Boutique', company: 'LVMH Group', category: 'retail' },
  { name: 'First Class Lounge', company: 'Airport VIP Services', category: 'lounge' },
  { name: 'Al Jazeera Pharmacy', company: 'Al Jazeera Group', category: 'pharmacy' },
  { name: 'Krispy Kreme', company: 'Krispy Kreme Inc', category: 'cafe' },
  { name: 'Montblanc', company: 'Richemont', category: 'fashion' },
  { name: 'Hertz Rent-a-Car', company: 'Hertz Corporation', category: 'services' },
  { name: 'Lacoste', company: 'Lacoste SA', category: 'fashion' },
  { name: 'Subway Fresh', company: 'Subway Franchises', category: 'restaurant' },
  { name: 'iStore Apple Reseller', company: 'iStore LLC', category: 'electronics' },
  { name: 'Swarovski Crystal', company: 'Swarovski AG', category: 'retail' },
  { name: 'Tim Hortons', company: 'Restaurant Brands International', category: 'cafe' },
  { name: 'SIM Card Kiosk', company: 'Etisalat', category: 'services' },
  { name: 'Harrods Outlet', company: 'Harrods Limited', category: 'retail' },
  { name: 'Shake Shack', company: 'Shake Shack Inc', category: 'restaurant' },
  { name: 'Rolex Boutique', company: 'Rolex SA', category: 'fashion' },
  { name: 'Emirates Business Lounge', company: 'Emirates Group', category: 'lounge' },
  { name: 'Boots Pharmacy', company: 'Walgreens Boots Alliance', category: 'pharmacy' },
  { name: 'JoMalone London', company: 'Estée Lauder Companies', category: 'retail' },
  { name: 'Five Guys', company: 'Five Guys Holdings', category: 'restaurant' },
  { name: 'Tag Heuer', company: 'LVMH Group', category: 'fashion' },
  { name: 'Western Union', company: 'Western Union Co', category: 'bank' },
  { name: 'Avis Car Rental', company: 'Avis Budget Group', category: 'services' },
  { name: 'Godiva Chocolatier', company: 'Godiva Chocolatier Inc', category: 'cafe' },
  { name: 'Ted Baker', company: 'Ted Baker PLC', category: 'fashion' },
  { name: 'Bose Sound Store', company: 'Bose Corporation', category: 'electronics' },
  { name: "Lulu's Hypermarket", company: 'LuLu Group International', category: 'retail' },
  { name: 'KFC Express', company: 'Yum! Brands', category: 'restaurant' },
  { name: 'Nespresso Boutique', company: 'Nestlé Nespresso', category: 'cafe' },
  { name: 'Coach Store', company: 'Tapestry Inc', category: 'fashion' },
  { name: 'Abu Dhabi Duty Free', company: 'Abu Dhabi Airports', category: 'retail' },
  { name: 'GNC Vitamins', company: 'GNC Holdings', category: 'pharmacy' },
  { name: 'Etihad Premium Lounge', company: 'Etihad Aviation Group', category: 'lounge' },
  { name: 'Tech Zone', company: 'Sharaf DG', category: 'electronics' },
  { name: 'Baskin Robbins', company: 'Inspire Brands', category: 'cafe' },
  { name: 'Money Exchange Plus', company: 'UAE Exchange', category: 'bank' },
  { name: 'Gap Travel', company: 'Gap Inc', category: 'fashion' },
  { name: 'Freshly Made Juices', company: 'Freshness LLC', category: 'restaurant' },
  { name: 'Luggage Point', company: 'Samsonite International', category: 'services' },
  { name: 'Pandora Jewelry', company: 'Pandora A/S', category: 'fashion' },
  { name: 'Airport Medical Center', company: 'NMC Healthcare', category: 'services' },
  { name: 'Dunkin Donuts', company: 'Inspire Brands', category: 'cafe' },
  { name: 'H&M Express', company: 'H&M Group', category: 'fashion' },
  { name: 'Bureau de Change', company: 'Al Ansari Exchange', category: 'bank' },
  { name: 'Sony Store', company: 'Sony Group Corp', category: 'electronics' },
  { name: 'Wendy\'s Airport', company: "Wendy's International", category: 'restaurant' },
];

const zoneNames = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E', 'Zone F'];
const contactNames = ['Ahmed Al-Mansoori', 'Sarah Johnson', 'Liu Wei', 'Priya Sharma', 'James O\'Connor', 'Fatima Hassan', 'Carlos Rodriguez', 'Anna Müller'];

const descriptions = [
  'Premium airport retail experience offering a curated selection of products for travelers.',
  'Conveniently located near the departure gates, serving international travelers 24/7.',
  'Award-winning service and quality products in a modern airport setting.',
  'A one-stop destination for all your travel needs with competitive duty-free prices.',
  'Elegant boutique offering exclusive products and personalized customer service.',
  'Fast-service outlet designed for busy travelers on the go.',
  'Luxury brand experience in the heart of the terminal.',
  'Family-friendly establishment with a wide range of options for all ages.',
];

function generateContract(index: number): Contract {
  const r = (offset: number) => pseudoRandom(index * 31 + offset);

  const startDaysAgo = Math.floor(r(1) * 600) + 30;
  const durationDays = Math.floor(r(2) * 730) + 365;
  const startDate = new Date(Date.now() - startDaysAgo * 86400000);
  const endDate = new Date(startDate.getTime() + durationDays * 86400000);
  const now = Date.now();

  const daysToEnd = Math.floor((endDate.getTime() - now) / 86400000);

  let status: Contract['status'];
  if (index < 5 && daysToEnd > 30) {
    // Force 5 expiring contracts
    const forcedEndDate = new Date(now + (Math.floor(r(10) * 25) + 3) * 86400000);
    const forcedStart = new Date(forcedEndDate.getTime() - 365 * 86400000);
    return {
      id: `CTR-${String(index + 1).padStart(4, '0')}`,
      start_date: forcedStart.toISOString(),
      end_date: forcedEndDate.toISOString(),
      monthly_fee: Math.floor(r(3) * 15000) + 5000,
      revenue_share_percent: Math.floor(r(4) * 15) + 5,
      status: 'expiring_soon',
      auto_renew: r(5) > 0.5,
      terms_file_url: r(6) > 0.3 ? `/files/contract-${index + 1}.pdf` : null,
      signed_at: forcedStart.toISOString(),
    };
  }

  if (daysToEnd < 0) status = 'expired';
  else if (daysToEnd < 30) status = 'expiring_soon';
  else if (r(7) < 0.05) status = 'pending_renewal';
  else status = 'active';

  return {
    id: `CTR-${String(index + 1).padStart(4, '0')}`,
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString(),
    monthly_fee: Math.floor(r(3) * 15000) + 5000,
    revenue_share_percent: Math.floor(r(4) * 15) + 5,
    status,
    auto_renew: r(5) > 0.5,
    terms_file_url: r(6) > 0.3 ? `/files/contract-${index + 1}.pdf` : null,
    signed_at: startDate.toISOString(),
  };
}

function generateShop(index: number): Shop {
  const r = (offset: number) => pseudoRandom(index * 17 + offset);
  const base = shopNames[index % shopNames.length];

  // Force 3 shops to be pending
  let status: Shop['status'];
  if (index >= 61) {
    status = 'pending';
  } else if (r(20) < 0.05) {
    status = 'inactive';
  } else {
    status = 'active';
  }

  return {
    id: `SHOP-${String(index + 1).padStart(3, '0')}`,
    name: base.name,
    company_name: base.company,
    category: base.category,
    logo_url: r(1) > 0.3 ? `https://ui-avatars.com/api/?name=${encodeURIComponent(base.name)}&background=BE052E&color=fff&size=64` : null,
    location: {
      zone: zoneNames[Math.floor(r(2) * zoneNames.length)],
      unit_number: `${String.fromCharCode(65 + Math.floor(r(3) * 6))}${Math.floor(r(4) * 50) + 1}`,
      floor: Math.floor(r(5) * 2) + 1,
      coordinates: { x: Math.round(r(6) * 1000) + 100, y: Math.round(r(7) * 600) + 100 },
    },
    contact: {
      name: contactNames[Math.floor(r(8) * contactNames.length)],
      email: `contact@${base.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`.slice(0, 60),
      phone: `+971 ${Math.floor(r(9) * 9) + 1}${Math.floor(r(10) * 9000000 + 1000000)}`,
    },
    contract: generateContract(index),
    status,
    registered_at: new Date(Date.now() - Math.floor(r(11) * 730 + 30) * 86400000).toISOString(),
    offers_count: Math.floor(r(12) * 8),
    total_visitors: Math.floor(r(13) * 50000) + 1000,
    rating: Math.round((r(14) * 2 + 3) * 10) / 10,
    description: descriptions[Math.floor(r(15) * descriptions.length)],
  };
}

// Generated shops
const generatedShops: Shop[] = Array.from({ length: 64 }, (_, i) => generateShop(i));

// Special shop that matches the merchant dashboard (sky-lounge-premier)
const skyLoungePremierShop: Shop = {
  id: 'sky-lounge-premier',
  name: 'Sky Lounge Premier',
  company_name: 'Plaza Premium Group',
  category: 'lounge',
  logo_url: 'https://ui-avatars.com/api/?name=Sky+Lounge+Premier&background=BE052E&color=fff&size=64',
  location: {
    zone: 'Zone A',
    unit_number: 'A12',
    floor: 2,
    coordinates: { x: 450, y: 280 },
  },
  contact: {
    name: 'Sarah Al-Mahmoud',
    email: 'manager@skyloungepr.com',
    phone: '+971 4 555 1234',
  },
  contract: {
    id: 'CTR-SKY-001',
    start_date: '2025-06-01T00:00:00Z',
    end_date: '2027-05-31T23:59:59Z',
    monthly_fee: 18000,
    revenue_share_percent: 12,
    status: 'active',
    auto_renew: true,
    terms_file_url: '/files/contract-sky-lounge.pdf',
    signed_at: '2025-05-15T10:00:00Z',
  },
  status: 'active',
  registered_at: '2025-05-01T00:00:00Z',
  offers_count: 5,
  total_visitors: 45230,
  rating: 4.7,
  description: 'Premium airport lounge offering world-class amenities, fine dining, and exclusive services for discerning travelers.',
};

export const shopsData: Shop[] = [skyLoungePremierShop, ...generatedShops];
