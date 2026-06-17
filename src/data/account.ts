// Mock customer dashboard data (local-only, no backend yet).
import type { CourierId, DeliveryZone } from "./couriers";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatarInitials: string;
  memberSince: string;
  tier: "Silver" | "Gold" | "Platinum";
}

export const PROFILE: UserProfile = {
  name: "Arif Hossain",
  email: "arif.hossain@example.com",
  phone: "+8801711-234567",
  avatarInitials: "AH",
  memberSince: "Mar 2024",
  tier: "Gold",
};

export type OrderStatus =
  | "Placed"
  | "Processing"
  | "Packed"
  | "Shipped"
  | "Out for delivery"
  | "Delivered"
  | "Cancelled"
  | "Returned";

export interface OrderItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  image?: string;
}

export interface TimelineEvent {
  status: OrderStatus | string;
  note?: string;
  at: string; // ISO
  location?: string;
  done: boolean;
}

export interface Order {
  id: string; // DS-XXXX
  placedAt: string;
  status: OrderStatus;
  total: number;
  paymentMethod: "bKash" | "Nagad" | "Rocket" | "Card" | "COD";
  courier: CourierId;
  trackingNumber: string;
  estimatedDelivery: string;
  shipTo: { name: string; line1: string; area: string; city: string; phone: string };
  items: OrderItem[];
  timeline: TimelineEvent[];
  weightKg?: number;
  deliveryCharge?: number;
  deliveryZone?: DeliveryZone;
  deliveryAgent?: { name: string; phone: string; vehicle?: string; rating?: number };
}

export const ORDERS: Order[] = [
  {
    id: "DS-10248",
    placedAt: "2026-06-12T09:24:00Z",
    status: "Out for delivery",
    total: 4870,
    paymentMethod: "bKash",
    courier: "Pathao",
    trackingNumber: "PTH-883421-BD",
    estimatedDelivery: "2026-06-17",
    shipTo: {
      name: "Arif Hossain",
      line1: "House 12, Road 7, Block C",
      area: "Banani",
      city: "Dhaka 1213",
      phone: "+8801711-234567",
    },
    items: [
      { id: "watch-elite-01", name: "Elite Chronograph Watch", qty: 1, price: 3590 },
      { id: "headphones-aero", name: "Aero Wireless Headphones", qty: 1, price: 1280 },
    ],
    timeline: [
      { status: "Placed", at: "2026-06-12T09:24:00Z", done: true },
      { status: "Processing", note: "Seller confirmed", at: "2026-06-12T13:10:00Z", done: true },
      { status: "Packed", at: "2026-06-13T11:00:00Z", done: true },
      {
        status: "Shipped",
        note: "Handed to Pathao",
        at: "2026-06-14T08:45:00Z",
        location: "Dhaka Sorting Hub",
        done: true,
      },
      {
        status: "Out for delivery",
        at: "2026-06-17T08:10:00Z",
        location: "Banani Delivery Branch",
        done: true,
      },
      { status: "Delivered", at: "", done: false },
    ],
  },
  {
    id: "DS-10221",
    placedAt: "2026-05-28T14:02:00Z",
    status: "Delivered",
    total: 2150,
    paymentMethod: "Card",
    courier: "RedX",
    trackingNumber: "RDX-552014-BD",
    estimatedDelivery: "2026-06-01",
    shipTo: {
      name: "Arif Hossain",
      line1: "House 12, Road 7, Block C",
      area: "Banani",
      city: "Dhaka 1213",
      phone: "+8801711-234567",
    },
    items: [{ id: "saree-meadow", name: "Meadow Silk Saree", qty: 1, price: 2150 }],
    timeline: [
      { status: "Placed", at: "2026-05-28T14:02:00Z", done: true },
      { status: "Processing", at: "2026-05-28T18:00:00Z", done: true },
      { status: "Packed", at: "2026-05-29T10:00:00Z", done: true },
      { status: "Shipped", at: "2026-05-30T09:30:00Z", location: "Dhaka Hub", done: true },
      { status: "Out for delivery", at: "2026-06-01T08:00:00Z", done: true },
      { status: "Delivered", at: "2026-06-01T13:42:00Z", location: "Banani", done: true },
    ],
  },
  {
    id: "DS-10199",
    placedAt: "2026-05-10T19:45:00Z",
    status: "Cancelled",
    total: 990,
    paymentMethod: "COD",
    courier: "Steadfast",
    trackingNumber: "STF-110203-BD",
    estimatedDelivery: "2026-05-15",
    shipTo: {
      name: "Arif Hossain",
      line1: "House 12, Road 7, Block C",
      area: "Banani",
      city: "Dhaka 1213",
      phone: "+8801711-234567",
    },
    items: [{ id: "skincare-glow", name: "Glow Skincare Set", qty: 1, price: 990 }],
    timeline: [
      { status: "Placed", at: "2026-05-10T19:45:00Z", done: true },
      { status: "Cancelled", note: "Cancelled by customer", at: "2026-05-11T08:12:00Z", done: true },
    ],
  },
];

