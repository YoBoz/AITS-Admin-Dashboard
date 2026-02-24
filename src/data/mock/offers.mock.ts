// ──────────────────────────────────────
// Offers Mock Data — 45 offers
// ──────────────────────────────────────

import type { Offer, DiscountType } from '@/types/offer.types';
import { shopsData } from './shops.mock';

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const offerTitles: { title: string; description: string; type: DiscountType }[] = [
  { title: 'Buy 1 Get 1 Free Croissant', description: 'Enjoy a complimentary croissant with every purchase.', type: 'bogo' },
  { title: '15% Off All Electronics', description: 'Save on the latest gadgets and accessories.', type: 'percentage' },
  { title: 'Free WiFi Upgrade with Purchase', description: 'Get complimentary premium WiFi access.', type: 'freebie' },
  { title: '20% Off Designer Sunglasses', description: 'Exclusive airport discount on premium eyewear.', type: 'percentage' },
  { title: '$10 Off Orders Over $50', description: 'Flat discount on qualifying purchases.', type: 'fixed' },
  { title: 'BOGO Coffee Special', description: 'Buy any large coffee, get one free.', type: 'bogo' },
  { title: '30% Off Travel Accessories', description: 'Luggage, adapters, and more at great prices.', type: 'percentage' },
  { title: 'Free Gift Wrapping', description: 'Complimentary gift wrapping on all purchases.', type: 'freebie' },
  { title: '25% Off Perfumes & Cosmetics', description: 'Duty-free savings on premium brands.', type: 'percentage' },
  { title: 'Kids Eat Free', description: 'Free kids meal with every adult entree.', type: 'freebie' },
  { title: '$5 Off Any Smoothie', description: 'Fresh fruit smoothies at a discount.', type: 'fixed' },
  { title: '40% Off Selected Books', description: 'Clearance sale on bestsellers and travel reads.', type: 'percentage' },
  { title: 'Buy 2 Get 1 Free Chocolates', description: 'Premium chocolate gift boxes on offer.', type: 'bogo' },
  { title: 'Free Neck Pillow with $100 Purchase', description: 'Travel comfort as our gift to you.', type: 'freebie' },
  { title: '10% Off Currency Exchange', description: 'Better rates for Ai-TS app users.', type: 'percentage' },
  { title: '$15 Off Spa Treatment', description: 'Relax before your flight at a discount.', type: 'fixed' },
  { title: 'Happy Hour: 50% Off Drinks', description: '3PM-6PM daily, all beverages half price.', type: 'percentage' },
  { title: 'Free Phone Charging with Meal', description: 'Charge your device while you dine.', type: 'freebie' },
  { title: '35% Off Winter Collection', description: 'Seasonal clearance on fashion items.', type: 'percentage' },
  { title: 'BOGO Donuts Every Friday', description: 'Double the sweetness every weekend.', type: 'bogo' },
  { title: '$20 Off Premium Headphones', description: 'Noise-cancelling travel headphones on sale.', type: 'fixed' },
  { title: 'Loyalty Double Points Week', description: 'Earn 2x points on all purchases this week.', type: 'freebie' },
  { title: '15% Off Watches & Jewelry', description: 'Luxury timepieces at duty-free prices.', type: 'percentage' },
  { title: 'Free Dessert with Any Meal', description: 'Indulge with a complimentary sweet treat.', type: 'freebie' },
  { title: 'Bundle: Phone Case + Screen Protector', description: 'Save 30% when you buy both together.', type: 'percentage' },
  { title: '$8 Off Breakfast Combo', description: 'Start your journey with a great deal.', type: 'fixed' },
  { title: 'BOGO Skincare Products', description: 'Stock up on your favorites at half the cost.', type: 'bogo' },
  { title: 'Free Engraving Service', description: 'Personalize your jewelry purchase for free.', type: 'freebie' },
  { title: '20% Student Discount', description: 'Valid student ID required at checkout.', type: 'percentage' },
  { title: 'Early Bird: 25% Off Before 9AM', description: 'Morning shoppers get exclusive savings.', type: 'percentage' },
  { title: '$12 Off Meal Deal', description: 'Main + side + drink at a special price.', type: 'fixed' },
  { title: 'Free Tote Bag with $75 Purchase', description: 'Exclusive branded tote as a gift.', type: 'freebie' },
  { title: '45% Off Selected Fragrances', description: 'Limited time clearance on premium scents.', type: 'percentage' },
  { title: 'BOGO Sandwiches at Lunch', description: '12PM-2PM daily, buy one get one free.', type: 'bogo' },
  { title: 'Flash Sale: 60% Off Scarves', description: 'One day only designer scarf clearance.', type: 'percentage' },
  { title: '$25 Off Car Rental Booking', description: 'Exclusive airport counter discount.', type: 'fixed' },
  { title: 'Free Lounge Access Pass', description: 'Complimentary 2-hour lounge pass with purchase.', type: 'freebie' },
  { title: '18% Off All Vitamins', description: 'Health essentials at pharmacy counter.', type: 'percentage' },
  { title: 'BOGO Ice Cream Scoops', description: 'Cool treats on a hot travel day.', type: 'bogo' },
  { title: '$30 Off Premium Luggage', description: 'Upgrade your travel gear before departure.', type: 'fixed' },
  { title: 'Free SIM Card with Activation', description: 'Stay connected with a complimentary starter SIM.', type: 'freebie' },
  { title: '22% Off Smart Watches', description: 'Latest wearable tech at airport-exclusive prices.', type: 'percentage' },
  { title: 'Family Meal Deal $49', description: 'Feed the whole family with our special combo.', type: 'fixed' },
  { title: '10% Off Everything Store-Wide', description: 'No exclusions, no minimum purchase required.', type: 'percentage' },
  { title: 'BOGO Pastries Before 10AM', description: 'Fresh baked goods, double the joy.', type: 'bogo' },
];

