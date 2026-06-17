import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Bell,
  Boxes,
  DollarSign,
  LayoutDashboard,
  Mail,
  MessageSquare,
  PackageCheck,
  ShoppingBag,
  Smartphone,
  Star,
  Truck,
  Users,
  Flag,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  formatBDT,
  formatDay,
  ORDERS,
  REVIEWS,
  NOTIFICATION_TEMPLATES,
  NOTIFICATION_CHANNEL_LABEL,
  NOTIFICATION_EVENT_LABEL,
  type Review,
} from "@/data/account";
import { PRODUCTS } from "@/data/products";
import { COURIERS, PRIMARY_COURIERS } from "@/data/couriers";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Dadar Shop" },
      {
        name: "description",
        content:
          "Enterprise analytics dashboard: revenue, sales, customers, products, orders and delivery performance.",
      },
    ],
  }),
  component: AdminDashboard,
});

type Tab =
  | "revenue"
  | "sales"
  | "customers"
  | "products"
  | "orders"
  | "delivery"
  | "notifications"
  | "reviews";

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: "revenue", label: "Revenue", icon: DollarSign },
  { id: "sales", label: "Sales", icon: BarChart3 },
  { id: "customers", label: "Customers", icon: Users },
  { id: "products", label: "Products", icon: Boxes },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "delivery", label: "Delivery", icon: Truck },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "reviews", label: "Reviews", icon: Star },
];

function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("revenue");

  return (
    <div className="bg-background min-h-screen pb-24">
      <div className="mx-auto w-full max-w-[1200px] px-4 pt-6">
        <Link
          to="/account"
          className="text-muted-foreground hover:text-foreground mb-3 inline-flex items-center gap-1 text-xs"
        >
          <ArrowLeft className="size-3.5" /> Back to account
        </Link>

        <header className="surface-card mb-4 flex flex-col gap-3 rounded-3xl p-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-display flex items-center gap-2 text-3xl font-semibold">
              <LayoutDashboard className="size-7" /> Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Live analytics across revenue, sales, customers and operations.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/products">Products</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/orders">Orders</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/customers">Customers</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/sellers">Sellers</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/analytics">Analytics</Link>
            </Button>
            <Button variant="hero" size="sm" asChild>
              <Link to="/seller">Seller portal</Link>
            </Button>
          </div>

        </header>

        <nav className="surface-card -mx-1 mb-4 flex gap-1 overflow-x-auto rounded-3xl p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "tap-scale tap-scale-active inline-flex shrink-0 items-center gap-1.5 rounded-2xl px-4 py-2 text-sm font-medium transition",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-surface-muted",
                )}
              >
                <Icon className="size-4" /> {t.label}
              </button>
            );
          })}
        </nav>

        {tab === "revenue" && <RevenuePanel />}
        {tab === "sales" && <SalesPanel />}
        {tab === "customers" && <CustomersPanel />}
        {tab === "products" && <ProductsPanel />}
        {tab === "orders" && <OrdersPanel />}
        {tab === "delivery" && <DeliveryPanel />}
        {tab === "notifications" && <NotificationsPanel />}
        {tab === "reviews" && <ReviewsPanel />}
      </div>
    </div>
  );
}

/* ------------------------------ Mock series ----------------------------- */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const REVENUE_SERIES = [128000, 142500, 161200, 154800, 187300, 215600];
const ORDERS_SERIES = [184, 211, 248, 232, 297, 341];

/* ------------------------------- Revenue -------------------------------- */