// Inject default delivery metadata (weight + zone + charge) for any order
// that didn't set it explicitly. Safe because the fields are optional.
import { calcDeliveryCharge } from "./couriers";
for (const o of ORDERS) {
  o.weightKg ??= 1;
  o.deliveryZone ??= "inside_dhaka";
  o.deliveryCharge ??= calcDeliveryCharge(o.courier, o.deliveryZone, o.weightKg);
}

// Mock delivery agents per courier — used by the order tracking "Contact
// delivery man" action so the user can ring the rider directly.
const AGENTS: Record<string, { name: string; phone: string; vehicle: string; rating: number }> = {
  Pathao: { name: "Rakib Hasan", phone: "+8801711-908112", vehicle: "Bike DM-22-4451", rating: 4.9 },
  RedX: { name: "Sumon Mia", phone: "+8801812-554466", vehicle: "Bike DM-19-7820", rating: 4.7 },
  Steadfast: { name: "Imran Khan", phone: "+8801911-330099", vehicle: "Van DM-21-1102", rating: 4.8 },
  Paperfly: { name: "Jahid Alam", phone: "+8801511-882200", vehicle: "Bike DM-23-9911", rating: 4.6 },
  Sundarban: { name: "Mizanur Rahman", phone: "+8801611-447755", vehicle: "Van DM-20-6633", rating: 4.5 },
  eCourier: { name: "Tariq Aziz", phone: "+8801711-223344", vehicle: "Bike DM-22-1188", rating: 4.7 },
};
for (const o of ORDERS) {
  if (!o.deliveryAgent && (o.status === "Shipped" || o.status === "Out for delivery" || o.status === "Delivered")) {
    o.deliveryAgent = AGENTS[o.courier] ?? AGENTS.Pathao;
  }
}

export interface SavedAddress {
  id: string;
  label: string; // Home / Office
  name: string;
  phone: string;
  line1: string;
  area: string;
  city: string;
  isDefault: boolean;
}

export const ADDRESSES: SavedAddress[] = [
  {
    id: "a1",
    label: "Home",
    name: "Arif Hossain",
    phone: "+8801711-234567",
    line1: "House 12, Road 7, Block C",
    area: "Banani",
    city: "Dhaka 1213",
    isDefault: true,
  },
  {
    id: "a2",
    label: "Office",
    name: "Arif Hossain",
    phone: "+8801711-234567",
    line1: "Level 9, Awal Centre, 34 Kemal Ataturk Ave",
    area: "Banani",
    city: "Dhaka 1213",
    isDefault: false,
  },
];

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  at: string;
  kind: "order" | "promo" | "system" | "payment" | "refund";
  event?: NotificationEvent;
  channels?: NotificationChannel[];
  unread: boolean;
}

export type NotificationEvent =
  | "new_order"
  | "payment_success"
  | "payment_failed"
  | "order_shipped"
  | "order_delivered"
  | "refund_approved"
  | "coupon_available";

export type NotificationChannel = "in_app" | "email" | "sms" | "push";