const targetCategories = ['business_travelers', 'families', 'frequent_flyers', 'students', 'transit_passengers', 'first_class', 'all_travelers'];

function generateOffer(index: number): Offer {
  const r = (offset: number) => pseudoRandom(index * 23 + offset);
  const base = offerTitles[index % offerTitles.length];
  const shop = shopsData[Math.floor(r(1) * shopsData.length)];

  const statusArr: Offer['status'][] = ['active', 'active', 'active', 'scheduled', 'expired', 'paused'];
  const status = statusArr[Math.floor(r(2) * statusArr.length)];

  const startDaysAgo = status === 'scheduled' ? -(Math.floor(r(3) * 30) + 1) : Math.floor(r(3) * 60) + 1;
  const durationDays = Math.floor(r(4) * 90) + 7;
  const startDate = new Date(Date.now() - startDaysAgo * 86400000);
  const endDate = new Date(startDate.getTime() + durationDays * 86400000);

  const numCategories = Math.floor(r(10) * 3) + 1;
  const cats: string[] = [];
  for (let i = 0; i < numCategories; i++) {
    const cat = targetCategories[Math.floor(r(11 + i) * targetCategories.length)];
    if (!cats.includes(cat)) cats.push(cat);
  }

  return {
    id: `OFR-${String(index + 1).padStart(3, '0')}`,
    shop_id: shop.id,
    shop_name: shop.name,
    title: base.title,
    description: base.description,
    discount_type: base.type,
    discount_value:
      base.type === 'percentage'
        ? Math.floor(r(5) * 40) + 10
        : base.type === 'fixed'
          ? Math.floor(r(5) * 25) + 5
          : 0,
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString(),
    status,
    target_categories: cats,
    impressions: Math.floor(r(6) * 49000) + 1000,
    redemptions: Math.floor(r(7) * 4950) + 50,
    image_url: r(8) > 0.4 ? `https://picsum.photos/seed/offer${index}/400/200` : null,
    created_by: 'admin@aits.ae',
    created_at: new Date(Date.now() - Math.floor(r(9) * 90 + 1) * 86400000).toISOString(),
    priority: Math.floor(r(12) * 10) + 1,
  };
}

// Generated offers
const generatedOffers: Offer[] = Array.from({ length: 45 }, (_, i) => generateOffer(i));