function RevenuePanel() {
  const total = REVENUE_SERIES.reduce((s, n) => s + n, 0);
  const last = REVENUE_SERIES[REVENUE_SERIES.length - 1];
  const prev = REVENUE_SERIES[REVENUE_SERIES.length - 2];
  const growth = ((last - prev) / prev) * 100;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <KPI label="Revenue (6m)" value={formatBDT(total)} delta={growth} tone="primary" />
        <KPI label="This month" value={formatBDT(last)} delta={growth} tone="success" />
        <KPI label="Avg order value" value={formatBDT(Math.round(last / ORDERS_SERIES[5]))} delta={4.2} />
        <KPI label="Refunds" value={formatBDT(12400)} delta={-2.1} tone="warn" />
      </div>

      <section className="surface-card rounded-3xl p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-display text-sm font-semibold">Revenue trend</h3>
          <span className="text-muted-foreground text-xs">Monthly · BDT</span>
        </div>
        <BarChart labels={MONTHS} values={REVENUE_SERIES} formatter={(v) => `৳${(v / 1000).toFixed(0)}k`} />
      </section>

      <section className="surface-card rounded-3xl p-5">
        <h3 className="text-display mb-3 text-sm font-semibold">Revenue by payment method</h3>
        <SegmentBar
          parts={[
            { label: "bKash", value: 38, color: "#E2136E" },
            { label: "Nagad", value: 22, color: "#EB6E1F" },
            { label: "Card", value: 16, color: "#1A1F71" },
            { label: "COD", value: 18, color: "#0F766E" },
            { label: "Rocket", value: 6, color: "#8C2D8D" },
          ]}
        />
      </section>
    </div>
  );
}

/* --------------------------------- Sales -------------------------------- */

function SalesPanel() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <KPI label="Units sold" value="3,418" delta={11.4} />
        <KPI label="Conversion" value="3.7%" delta={0.6} tone="success" />
        <KPI label="Cart abandon" value="42%" delta={-3.2} tone="warn" />
        <KPI label="Repeat rate" value="28%" delta={2.1} />
      </div>
      <section className="surface-card rounded-3xl p-5">
        <h3 className="text-display mb-4 text-sm font-semibold">Orders per month</h3>
        <BarChart labels={MONTHS} values={ORDERS_SERIES} formatter={(v) => v.toString()} />
      </section>
    </div>
  );
}

/* ------------------------------ Customers ------------------------------- */

function CustomersPanel() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <KPI label="Total customers" value="12,418" delta={6.8} />
        <KPI label="New (30d)" value="842" delta={14.1} tone="success" />
        <KPI label="Active (30d)" value="4,201" delta={2.3} />
        <KPI label="LTV" value="৳6,820" delta={3.5} tone="primary" />
      </div>
      <section className="surface-card rounded-3xl p-5">
        <h3 className="text-display mb-3 text-sm font-semibold">Customer mix</h3>
        <SegmentBar
          parts={[
            { label: "Returning", value: 64, color: "#0F766E" },
            { label: "New", value: 28, color: "#3B82F6" },
            { label: "VIP", value: 8, color: "#F59E0B" },
          ]}
        />
      </section>
    </div>
  );
}

/* ------------------------------- Products ------------------------------- */