export const NOTIFICATION_EVENT_LABEL: Record<NotificationEvent, string> = {
  new_order: "New Order",
  payment_success: "Payment Success",
  payment_failed: "Payment Failed",
  order_shipped: "Order Shipped",
  order_delivered: "Order Delivered",
  refund_approved: "Refund Approved",
  coupon_available: "Coupon Available",
};

export const NOTIFICATION_CHANNEL_LABEL: Record<NotificationChannel, string> = {
  in_app: "In-App",
  email: "Email",
  sms: "SMS",
  push: "Push",
};

export interface NotificationTemplate {
  event: NotificationEvent;
  subject: string;
  inApp: string;
  email: string;
  sms: string;
  push: string;
}

export const NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    event: "new_order",
    subject: "Order {{orderId}} placed",
    inApp: "Your order {{orderId}} is confirmed. We'll notify you on shipping.",
    email:
      "Hi {{name}}, thanks for shopping at Dadar Shop! Order {{orderId}} for ৳{{total}} has been received and is being processed.",
    sms: "Dadar Shop: Order {{orderId}} placed (৳{{total}}). Track in the app.",
    push: "Order {{orderId}} placed · ৳{{total}}",
  },
  {
    event: "payment_success",
    subject: "Payment received for {{orderId}}",
    inApp: "Payment of ৳{{total}} via {{method}} confirmed for {{orderId}}.",
    email:
      "Hi {{name}}, we received ৳{{total}} via {{method}} for order {{orderId}}. TrxID {{trxId}}.",
    sms: "Dadar Shop: ৳{{total}} received via {{method}} for {{orderId}}. TrxID {{trxId}}.",
    push: "Payment success · {{orderId}}",
  },
  {
    event: "payment_failed",
    subject: "Payment failed for {{orderId}}",
    inApp: "We couldn't process your {{method}} payment for {{orderId}}. Please retry.",
    email:
      "Hi {{name}}, your {{method}} payment for {{orderId}} failed. You can retry from the order page.",
    sms: "Dadar Shop: Payment failed for {{orderId}}. Tap to retry.",
    push: "Payment failed · {{orderId}}",
  },
  {
    event: "order_shipped",
    subject: "Order {{orderId}} shipped via {{courier}}",
    inApp: "{{courier}} picked up {{orderId}}. Tracking: {{trackingNumber}}.",
    email:
      "Hi {{name}}, {{orderId}} has shipped with {{courier}} (tracking {{trackingNumber}}). ETA {{eta}}.",
    sms: "Dadar Shop: {{orderId}} shipped via {{courier}}. Track {{trackingNumber}}.",
    push: "Shipped · {{orderId}}",
  },
  {
    event: "order_delivered",
    subject: "Order {{orderId}} delivered",
    inApp: "Your order {{orderId}} was delivered. Rate it to earn 20 points.",
    email:
      "Hi {{name}}, {{orderId}} was delivered today. We'd love your review — earn 20 reward points.",
    sms: "Dadar Shop: {{orderId}} delivered. Rate to earn 20 points.",
    push: "Delivered · {{orderId}}",
  },
  {
    event: "refund_approved",
    subject: "Refund approved for {{refundId}}",
    inApp: "Your refund {{refundId}} (৳{{amount}}) was approved via {{method}}.",
    email:
      "Hi {{name}}, refund {{refundId}} of ৳{{amount}} has been approved. You'll receive it on {{method}} by {{eta}}.",
    sms: "Dadar Shop: Refund {{refundId}} approved (৳{{amount}}) via {{method}}.",
    push: "Refund approved · {{refundId}}",
  },
  {
    event: "coupon_available",
    subject: "New coupon for you: {{code}}",
    inApp: "You unlocked a new coupon {{code}} — {{discount}} off. Valid till {{expiry}}.",
    email:
      "Hi {{name}}, enjoy {{discount}} off with code {{code}}. Hurry, expires {{expiry}}.",
    sms: "Dadar Shop: Use {{code}} for {{discount}} off. Expires {{expiry}}.",
    push: "Coupon {{code}} · {{discount}} off",
  },
];

export const NOTIFICATION_CHANNELS: NotificationChannel[] = [
  "in_app",
  "email",
  "sms",
  "push",
];

