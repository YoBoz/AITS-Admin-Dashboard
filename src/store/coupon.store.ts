import { create } from 'zustand';
import type { Coupon } from '@/types/coupon.types';

// ─── Mock coupons ─────────────────────────────────────────────────────
const mockCoupons: Coupon[] = [
  {
    id: 'cpn-1',
    code: 'WELCOME10',
    description: '10% off first order',
    type: 'percentage',
    value: 10,
    min_order_value: 20,
    max_uses: 500,
    used_count: 123,
    valid_from: '2026-01-01T00:00:00Z',
    valid_to: '2026-12-31T23:59:59Z',
    status: 'active',
    shop_id: 'sky-lounge-premier',
    stacking_allowed: false,
    campaign_id: null,
  },
  {
    id: 'cpn-2',
    code: 'LOUNGE20',
    description: '20 AED off orders over 100 AED',
    type: 'fixed',
    value: 20,
    min_order_value: 100,
    max_uses: 200,
    used_count: 67,
    valid_from: '2026-02-01T00:00:00Z',
    valid_to: '2026-06-30T23:59:59Z',
    status: 'active',
    shop_id: 'sky-lounge-premier',
    stacking_allowed: false,
    campaign_id: 'camp-1',
  },
  {
    id: 'cpn-3',
    code: 'SUMMER50',
    description: '50% off (max 30 AED)',
    type: 'percentage',
    value: 50,
    min_order_value: null,
    max_uses: 100,
    used_count: 100,
    valid_from: '2025-06-01T00:00:00Z',
    valid_to: '2025-09-30T23:59:59Z',
    status: 'expired',
    shop_id: 'sky-lounge-premier',
    stacking_allowed: false,
    campaign_id: null,
  },
  {
    id: 'cpn-4',
    code: 'BOGO2026',
    description: 'Buy one get one free on beverages',
    type: 'bogo',
    value: 0,
    min_order_value: null,
    max_uses: 300,
    used_count: 300,
    valid_from: '2026-01-15T00:00:00Z',
    valid_to: '2026-03-15T23:59:59Z',
    status: 'depleted',
    shop_id: 'sky-lounge-premier',
    stacking_allowed: false,
    campaign_id: 'camp-2',
  },
  {
    id: 'cpn-5',
    code: 'VIPFREE',
    description: 'Free dessert with any main',
    type: 'freebie',
    value: 0,
    min_order_value: 40,
    max_uses: null,
    used_count: 45,
    valid_from: '2026-01-01T00:00:00Z',
    valid_to: '2026-12-31T23:59:59Z',
    status: 'active',
    shop_id: 'sky-lounge-premier',
    stacking_allowed: true,
    campaign_id: null,
  },
];

// ─── Validation result ────────────────────────────────────────────────
export type CouponValidationStatus = 'idle' | 'valid' | 'expired' | 'invalid' | 'depleted';

export interface CouponValidationResult {
  status: CouponValidationStatus;
  coupon: Coupon | null;
  message: string;
  discountPreview: string | null;
}

// ─── Store ────────────────────────────────────────────────────────────
interface CouponState {
  coupons: Coupon[];
  validationResult: CouponValidationResult;
  isValidating: boolean;

  validateCode: (code: string) => Promise<void>;
  resetValidation: () => void;
  redeemCoupon: (couponId: string) => void;
  addCoupon: (data: Omit<Coupon, 'id' | 'used_count' | 'shop_id'>) => void;
  updateCoupon: (id: string, data: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponStatus: (id: string) => void;
}

export const useCouponStore = create<CouponState>((set, get) => ({
  coupons: mockCoupons,
  isValidating: false,
  validationResult: {
    status: 'idle',
    coupon: null,
    message: '',
    discountPreview: null,
  },

  validateCode: async (code: string) => {
    set({ isValidating: true });
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600));

    const upper = code.trim().toUpperCase();
    const coupon = get().coupons.find((c) => c.code === upper);

    if (!coupon) {
      set({
        isValidating: false,
        validationResult: { status: 'invalid', coupon: null, message: 'Coupon code not found.', discountPreview: null },
      });
      return;
    }

    const now = new Date();
    if (new Date(coupon.valid_to) < now) {
      set({
        isValidating: false,
        validationResult: { status: 'expired', coupon, message: `Coupon expired on ${new Date(coupon.valid_to).toLocaleDateString()}.`, discountPreview: null },
      });
      return;
    }

    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      set({
        isValidating: false,
        validationResult: { status: 'depleted', coupon, message: 'Coupon has been fully redeemed.', discountPreview: null },
      });
      return;
    }

    if (coupon.status !== 'active') {
      set({
        isValidating: false,
        validationResult: { status: 'invalid', coupon, message: `Coupon is ${coupon.status}.`, discountPreview: null },
      });
      return;
    }

    // Build discount preview
    let preview: string;
    switch (coupon.type) {
      case 'percentage':
        preview = `${coupon.value}% off${coupon.min_order_value ? ` (min AED ${coupon.min_order_value})` : ''}`;
        break;
      case 'fixed':
        preview = `AED ${coupon.value} off${coupon.min_order_value ? ` (min AED ${coupon.min_order_value})` : ''}`;
        break;
      case 'bogo':
        preview = 'Buy one get one free';
        break;
      case 'freebie':
        preview = coupon.description;
        break;
      default:
        preview = coupon.description;
    }

    set({
      isValidating: false,
      validationResult: {
        status: 'valid',
        coupon,
        message: `Coupon "${coupon.code}" is valid!`,
        discountPreview: preview,
      },
    });
  },

  resetValidation: () =>
    set({
      validationResult: { status: 'idle', coupon: null, message: '', discountPreview: null },
    }),

  redeemCoupon: (couponId) =>
    set((s) => ({
      coupons: s.coupons.map((c) =>
        c.id === couponId ? { ...c, used_count: c.used_count + 1 } : c
      ),
    })),

  addCoupon: (data) =>
    set((s) => {
      const id = `cpn-${Date.now()}`;
      const newCoupon: Coupon = {
        ...data,
        id,
        used_count: 0,
        shop_id: 'sky-lounge-premier',
      };
      return { coupons: [newCoupon, ...s.coupons] };
    }),

  updateCoupon: (id, data) =>
    set((s) => ({
      coupons: s.coupons.map((c) => (c.id === id ? { ...c, ...data } : c)),
    })),

  deleteCoupon: (id) =>
    set((s) => ({ coupons: s.coupons.filter((c) => c.id !== id) })),

  toggleCouponStatus: (id) =>
    set((s) => ({
      coupons: s.coupons.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'active' ? 'paused' : c.status === 'paused' ? 'active' : c.status }
          : c
      ),
    })),
}));