function ProductsPanel() {
  const top = useMemo(() => {
    return [...PRODUCTS]
      .map((p, i) => ({ ...p, units: 60 + ((i * 47) % 220) }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 6);
  }, []);
  const max = top[0]?.units ?? 1;


  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <KPI label="Active SKUs" value={PRODUCTS.length.toString()} delta={1.0} />
        <KPI label="Low stock" value="14" delta={-12} tone="warn" />
        <KPI label="Out of stock" value="3" delta={-50} tone="success" />
        <KPI label="Avg rating" value="4.6" delta={0.2} tone="primary" />
      </div>
      <section className="surface-card rounded-3xl p-5">
        <h3 className="text-display mb-4 text-sm font-semibold">Top selling products</h3>
        <ul className="space-y-3">
          {top.map((p) => (
            <li key={p.id} className="grid grid-cols-[1fr_120px_60px] items-center gap-3 text-sm">
              <span className="truncate font-medium">{p.name}</span>
              <div className="bg-surface-muted h-2 overflow-hidden rounded-full">
                <div className="bg-primary h-full rounded-full" style={{ width: `${(p.units / max) * 100}%` }} />
              </div>
              <span className="text-right font-semibold tabular-nums">{p.units}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/* -------------------------------- Orders -------------------------------- */

function OrdersPanel() {
  const totals = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const o of ORDERS) acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <KPI label="Orders (6m)" value={ORDERS_SERIES.reduce((s, n) => s + n, 0).toLocaleString()} delta={9.1} />
        <KPI label="Pending" value={(totals["Placed"] ?? 0).toString()} delta={3.0} tone="warn" />
        <KPI label="Delivered" value={(totals["Delivered"] ?? 0).toString()} delta={11.5} tone="success" />
        <KPI label="Cancelled" value={(totals["Cancelled"] ?? 0).toString()} delta={-1.2} />
      </div>
      <section className="surface-card rounded-3xl p-5">
        <h3 className="text-display mb-3 text-sm font-semibold">Recent orders</h3>
        <table className="w-full text-left text-sm">
          <thead className="text-muted-foreground text-[11px] uppercase tracking-wide">
            <tr>
              <th className="py-2">Order</th>
              <th>Status</th>
              <th>Courier</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {ORDERS.map((o) => (
              <tr key={o.id} className="border-border border-t">
                <td className="py-2 font-medium">{o.id}</td>
                <td>
                  <StatusPill status={o.status} />
                </td>
                <td className="text-muted-foreground">{o.courier}</td>
                <td className="text-right font-semibold">{formatBDT(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

/* ------------------------------- Delivery ------------------------------- */

function DeliveryPanel() {
  const rows = PRIMARY_COURIERS.map((id, i) => {
    const c = COURIERS[id];
    const shipments = 110 + ((i * 53) % 180);
    const onTime = 84 + ((i * 7) % 12);
    return { c, shipments, onTime, revenue: shipments * (c.baseCharge.inside_dhaka + 40) };
  });

  const totalShip = rows.reduce((s, r) => s + r.shipments, 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <KPI label="Shipments (30d)" value={totalShip.toLocaleString()} delta={7.4} tone="primary" />
        <KPI label="On-time" value="92%" delta={1.8} tone="success" />
        <KPI label="Avg delivery time" value="2.1d" delta={-0.3} />
        <KPI label="Failed delivery" value="1.4%" delta={-0.4} tone="warn" />
      </div>

      <section className="surface-card rounded-3xl p-5">
        <h3 className="text-display mb-4 text-sm font-semibold">Courier performance</h3>
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.c.id} className="grid grid-cols-[140px_1fr_70px_90px] items-center gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full" style={{ background: r.c.accent }} />
                <span className="font-medium">{r.c.name}</span>
              </div>
              <div className="bg-surface-muted h-2 overflow-hidden rounded-full">
                <div className="h-full rounded-full" style={{ width: `${(r.shipments / totalShip) * 100}%`, background: r.c.accent }} />
              </div>
              <span className="text-right tabular-nums">{r.shipments}</span>
              <span className="text-right text-emerald-700 tabular-nums">{r.onTime}%</span>
            </div>
          ))}
        </div>
      </section>

      <section className="surface-card rounded-3xl p-5">
        <h3 className="text-display mb-3 flex items-center gap-2 text-sm font-semibold">
          <PackageCheck className="size-4" /> Delivery revenue by zone
        </h3>
        <SegmentBar
          parts={[
            { label: "Inside Dhaka", value: 54, color: "#3B82F6" },
            { label: "Sub-Dhaka", value: 22, color: "#8B5CF6" },
            { label: "Outside Dhaka", value: 24, color: "#F59E0B" },
          ]}
        />
      </section>
    </div>
  );
}

/* ------------------------------- Primitives ----------------------------- */

function KPI({
  label,
  value,
  delta,
  tone,
}: {
  label: string;
  value: string;
  delta: number;
  tone?: "success" | "warn" | "primary";
}) {
  const up = delta >= 0;
  return (
    <div className="surface-card rounded-3xl p-4">
      <div className="text-muted-foreground text-[10px] uppercase tracking-wider">{label}</div>
      <div
        className={cn(
          "text-display mt-1 text-2xl font-semibold tabular-nums",
          tone === "primary" && "text-primary",
          tone === "success" && "text-emerald-700",
          tone === "warn" && "text-amber-700",
        )}
      >
        {value}
      </div>
      <div
        className={cn(
          "mt-1 inline-flex items-center gap-0.5 text-[11px] font-semibold",
          up ? "text-emerald-700" : "text-rose-700",
        )}
      >
        {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
        {Math.abs(delta).toFixed(1)}% vs prev
      </div>
    </div>
  );
}

function BarChart({
  labels,
  values,
  formatter,
}: {
  labels: string[];
  values: number[];
  formatter: (v: number) => string;
}) {
  const max = Math.max(...values);
  return (
    <div className="flex h-48 items-end gap-3">
      {values.map((v, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-2">
          <div
            className="bg-primary w-full rounded-t-xl transition-all"
            style={{ height: `${(v / max) * 100}%` }}
            title={formatter(v)}
          />
          <div className="text-muted-foreground text-[10px]">{labels[i]}</div>
          <div className="text-[10px] font-semibold tabular-nums">{formatter(v)}</div>
        </div>
      ))}
    </div>
  );
}

function SegmentBar({ parts }: { parts: { label: string; value: number; color: string }[] }) {
  const total = parts.reduce((s, p) => s + p.value, 0);
  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full">
        {parts.map((p) => (
          <div key={p.label} style={{ width: `${(p.value / total) * 100}%`, background: p.color }} />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-3 text-xs">
        {parts.map((p) => (
          <li key={p.label} className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full" style={{ background: p.color }} />
            <span className="font-medium">{p.label}</span>
            <span className="text-muted-foreground">{((p.value / total) * 100).toFixed(0)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone =
    status === "Delivered"
      ? "bg-emerald-100 text-emerald-800"
      : status === "Cancelled"
        ? "bg-rose-100 text-rose-800"
        : status === "Out for delivery"
          ? "bg-blue-100 text-blue-800"
          : "bg-amber-100 text-amber-800";
  return <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", tone)}>{status}</span>;
}

/* ---------------------------- Notification templates --------------------------- */

const CHANNEL_TAB_ICON = {
  inApp: Bell,
  email: Mail,
  sms: MessageSquare,
  push: Smartphone,
} as const;

function NotificationsPanel() {
  const [ch, setCh] = useState<"inApp" | "email" | "sms" | "push">("email");
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <KPI label="Templates" value={NOTIFICATION_TEMPLATES.length.toString()} delta={0} />
        <KPI label="Sent (30d)" value="14,820" delta={9.4} tone="primary" />
        <KPI label="Open rate" value="48%" delta={1.7} tone="success" />
        <KPI label="Bounce rate" value="0.6%" delta={-0.2} tone="warn" />
      </div>

      <section className="surface-card rounded-3xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-display text-sm font-semibold">Notification templates</h3>
          <div className="bg-surface-muted flex gap-1 rounded-2xl p-1">
            {(["inApp", "email", "sms", "push"] as const).map((c) => {
              const Icon = CHANNEL_TAB_ICON[c];
              const map = { inApp: "in_app", email: "email", sms: "sms", push: "push" } as const;
              const active = ch === c;
              return (
                <button
                  key={c}
                  onClick={() => setCh(c)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium",
                    active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-3.5" /> {NOTIFICATION_CHANNEL_LABEL[map[c]]}
                </button>
              );
            })}
          </div>
        </div>

        <ul className="mt-4 space-y-3">
          {NOTIFICATION_TEMPLATES.map((t) => (
            <li key={t.event} className="border-border rounded-2xl border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-semibold">
                  {NOTIFICATION_EVENT_LABEL[t.event]}
                </div>
                <code className="text-muted-foreground bg-surface-muted rounded-full px-2 py-0.5 text-[10px]">
                  {t.event}
                </code>
              </div>
              {ch === "email" && (
                <div className="text-muted-foreground mt-1 text-[11px]">
                  Subject: <span className="text-foreground font-medium">{t.subject}</span>
                </div>
              )}
              <pre className="bg-surface-muted text-foreground mt-2 whitespace-pre-wrap rounded-2xl p-3 text-xs">
                {t[ch]}
              </pre>
            </li>
          ))}
        </ul>
        <p className="text-muted-foreground mt-3 text-[11px]">
          Placeholders like <code>{"{{orderId}}"}</code>, <code>{"{{name}}"}</code>,{" "}
          <code>{"{{total}}"}</code> are interpolated at send time.
        </p>
      </section>
    </div>
  );
}

/* ---------------------------- Review moderation --------------------------- */

function ReviewsPanel() {
  const [items, setItems] = useState<Review[]>(REVIEWS);
  const [tab, setTab] = useState<"Pending" | "Published" | "Rejected" | "Reported">(
    "Pending",
  );

  const list = useMemo(() => {
    if (tab === "Reported") return items.filter((r) => (r.reports ?? 0) > 0);
    return items.filter((r) => r.status === tab);
  }, [items, tab]);

  function setStatus(id: string, status: Review["status"]) {
    setItems((l) => l.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  const counts = {
    Pending: items.filter((r) => r.status === "Pending").length,
    Published: items.filter((r) => r.status === "Published").length,
    Rejected: items.filter((r) => r.status === "Rejected").length,
    Reported: items.filter((r) => (r.reports ?? 0) > 0).length,
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <KPI label="Pending" value={counts.Pending.toString()} delta={0} tone="warn" />
        <KPI label="Published" value={counts.Published.toString()} delta={3.4} tone="success" />
        <KPI label="Rejected" value={counts.Rejected.toString()} delta={-1.0} />
        <KPI label="Reported" value={counts.Reported.toString()} delta={0} tone="warn" />
      </div>

      <section className="surface-card rounded-3xl p-5">
        <div className="flex flex-wrap items-center gap-2">
          {(["Pending", "Published", "Rejected", "Reported"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-2xl px-3 py-1.5 text-xs font-medium",
                tab === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-muted text-foreground",
              )}
            >
              {t} ({counts[t]})
            </button>
          ))}
        </div>

        <ul className="mt-4 space-y-3">
          {list.length === 0 && (
            <li className="text-muted-foreground py-6 text-center text-sm">
              Nothing in this queue.
            </li>
          )}
          {list.map((r) => (
            <li key={r.id} className="border-border rounded-2xl border p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                    {r.productName}
                    <span className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "size-3",
                            i < r.rating
                              ? "fill-amber text-amber"
                              : "text-muted-foreground/40",
                          )}
                        />
                      ))}
                    </span>
                    {r.verifiedPurchase && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="text-muted-foreground mt-0.5 text-[11px]">
                    by {r.authorName ?? "Customer"} · {formatDay(r.at)} · {r.likes ?? 0}{" "}
                    likes ·{" "}
                    <span
                      className={cn(
                        (r.reports ?? 0) > 0 && "text-rose-700 font-semibold",
                      )}
                    >
                      <Flag className="-mt-0.5 inline size-3" /> {r.reports ?? 0}{" "}
                      reports
                    </span>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1"
                    onClick={() => setStatus(r.id, "Published")}
                    disabled={r.status === "Published"}
                  >
                    <CheckCircle2 className="size-3.5" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 text-rose-700"
                    onClick={() => setStatus(r.id, "Rejected")}
                    disabled={r.status === "Rejected"}
                  >
                    <XCircle className="size-3.5" /> Reject
                  </Button>
                </div>
              </div>
              {r.title && <h4 className="mt-2 text-sm font-semibold">{r.title}</h4>}
              <p className="text-muted-foreground mt-1 text-sm">{r.comment}</p>
              {(r.photos?.length || r.videos?.length) && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {r.photos?.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="bg-surface-muted size-16 rounded-xl object-cover"
                      loading="lazy"
                    />
                  ))}
                  {r.videos?.map((src, i) => (
                    <video
                      key={i}
                      src={src}
                      muted
                      className="bg-surface-muted size-16 rounded-xl object-cover"
                    />
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