export const DEFAULT_NOTIFICATION_PREFS: Record<
  NotificationEvent,
  Record<NotificationChannel, boolean>
> = {
  new_order:        { in_app: true,  email: true,  sms: true,  push: true  },
  payment_success:  { in_app: true,  email: true,  sms: true,  push: true  },
  payment_failed:   { in_app: true,  email: true,  sms: true,  push: true  },
  order_shipped:    { in_app: true,  email: true,  sms: false, push: true  },
  order_delivered:  { in_app: true,  email: true,  sms: false, push: true  },
  refund_approved:  { in_app: true,  email: true,  sms: true,  push: true  },
  coupon_available: { in_app: true,  email: false, sms: false, push: true  },
};

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    title: "Out for delivery",
    body: "Order DS-10248 shipped with Pathao. Tracking PTH-883421-BD.",
    at: "2026-06-17T08:12:00Z",
    kind: "order",
    event: "order_shipped",
    channels: ["in_app", "email", "push"],
    unread: true,
  },
  {
    id: "n2",
    title: "Flash Sale — 60% OFF",
    body: "Final Sale ends tonight at midnight. Don't miss out.",
    at: "2026-06-16T17:00:00Z",
    kind: "promo",
    event: "coupon_available",
    channels: ["in_app", "push"],
    unread: true,
  },
  {
    id: "n3",
    title: "Delivered",
    body: "Order DS-10221 was delivered. Rate your purchase to earn 20 points.",
    at: "2026-06-01T13:45:00Z",
    kind: "order",
    event: "order_delivered",
    channels: ["in_app", "email", "push"],
    unread: false,
  },
  {
    id: "n4",
    title: "Payment received",
    body: "৳4,870 via bKash confirmed for DS-10248. TrxID 7K9N22XQ.",
    at: "2026-06-12T09:25:00Z",
    kind: "payment",
    event: "payment_success",
    channels: ["in_app", "email", "sms", "push"],
    unread: false,
  },
  {
    id: "n5",
    title: "Refund approved",
    body: "Refund RF-2041 of ৳2,150 approved via bKash. Expected by 19 Jun.",
    at: "2026-06-10T16:05:00Z",
    kind: "refund",
    event: "refund_approved",
    channels: ["in_app", "email", "sms", "push"],
    unread: false,
  },
  {
    id: "n6",
    title: "Payment failed",
    body: "Card payment for DS-10250 was declined. Please retry from the order.",
    at: "2026-06-09T11:32:00Z",
    kind: "payment",
    event: "payment_failed",
    channels: ["in_app", "email", "sms"],
    unread: true,
  },
  {
    id: "n7",
    title: "Order confirmed",
    body: "Order DS-10248 placed for ৳4,870. We'll notify you on shipping.",
    at: "2026-06-12T09:24:00Z",
    kind: "order",
    event: "new_order",
    channels: ["in_app", "email", "push"],
    unread: false,
  },
];

export interface Review {
  id: string;
  productId?: string;
  productName: string;
  rating: number;
  title?: string;
  comment: string;
  at: string;
  status: "Published" | "Pending" | "Rejected";
  verifiedPurchase?: boolean;
  photos?: string[];
  videos?: string[];
  likes?: number;
  reports?: number;
  authorName?: string;
}