// Specific offers for sky-lounge-premier (consistent with merchant dashboard)
const skyLoungeOffers: Offer[] = [
  {
    id: 'OFR-SKY-001',
    shop_id: 'sky-lounge-premier',
    shop_name: 'Sky Lounge Premier',
    title: 'Complimentary Welcome Drink',
    description: 'Enjoy a free welcome beverage with any lounge entry',
    discount_type: 'freebie',
    discount_value: 0,
    start_date: '2026-01-01T00:00:00Z',
    end_date: '2026-12-31T23:59:59Z',
    status: 'active',
    target_categories: ['business_travelers', 'first_class'],
    impressions: 12500,
    redemptions: 3200,
    image_url: 'https://picsum.photos/seed/skylounge1/400/200',
    created_by: 'manager@skyloungepr.com',
    created_at: '2025-12-15T10:00:00Z',
    priority: 9,
  },
  {
    id: 'OFR-SKY-002',
    shop_id: 'sky-lounge-premier',
    shop_name: 'Sky Lounge Premier',
    title: '20% Off Premium Menu',
    description: 'Save on our exclusive premium dining menu items',
    discount_type: 'percentage',
    discount_value: 20,
    start_date: '2026-02-01T00:00:00Z',
    end_date: '2026-04-30T23:59:59Z',
    status: 'active',
    target_categories: ['first_class', 'frequent_flyers'],
    impressions: 8900,
    redemptions: 1450,
    image_url: 'https://picsum.photos/seed/skylounge2/400/200',
    created_by: 'manager@skyloungepr.com',
    created_at: '2026-01-20T14:00:00Z',
    priority: 8,
  },
  {
    id: 'OFR-SKY-003',
    shop_id: 'sky-lounge-premier',
    shop_name: 'Sky Lounge Premier',
    title: 'Spa Package Deal',
    description: '50 AED off spa treatments with lounge access',
    discount_type: 'fixed',
    discount_value: 50,
    start_date: '2026-02-14T00:00:00Z',
    end_date: '2026-05-31T23:59:59Z',
    status: 'active',
    target_categories: ['business_travelers', 'transit_passengers'],
    impressions: 4200,
    redemptions: 380,
    image_url: 'https://picsum.photos/seed/skylounge3/400/200',
    created_by: 'manager@skyloungepr.com',
    created_at: '2026-02-10T09:00:00Z',
    priority: 7,
  },
  {
    id: 'OFR-SKY-004',
    shop_id: 'sky-lounge-premier',
    shop_name: 'Sky Lounge Premier',
    title: 'Family Lounge Package',
    description: 'Kids under 12 enter free with paying adult',
    discount_type: 'freebie',
    discount_value: 0,
    start_date: '2026-01-15T00:00:00Z',
    end_date: '2026-06-30T23:59:59Z',
    status: 'active',
    target_categories: ['families', 'all_travelers'],
    impressions: 6700,
    redemptions: 890,
    image_url: null,
    created_by: 'manager@skyloungepr.com',
    created_at: '2026-01-10T11:00:00Z',
    priority: 6,
  },
  {
    id: 'OFR-SKY-005',
    shop_id: 'sky-lounge-premier',
    shop_name: 'Sky Lounge Premier',
    title: 'Happy Hour Specials',
    description: 'BOGO on selected cocktails 4-7 PM',
    discount_type: 'bogo',
    discount_value: 0,
    start_date: '2026-03-01T00:00:00Z',
    end_date: '2026-05-31T23:59:59Z',
    status: 'scheduled',
    target_categories: ['business_travelers', 'frequent_flyers'],
    impressions: 0,
    redemptions: 0,
    image_url: 'https://picsum.photos/seed/skylounge5/400/200',
    created_by: 'manager@skyloungepr.com',
    created_at: '2026-02-20T16:00:00Z',
    priority: 5,
  },
];

// Specific offers for SHOP-001 (Starbucks)
const starbucksOffers: Offer[] = [
  {
    id: 'OFR-SBUX-001',
    shop_id: 'SHOP-001',
    shop_name: 'Starbucks Terminal A',
    title: 'Double Stars Week',
    description: 'Earn double reward stars on all purchases',
    discount_type: 'freebie',
    discount_value: 0,
    start_date: '2026-02-01T00:00:00Z',
    end_date: '2026-02-28T23:59:59Z',
    status: 'active',
    target_categories: ['frequent_flyers', 'business_travelers'],
    impressions: 15600,
    redemptions: 4500,
    image_url: 'https://picsum.photos/seed/starbucks1/400/200',
    created_by: 'store.manager@starbucks.ae',
    created_at: '2026-01-25T08:00:00Z',
    priority: 8,
  },
  {
    id: 'OFR-SBUX-002',
    shop_id: 'SHOP-001',
    shop_name: 'Starbucks Terminal A',
    title: 'Morning Brew Deal',
    description: '15% off all hot beverages before 10 AM',
    discount_type: 'percentage',
    discount_value: 15,
    start_date: '2026-01-01T00:00:00Z',
    end_date: '2026-06-30T23:59:59Z',
    status: 'active',
    target_categories: ['all_travelers'],
    impressions: 22400,
    redemptions: 6780,
    image_url: null,
    created_by: 'store.manager@starbucks.ae',
    created_at: '2025-12-20T10:00:00Z',
    priority: 9,
  },
];

// Specific offers for SHOP-003 (McDonald's)
const mcdonaldsOffers: Offer[] = [
  {
    id: 'OFR-MCD-001',
    shop_id: 'SHOP-003',
    shop_name: "McDonald's Airside",
    title: 'McValue Meal Deal',
    description: '10 AED off any Extra Value Meal',
    discount_type: 'fixed',
    discount_value: 10,
    start_date: '2026-02-01T00:00:00Z',
    end_date: '2026-04-30T23:59:59Z',
    status: 'active',
    target_categories: ['families', 'all_travelers'],
    impressions: 18900,
    redemptions: 5670,
    image_url: 'https://picsum.photos/seed/mcdonalds1/400/200',
    created_by: 'manager@mcdonalds.ae',
    created_at: '2026-01-28T12:00:00Z',
    priority: 7,
  },
];

export const offersData: Offer[] = [
  ...skyLoungeOffers,
  ...starbucksOffers,
  ...mcdonaldsOffers,
  ...generatedOffers,
];
