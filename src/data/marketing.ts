// Marketing data: coupons, promo codes, gift cards, cashback, affiliate, push.

export interface Coupon {
  code: string;
  title: string;
  description: string;
  discountType: "percent" | "flat";
  value: number; // % or BDT
  minOrder?: number;
  maxDiscount?: number;
  expiresAt: string;
  category?: string;
  used?: boolean;
}

export const COUPONS: Coupon[] = [
  {
    code: "WELCOME15",
    title: "Welcome 15% off",
    description: "First-time buyers only. Sitewide.",
    discountType: "percent",
    value: 15,
    minOrder: 1000,
    maxDiscount: 500,
    expiresAt: "2026-07-31",
  },
  {
    code: "EID200",
    title: "৳200 Eid Bonus",
    description: "Flat ৳200 off on orders above ৳2,000.",
    discountType: "flat",
    value: 200,
    minOrder: 2000,
    expiresAt: "2026-06-30",
  },
  {
    code: "SAREE25",
    title: "Saree edit 25% off",
    description: "Applies to Sarees & ethnic wear only.",
    discountType: "percent",
    value: 25,
    minOrder: 1500,
    maxDiscount: 800,
    expiresAt: "2026-07-15",
    category: "Sarees",
  },
];

export interface PromoCode {
  code: string;
  campaign: string;
  perks: string;
  expiresAt: string;
  uses: number;
  limit: number;
}

export const PROMO_CODES: PromoCode[] = [
  { code: "FRIEND100", campaign: "Refer-a-friend", perks: "৳100 off + 50 reward pts", expiresAt: "2026-12-31", uses: 8, limit: 50 },
  { code: "FLASH30", campaign: "Flash Sale", perks: "30% off electronics", expiresAt: "2026-06-22", uses: 124, limit: 500 },
  { code: "FREESHIP", campaign: "Free shipping weekend", perks: "Free delivery anywhere in BD", expiresAt: "2026-06-20", uses: 51, limit: 200 },
];

export interface GiftCard {
  id: string;
  code: string;
  type: "delivery_free" | "delivery_discount" | "store_credit";
  value: number; // BDT — for delivery_discount/store_credit; 0 means "fully free"
  description: string;
  expiresAt: string;
  balance: number;
}

export const GIFT_CARDS: GiftCard[] = [
  {
    id: "gc1",
    code: "DLV-FREE-882X",
    type: "delivery_free",
    value: 0,
    description: "Free delivery — any courier, any zone, up to 3kg.",
    expiresAt: "2026-08-31",
    balance: 1,
  },
  {
    id: "gc2",
    code: "DLV-60-OFF-2391",
    type: "delivery_discount",
    value: 60,
    description: "৳60 off delivery charge.",
    expiresAt: "2026-09-15",
    balance: 2,
  },
  {
    id: "gc3",
    code: "STORE-500-BX",
    type: "store_credit",
    value: 500,
    description: "৳500 store credit — use at checkout.",
    expiresAt: "2026-12-31",
    balance: 500,
  },
];

export interface CashbackTier {
  name: "Silver" | "Gold" | "Platinum";
  rate: number; // %
  minSpend: number; // last 90 days
}

export const CASHBACK_TIERS: CashbackTier[] = [
  { name: "Silver", rate: 1, minSpend: 0 },
  { name: "Gold", rate: 2.5, minSpend: 10000 },
  { name: "Platinum", rate: 5, minSpend: 30000 },
];

export interface CashbackEntry {
  id: string;
  orderId: string;
  amount: number;
  at: string;
  status: "pending" | "credited";
}

export const CASHBACK_HISTORY: CashbackEntry[] = [
  { id: "cb1", orderId: "DS-10248", amount: 122, at: "2026-06-12T09:24:00Z", status: "pending" },
  { id: "cb2", orderId: "DS-10221", amount: 54, at: "2026-06-01T13:42:00Z", status: "credited" },
];

export const CASHBACK_WALLET = 327;

export interface PushPreference {
  key: "orders" | "promos" | "delivery" | "rewards" | "support";
  label: string;
  description: string;
  enabled: boolean;
}

export const PUSH_PREFERENCES: PushPreference[] = [
  { key: "orders", label: "Order updates", description: "Placed, packed, shipped & delivered.", enabled: true },
  { key: "delivery", label: "Delivery alerts", description: "Rider on the way, ETA changes.", enabled: true },
  { key: "promos", label: "Promotions & flash sales", description: "Exclusive coupon drops.", enabled: true },
  { key: "rewards", label: "Reward points", description: "Earned, expiring & tier upgrades.", enabled: false },
  { key: "support", label: "Support replies", description: "Ticket responses from our team.", enabled: true },
];