export const REVIEWS: Review[] = [
  {
    id: "r1",
    productId: "saree-meadow",
    productName: "Meadow Silk Saree",
    rating: 5,
    title: "Stunning weave, premium feel",
    comment: "Beautiful weave, true to colour. Packaging was premium.",
    at: "2026-06-02T10:11:00Z",
    status: "Published",
    verifiedPurchase: true,
    photos: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400",
    ],
    likes: 24,
    reports: 0,
    authorName: "Arif H.",
  },
  {
    id: "r2",
    productId: "headphones-aero",
    productName: "Aero Wireless Headphones",
    rating: 4,
    title: "Great battery, average bass",
    comment: "Great battery life. Bass could be a touch warmer.",
    at: "2026-04-19T20:30:00Z",
    status: "Published",
    verifiedPurchase: true,
    videos: ["https://cdn.coverr.co/videos/coverr-headphones-on-a-table-2967/1080p.mp4"],
    likes: 11,
    reports: 0,
    authorName: "Arif H.",
  },
  {
    id: "r3",
    productId: "watch-elite-01",
    productName: "Elite Chronograph Watch",
    rating: 5,
    title: "Looks better than the photos",
    comment: "Crown action is buttery, strap feels premium. Worth every taka.",
    at: "2026-05-10T18:00:00Z",
    status: "Pending",
    verifiedPurchase: true,
    photos: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400"],
    likes: 0,
    reports: 0,
    authorName: "Arif H.",
  },
  {
    id: "r4",
    productId: "glow-skincare",
    productName: "Glow Skincare Set",
    rating: 2,
    title: "Arrived damaged",
    comment: "Two bottles leaked. Refund processed quickly though.",
    at: "2026-05-18T09:20:00Z",
    status: "Rejected",
    verifiedPurchase: true,
    likes: 3,
    reports: 2,
    authorName: "Arif H.",
  },
];

export interface SupportTicket {
  id: string;
  subject: string;
  category: "Order" | "Payment" | "Return" | "Account" | "Other";
  status: "Open" | "Awaiting reply" | "Resolved";
  updatedAt: string;
  lastMessage: string;
}

export const TICKETS: SupportTicket[] = [
  {
    id: "TKT-3398",
    subject: "Wrong size delivered for sneakers",
    category: "Return",
    status: "Awaiting reply",
    updatedAt: "2026-06-15T12:04:00Z",
    lastMessage: "Pickup scheduled for 17 June, please keep the package sealed.",
  },
  {
    id: "TKT-3201",
    subject: "bKash payment debited but order not placed",
    category: "Payment",
    status: "Resolved",
    updatedAt: "2026-05-21T09:00:00Z",
    lastMessage: "Refund processed to your bKash wallet (TrxID 9F2X11AB).",
  },
];

export interface RewardActivity {
  id: string;
  label: string;
  points: number; // +earn / -spend
  at: string;
}

export const REWARDS = {
  balance: 1280,
  tier: "Gold" as const,
  nextTier: { name: "Platinum", pointsNeeded: 720 },
  activity: [
    { id: "p1", label: "Order DS-10248 — earned", points: 48, at: "2026-06-12T09:24:00Z" },
    { id: "p2", label: "Review — Meadow Silk Saree", points: 20, at: "2026-06-02T10:15:00Z" },
    { id: "p3", label: "Coupon redeemed: SAVE10", points: -200, at: "2026-05-28T14:02:00Z" },
    { id: "p4", label: "Order DS-10221 — earned", points: 22, at: "2026-05-28T14:02:00Z" },
  ] as RewardActivity[],
};

// ============================ REFUNDS ============================
export type RefundStatus =
  | "Requested"
  | "Approved"
  | "Pickup scheduled"
  | "Picked up"
  | "In transit"
  | "Inspecting"
  | "Refund initiated"
  | "Completed"
  | "Rejected";

export type RefundReason =
  | "Wrong item delivered"
  | "Damaged on arrival"
  | "Size / fit issue"
  | "Quality not as described"
  | "Changed my mind"
  | "Late delivery"
  | "Other";

export type RefundMethod = "Original payment" | "bKash" | "Nagad" | "Bank transfer" | "Store credit";

export interface RefundTimelineEvent {
  status: RefundStatus | string;
  note?: string;
  at: string;
  done: boolean;
}

export interface Refund {
  id: string; // RF-XXXX
  orderId: string;
  productName: string;
  amount: number;
  reason: RefundReason;
  status: RefundStatus;
  method: RefundMethod;
  requestedAt: string;
  expectedBy: string;
  trackingNumber?: string;
  courier?: string;
  notes?: string;
  timeline: RefundTimelineEvent[];
}

