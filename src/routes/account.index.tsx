import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  Gift,
  Heart,
  LifeBuoy,
  MapPin,
  Megaphone,
  Package,
  Receipt,
  RotateCcw,
  Star,
  User,
  type LucideIcon,
} from "lucide-react";

import {
  ADDRESSES,
  NOTIFICATIONS,
  ORDERS,
  PROFILE,
  REFUNDS,
  REVIEWS,
  REWARDS,
  TICKETS,
  formatBDT,
} from "@/data/account";
import { useShop } from "@/lib/shopStore";

export const Route = createFileRoute("/account/")({
  component: AccountOverview,
});

interface Tile {
  to:
    | "/account/profile"
    | "/account/orders"
    | "/account/refunds"
    | "/account/transactions"
    | "/account/marketing"
    | "/account/wishlist"
    | "/account/addresses"
    | "/account/notifications"
    | "/account/reviews"
    | "/account/support"
    | "/account/rewards";
  label: string;
  icon: LucideIcon;
  hint: string;
  badge?: string | number;
}

function AccountOverview() {
  const { state } = useShop();
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;

  const tiles: Tile[] = [
    { to: "/account/profile", label: "Profile", icon: User, hint: "Personal details" },
    {
      to: "/account/orders",
      label: "Orders",
      icon: Package,
      hint: "Track & manage",
      badge: ORDERS.length,
    },
    {
      to: "/account/refunds",
      label: "Refunds",
      icon: RotateCcw,
      hint: "Returns & tracking",
      badge: REFUNDS.filter((r) => r.status !== "Completed" && r.status !== "Rejected").length || REFUNDS.length,
    },
    {
      to: "/account/transactions",
      label: "Transaction history",
      icon: Receipt,
      hint: "Payments & refunds",
    },
    {
      to: "/account/marketing",
      label: "Marketing",
      icon: Megaphone,
      hint: "Coupons & rewards",
    },
    {
      to: "/account/wishlist",
      label: "Wishlist",
      icon: Heart,
      hint: "Saved items",
      badge: state.wishlist.length || undefined,
    },
    {
      to: "/account/addresses",
      label: "Addresses",
      icon: MapPin,
      hint: "Delivery locations",
      badge: ADDRESSES.length,
    },
    {
      to: "/account/notifications",
      label: "Notifications",
      icon: Bell,
      hint: "Updates & offers",
      badge: unread || undefined,
    },
    {
      to: "/account/reviews",
      label: "Reviews",
      icon: Star,
      hint: "Your feedback",
      badge: REVIEWS.length,
    },
    {
      to: "/account/support",
      label: "Support tickets",
      icon: LifeBuoy,
      hint: "Get help",
      badge: TICKETS.filter((t) => t.status !== "Resolved").length || undefined,
    },
    {
      to: "/account/rewards",
      label: "Reward points",
      icon: Gift,
      hint: `${REWARDS.balance.toLocaleString()} pts`,
    },
  ];

  return (
    <div className="space-y-5">
      <section className="surface-card flex items-center gap-4 rounded-3xl p-5">
        <div className="bg-primary text-primary-foreground flex size-16 items-center justify-center rounded-full text-xl font-semibold">
          {PROFILE.avatarInitials}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-display truncate text-xl font-semibold">{PROFILE.name}</h1>
          <p className="text-muted-foreground truncate text-xs">{PROFILE.email}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="bg-amber/15 text-amber-foreground rounded-pill px-2 py-0.5 text-[10px] font-medium">
              {PROFILE.tier} member
            </span>
            <span className="text-muted-foreground text-[11px]">
              Since {PROFILE.memberSince}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-display text-xl font-semibold">
            {REWARDS.balance.toLocaleString()}
          </div>
          <div className="text-muted-foreground text-[10px] uppercase tracking-wide">
            Reward pts
          </div>
        </div>
      </section>

      <section className="surface-card rounded-3xl p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-display text-sm font-semibold">Recent orders</h2>
          <Link to="/account/orders" className="text-primary text-xs font-medium">
            View all
          </Link>
        </div>
        <ul className="divide-border divide-y">
          {ORDERS.slice(0, 3).map((o) => (
            <li key={o.id} className="flex items-center justify-between py-3">
              <Link
                to="/account/orders/$id"
                params={{ id: o.id }}
                className="min-w-0 flex-1"
              >
                <div className="text-sm font-medium">{o.id}</div>
                <div className="text-muted-foreground truncate text-xs">
                  {o.items.map((i) => i.name).join(", ")}
                </div>
              </Link>
              <div className="text-right">
                <div className="text-sm font-semibold">{formatBDT(o.total)}</div>
                <div className="text-muted-foreground text-[11px]">{o.status}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {tiles.map((t) => {
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              className="surface-card hover:shadow-card group relative flex flex-col gap-1 rounded-3xl p-4 transition"
            >
              <div className="bg-primary-soft text-primary flex size-10 items-center justify-center rounded-2xl">
                <Icon className="size-5" />
              </div>
              <div className="mt-2 text-sm font-semibold">{t.label}</div>
              <div className="text-muted-foreground text-[11px]">{t.hint}</div>
              {t.badge !== undefined && (
                <span className="bg-primary text-primary-foreground absolute right-3 top-3 min-w-[20px] rounded-full px-1.5 py-0.5 text-center text-[10px] font-semibold">
                  {t.badge}
                </span>
              )}
            </Link>
          );
        })}
      </section>
    </div>
  );
}
