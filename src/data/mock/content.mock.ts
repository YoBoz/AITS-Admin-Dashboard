// ──────────────────────────────────────
// Content / CMS Mock Data — Phase 9
// ──────────────────────────────────────

import type { Banner, RecommendedTile, CopyEntry } from '@/types/content.types';

function ts(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

// ── Banners (6) ──────────────────────

export const bannersData: Banner[] = [
  {
    id: 'banner-001',
    name: 'Ramadan Welcome',
    status: 'active',
    placement: 'home_hero',
    content: {
      en: { title: 'Ramadan Kareem', body: 'Enjoy exclusive offers this holy month across all terminal shops.', cta_text: 'View Offers', cta_link: '/offers' },
      ar: { title: 'رمضان كريم', body: 'استمتع بعروض حصرية في جميع متاجر المطار خلال الشهر الفضيل.', cta_text: 'عرض العروض', cta_link: '/offers' },
      fr: { title: 'Ramadan Kareem', body: 'Profitez des offres exclusives ce mois sacré dans toutes les boutiques.', cta_text: 'Voir les offres', cta_link: '/offers' },
    },
    image_url: null,
    target_zones: ['Zone A', 'Zone B', 'Zone C'],
    target_gates: ['A1', 'A2', 'B1', 'B2', 'C1'],
    start_date: ts(5),
    end_date: ts(-25),
    priority: 10,
    created_at: ts(10),
    created_by: 'Amira Khoury',
  },
  {
    id: 'banner-002',
    name: 'Duty Free Flash Sale',
    status: 'active',
    placement: 'gate_notification',
    content: {
      en: { title: 'Flash Sale — 30% Off', body: 'Limited time offer at Duty Free shops near your gate.', cta_text: 'Shop Now', cta_link: '/shops/duty-free' },
      ar: { title: 'تخفيضات فورية — خصم 30%', body: 'عرض محدود في متاجر السوق الحرة بالقرب من بوابتك.', cta_text: 'تسوق الآن', cta_link: '/shops/duty-free' },
      fr: { title: 'Vente Flash — 30% de réduction', body: 'Offre limitée dans les boutiques Duty Free près de votre porte.', cta_text: 'Acheter', cta_link: '/shops/duty-free' },
    },
    image_url: null,
    target_zones: ['Zone A'],
    target_gates: ['A1', 'A3', 'A5'],
    start_date: ts(2),
    end_date: ts(-5),
    priority: 8,
    created_at: ts(7),
    created_by: 'Omar Farouk',
  },
  {
    id: 'banner-003',
    name: 'Summer Travel Tips',
    status: 'scheduled',
    placement: 'category_header',
    content: {
      en: { title: 'Summer Travel Essentials', body: 'Don\'t forget your travel must-haves. Check out our curated picks.', cta_text: 'Browse', cta_link: '/shops?category=travel' },
      ar: { title: 'أساسيات السفر الصيفي', body: 'لا تنسى مستلزمات السفر الخاصة بك.', cta_text: 'تصفح', cta_link: '/shops?category=travel' },
      fr: { title: '', body: '', cta_text: '', cta_link: '' },
    },
    image_url: null,
    target_zones: ['Zone B', 'Zone C'],
    target_gates: ['B1', 'B2', 'C1', 'C2'],
    start_date: ts(-10),
    end_date: ts(-40),
    priority: 6,
    created_at: ts(3),
    created_by: 'Lina Abbas',
  },
  {
    id: 'banner-004',
    name: 'Welcome First-Time Visitors',
    status: 'draft',
    placement: 'interstitial',
    content: {
      en: { title: 'Welcome to DXB Terminal', body: 'First time? Let us guide you through your journey.', cta_text: 'Get Started', cta_link: '/onboarding' },
      ar: { title: '', body: '', cta_text: '', cta_link: '' },
      fr: { title: '', body: '', cta_text: '', cta_link: '' },
    },
    image_url: null,
    target_zones: ['Zone A', 'Zone B', 'Zone C'],
    target_gates: [],
    start_date: null,
    end_date: null,
    priority: 5,
    created_at: ts(1),
    created_by: 'Amira Khoury',
  },
  {
    id: 'banner-005',
    name: 'Eid Collection 2025',
    status: 'inactive',
    placement: 'home_hero',
    content: {
      en: { title: 'Eid Mubarak Collection', body: 'Celebrate with our exclusive Eid gifting range.', cta_text: 'Explore', cta_link: '/offers/eid' },
      ar: { title: 'مجموعة عيد مبارك', body: 'احتفل مع مجموعتنا الحصرية لهدايا العيد.', cta_text: 'اكتشف', cta_link: '/offers/eid' },
      fr: { title: 'Collection Eid Mubarak', body: 'Célébrez avec notre gamme exclusive de cadeaux Eid.', cta_text: 'Explorer', cta_link: '/offers/eid' },
    },
    image_url: null,
    target_zones: ['Zone A', 'Zone B'],
    target_gates: ['A1', 'A2', 'B1'],
    start_date: ts(90),
    end_date: ts(60),
    priority: 10,
    created_at: ts(100),
    created_by: 'Omar Farouk',
  },
  {
    id: 'banner-006',
    name: 'Lounge Access Promo',
    status: 'inactive',
    placement: 'gate_notification',
    content: {
      en: { title: 'Lounge Access from AED 99', body: 'Relax before your flight. Premium lounge access at special rates.', cta_text: 'Book Now', cta_link: '/shops/lounge' },
      ar: { title: 'دخول الصالة من 99 درهم', body: 'استرخِ قبل رحلتك.', cta_text: 'احجز الآن', cta_link: '/shops/lounge' },
      fr: { title: '', body: '', cta_text: '', cta_link: '' },
    },
    image_url: null,
    target_zones: ['Zone C'],
    target_gates: ['C1', 'C2', 'C3'],
    start_date: ts(45),
    end_date: ts(30),
    priority: 7,
    created_at: ts(50),
    created_by: 'Lina Abbas',
  },
];

// ── Recommended Tiles (8) ────────────

export const recommendedTilesData: RecommendedTile[] = [
  {
    id: 'tile-001', type: 'shop', entity_id: 'shop-001',
    title: { en: 'Duty Free Gold', ar: 'ديوتي فري جولد', fr: 'Duty Free Gold' },
    subtitle: { en: 'Perfumes & Watches', ar: 'عطور وساعات', fr: 'Parfums & Montres' },
    image_url: null, position: 1, placement: 'home_grid', target_gates: ['A1', 'A2'], is_active: true,
  },
  {
    id: 'tile-002', type: 'offer', entity_id: 'offer-001',
    title: { en: '30% Off Electronics', ar: 'خصم 30% إلكترونيات', fr: '30% Électronique' },
    subtitle: { en: 'Limited time', ar: 'لفترة محدودة', fr: 'Temps limité' },
    image_url: null, position: 2, placement: 'home_grid', target_gates: ['A1', 'B1'], is_active: true,
  },
  {
    id: 'tile-003', type: 'category', entity_id: null,
    title: { en: 'Food & Dining', ar: 'مطاعم', fr: 'Restauration' },
    subtitle: { en: 'Explore restaurants', ar: 'اكتشف المطاعم', fr: 'Explorer les restaurants' },
    image_url: null, position: 3, placement: 'home_grid', target_gates: [], is_active: true,
  },
  {
    id: 'tile-004', type: 'navigation', entity_id: null,
    title: { en: 'Find My Gate', ar: 'ابحث عن بوابتي', fr: 'Trouver ma porte' },
    subtitle: { en: 'Terminal navigation', ar: 'التنقل في المطار', fr: 'Navigation terminal' },
    image_url: null, position: 4, placement: 'home_grid', target_gates: [], is_active: true,
  },
  {
    id: 'tile-005', type: 'shop', entity_id: 'shop-003',
    title: { en: 'Costa Coffee', ar: 'كوستا كوفي', fr: 'Costa Coffee' },
    subtitle: { en: 'Fresh brews', ar: 'مشروبات طازجة', fr: 'Cafés frais' },
    image_url: null, position: 5, placement: 'home_grid', target_gates: ['B1', 'B2'], is_active: true,
  },
  {
    id: 'tile-006', type: 'offer', entity_id: 'offer-005',
    title: { en: 'BOGO Chocolates', ar: 'اشترِ واحداً واحصل على الثاني', fr: 'BOGO Chocolats' },
    subtitle: { en: 'Buy one, get one', ar: 'اشتر واحد واحصل على آخر', fr: '' },
    image_url: null, position: 1, placement: 'sidebar_widget', target_gates: ['A1'], is_active: true,
  },
  {
    id: 'tile-007', type: 'shop', entity_id: 'shop-007',
    title: { en: 'Newsstand', ar: 'كشك الصحف', fr: 'Kiosque' },
    subtitle: { en: 'Magazines & books', ar: 'مجلات وكتب', fr: '' },
    image_url: null, position: 2, placement: 'sidebar_widget', target_gates: [], is_active: false,
  },
  {
    id: 'tile-008', type: 'category', entity_id: null,
    title: { en: 'Luxury Brands', ar: 'ماركات فاخرة', fr: 'Marques de luxe' },
    subtitle: { en: 'Premium shopping', ar: 'تسوق فاخر', fr: 'Shopping premium' },
    image_url: null, position: 3, placement: 'sidebar_widget', target_gates: ['C1'], is_active: true,
  },
];

// ── Copy Entries (25) ────────────────

const categories = ['Onboarding', 'Navigation', 'Orders', 'Offers', 'Help'];
const copyKeys: { key: string; cat: string; en: string; ar: string; fr: string }[] = [
  // Onboarding (5)
  { key: 'onboarding.welcome_title', cat: 'Onboarding', en: 'Welcome to Ai-TS', ar: 'مرحباً بكم في Ai-TS', fr: 'Bienvenue sur Ai-TS' },
  { key: 'onboarding.welcome_body', cat: 'Onboarding', en: 'Your smart trolley assistant for a seamless airport experience.', ar: 'مساعدك الذكي لتجربة سفر سلسة.', fr: 'Votre assistant chariot intelligent pour une expérience aéroportuaire fluide.' },
  { key: 'onboarding.scan_prompt', cat: 'Onboarding', en: 'Scan your boarding pass to get started', ar: 'امسح بطاقة الصعود للبدء', fr: 'Scannez votre carte d\'embarquement' },
  { key: 'onboarding.consent_title', cat: 'Onboarding', en: 'Privacy & Consent', ar: 'الخصوصية والموافقة', fr: 'Confidentialité et Consentement' },
  { key: 'onboarding.consent_body', cat: 'Onboarding', en: 'We collect usage data to improve your experience. You can manage your preferences anytime.', ar: 'نجمع بيانات الاستخدام لتحسين تجربتك.', fr: '' },
  // Navigation (5)
  { key: 'nav.find_gate', cat: 'Navigation', en: 'Find My Gate', ar: 'ابحث عن بوابتي', fr: 'Trouver ma porte' },
  { key: 'nav.nearby_shops', cat: 'Navigation', en: 'Nearby Shops', ar: 'المتاجر القريبة', fr: 'Boutiques à proximité' },
  { key: 'nav.terminal_map', cat: 'Navigation', en: 'Terminal Map', ar: 'خريطة المطار', fr: 'Plan du terminal' },
  { key: 'nav.estimated_walk', cat: 'Navigation', en: 'Estimated walking time', ar: 'الوقت المقدر للمشي', fr: 'Temps de marche estimé' },
  { key: 'nav.you_are_here', cat: 'Navigation', en: 'You are here', ar: 'أنت هنا', fr: 'Vous êtes ici' },
  // Orders (5)
  { key: 'orders.cart_title', cat: 'Orders', en: 'Your Cart', ar: 'سلة التسوق', fr: 'Votre panier' },
  { key: 'orders.checkout', cat: 'Orders', en: 'Proceed to Checkout', ar: 'المتابعة للدفع', fr: 'Passer à la caisse' },
  { key: 'orders.order_placed', cat: 'Orders', en: 'Order Placed Successfully', ar: 'تم تقديم الطلب بنجاح', fr: 'Commande passée avec succès' },
  { key: 'orders.delivery_eta', cat: 'Orders', en: 'Estimated delivery to your gate', ar: 'التسليم المقدر إلى بوابتك', fr: 'Livraison estimée à votre porte' },
  { key: 'orders.track_order', cat: 'Orders', en: 'Track Your Order', ar: 'تتبع طلبك', fr: '' },
  // Offers (5)
  { key: 'offers.browse_all', cat: 'Offers', en: 'Browse All Offers', ar: 'تصفح جميع العروض', fr: 'Parcourir les offres' },
  { key: 'offers.expires_soon', cat: 'Offers', en: 'Expires Soon', ar: 'ينتهي قريباً', fr: 'Expire bientôt' },
  { key: 'offers.apply_coupon', cat: 'Offers', en: 'Apply Coupon Code', ar: 'تطبيق رمز القسيمة', fr: 'Appliquer le code promo' },
  { key: 'offers.exclusive', cat: 'Offers', en: 'Exclusive for you', ar: 'حصري لك', fr: '' },
  { key: 'offers.terms_apply', cat: 'Offers', en: 'Terms & conditions apply', ar: 'تطبق الشروط والأحكام', fr: '' },
  // Help (5)
  { key: 'help.need_help', cat: 'Help', en: 'Need Help?', ar: 'تحتاج مساعدة؟', fr: 'Besoin d\'aide ?' },
  { key: 'help.call_support', cat: 'Help', en: 'Call Airport Support', ar: 'اتصل بدعم المطار', fr: 'Appeler le support' },
  { key: 'help.faq', cat: 'Help', en: 'Frequently Asked Questions', ar: 'الأسئلة الشائعة', fr: 'Foire aux questions' },
  { key: 'help.report_issue', cat: 'Help', en: 'Report an Issue', ar: 'الإبلاغ عن مشكلة', fr: 'Signaler un problème' },
  { key: 'help.feedback', cat: 'Help', en: 'Give Feedback', ar: 'أرسل ملاحظاتك', fr: '' },
];

export const copyEntriesData: CopyEntry[] = copyKeys.map((entry, i) => ({
  key: entry.key,
  category: entry.cat,
  translations: {
    en: entry.en,
    ...(entry.ar ? { ar: entry.ar } : {}),
    ...(entry.fr ? { fr: entry.fr } : {}),
  },
  last_updated: ts(Math.floor(Math.random() * 30)),
  updated_by: ['Amira Khoury', 'Omar Farouk', 'Lina Abbas'][i % 3],
  is_published: Math.random() > 0.3,
  notes: i % 5 === 0 ? 'Reviewed by marketing team' : null,
}));

export { categories as copyCategories };