export const REFUNDS: Refund[] = [
  {
    id: "RF-2041",
    orderId: "DS-10221",
    productName: "Meadow Silk Saree",
    amount: 2150,
    reason: "Quality not as described",
    status: "Refund initiated",
    method: "bKash",
    requestedAt: "2026-06-10T11:15:00Z",
    expectedBy: "2026-06-19",
    trackingNumber: "RDX-CC-99201",
    courier: "RedX",
    notes: "Refund to bKash wallet +8801711-234567",
    timeline: [
      { status: "Requested", at: "2026-06-10T11:15:00Z", done: true, note: "Reason: Quality not as described" },
      { status: "Approved", at: "2026-06-10T16:00:00Z", done: true },
      { status: "Pickup scheduled", at: "2026-06-11T09:00:00Z", done: true, note: "RedX pickup on 12 Jun" },
      { status: "Picked up", at: "2026-06-12T11:20:00Z", done: true },
      { status: "In transit", at: "2026-06-13T08:00:00Z", done: true, note: "Reached Dhaka return hub" },
      { status: "Inspecting", at: "2026-06-14T14:30:00Z", done: true, note: "Item passed QC" },
      { status: "Refund initiated", at: "2026-06-15T10:00:00Z", done: true, note: "TrxID pending" },
      { status: "Completed", at: "", done: false },
    ],
  },
  {
    id: "RF-2038",
    orderId: "DS-10199",
    productName: "Glow Skincare Set",
    amount: 990,
    reason: "Damaged on arrival",
    status: "Completed",
    method: "Original payment",
    requestedAt: "2026-05-12T10:00:00Z",
    expectedBy: "2026-05-20",
    trackingNumber: "STF-RR-77810",
    courier: "Steadfast",
    notes: "Refunded as store credit voucher VC-990-A1B",
    timeline: [
      { status: "Requested", at: "2026-05-12T10:00:00Z", done: true },
      { status: "Approved", at: "2026-05-12T15:00:00Z", done: true },
      { status: "Pickup scheduled", at: "2026-05-13T09:30:00Z", done: true },
      { status: "Picked up", at: "2026-05-14T12:00:00Z", done: true },
      { status: "In transit", at: "2026-05-15T08:00:00Z", done: true },
      { status: "Inspecting", at: "2026-05-16T13:00:00Z", done: true },
      { status: "Refund initiated", at: "2026-05-17T10:00:00Z", done: true },
      { status: "Completed", at: "2026-05-19T11:30:00Z", done: true, note: "TrxID 9F2X11AB" },
    ],
  },
  {
    id: "RF-2055",
    orderId: "DS-10248",
    productName: "Aero Wireless Headphones",
    amount: 1280,
    reason: "Size / fit issue",
    status: "Requested",
    method: "bKash",
    requestedAt: "2026-06-16T19:45:00Z",
    expectedBy: "2026-06-25",
    notes: "Awaiting seller approval",
    timeline: [
      { status: "Requested", at: "2026-06-16T19:45:00Z", done: true, note: "Awaiting seller approval" },
      { status: "Approved", at: "", done: false },
      { status: "Pickup scheduled", at: "", done: false },
      { status: "Picked up", at: "", done: false },
      { status: "In transit", at: "", done: false },
      { status: "Inspecting", at: "", done: false },
      { status: "Refund initiated", at: "", done: false },
      { status: "Completed", at: "", done: false },
    ],
  },
];

export const REFUND_STATUS_TONE: Record<RefundStatus, string> = {
  Requested: "bg-amber-100 text-amber-800",
  Approved: "bg-blue-100 text-blue-800",
  "Pickup scheduled": "bg-blue-100 text-blue-800",
  "Picked up": "bg-indigo-100 text-indigo-800",
  "In transit": "bg-indigo-100 text-indigo-800",
  Inspecting: "bg-violet-100 text-violet-800",
  "Refund initiated": "bg-teal-100 text-teal-800",
  Completed: "bg-emerald-100 text-emerald-800",
  Rejected: "bg-rose-100 text-rose-800",
};

export function formatBDT(n: number) {
  return `৳${n.toLocaleString("en-BD")}`;
}

export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Dhaka",
    ...opts,
  });
}

export function formatDay(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  });
}

