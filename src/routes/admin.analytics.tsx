import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BarChart3, Eye, Filter as FunnelIcon, Globe, ShoppingCart, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatBDT } from "@/data/account";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Admin · Dadar Shop" },
      { name: "description", content: "Revenue, traffic, product, customer and funnel analytics." },
    ],
  }),
  component: AnalyticsPage,
});

type Tab = "revenue" | "traffic" | "products" | "customers" | "funnel";

function AnalyticsPage() {
  const [tab, setTab] = useState<Tab>("revenue");
  const TABS: { id: Tab; label: string; icon: any }[] = [
    { id: "revenue", label: "Revenue", icon: BarChart3 },
    { id: "traffic", label: "Traffic", icon: Globe },
    { id: "products", label: "Products", icon: ShoppingCart },
    { id: "customers", label: "Customers", icon: Users },
    { id: "funnel", label: "Funnel", icon: FunnelIcon },
  ];

  return (
    <div className="bg-background min-h-screen pb-24">
      <div className="mx-auto w-full max-w-[1200px] px-4 pt-6">
        <Link to="/admin" className="text-muted-foreground hover:text-foreground mb-3 inline-flex items-center gap-1 text-xs">
          <ArrowLeft className="size-3.5" /> Back to admin
        </Link>
        <header className="surface-card mb-4 rounded-3xl p-6">
          <h1 className="text-display flex items-center gap-2 text-3xl font-semibold">
            <BarChart3 className="size-7" /> Analytics
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Revenue, traffic, product, customer and funnel insights.</p>
        </header>

        <nav className="surface-card -mx-1 mb-4 flex gap-1 overflow-x-auto rounded-3xl p-1.5">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-2xl px-4 py-2 text-sm font-medium transition",
                  tab === t.id ? "bg-primary text-primary-foreground" : "hover:bg-surface-muted",
                )}
              >
                <Icon className="size-4" /> {t.label}
              </button>
            );
          })}
        </nav>

        {tab === "revenue" && <Revenue />}
        {tab === "traffic" && <Traffic />}
        {tab === "products" && <Products />}
        {tab === "customers" && <Customers />}
        {tab === "funnel" && <Funnel />}
      </div>
    </div>
  );
}

function Revenue() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const values = [128000, 142500, 161200, 154800, 187300, 215600];
  const max = Math.max(...values);
  return (
    <div className="space-y-4">
      <KGrid items={[
        { label: "Revenue (6m)", value: formatBDT(values.reduce((a, b) => a + b, 0)) },
        { label: "Best month", value: formatBDT(max) },
        { label: "Avg / month", value: formatBDT(Math.round(values.reduce((a, b) => a + b, 0) / values.length)) },
        { label: "MoM growth", value: "+15.1%" },
      ]} />
      <section className="surface-card rounded-3xl p-5">
        <h3 className="text-display mb-4 text-sm font-semibold">Monthly revenue (BDT)</h3>
        <div className="flex h-56 items-end gap-3">
          {values.map((v, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div className="bg-primary w-full rounded-t-xl" style={{ height: `${(v / max) * 100}%` }} />
              <div className="text-muted-foreground text-[10px]">{months[i]}</div>
              <div className="text-[10px] font-semibold tabular-nums">৳{(v / 1000).toFixed(0)}k</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Traffic() {
  const sources = [
    { label: "Organic search", value: 42, color: "#0F766E" },
    { label: "Social", value: 24, color: "#3B82F6" },
    { label: "Direct", value: 18, color: "#F59E0B" },
    { label: "Referral", value: 10, color: "#8B5CF6" },
    { label: "Email", value: 6, color: "#E2136E" },
  ];
  return (
    <div className="space-y-4">
      <KGrid items={[
        { label: "Visitors (30d)", value: "84,210" },
        { label: "Pageviews", value: "312,480" },
        { label: "Avg session", value: "3m 42s" },
        { label: "Bounce rate", value: "38%" },
      ]} />
      <section className="surface-card rounded-3xl p-5">
        <h3 className="text-display mb-3 text-sm font-semibold">Traffic sources</h3>
        <Segments parts={sources} />
      </section>
      <section className="surface-card rounded-3xl p-5">
        <h3 className="text-display mb-3 text-sm font-semibold">Top landing pages</h3>
        <ul className="space-y-2 text-sm">
          {[
            { p: "/", v: 28410 },
            { p: "/shop", v: 18240 },
            { p: "/product/watch-elite-01", v: 9120 },
            { p: "/shop/electronics", v: 7820 },
            { p: "/shop/fashion", v: 6240 },
          ].map((r) => (
            <li key={r.p} className="flex items-center justify-between border-b border-border/40 pb-1.5 last:border-0">
              <span className="inline-flex items-center gap-1"><Eye className="size-3.5 text-muted-foreground" /> {r.p}</span>
              <span className="font-semibold tabular-nums">{r.v.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Products() {
  const top = [
    { n: "Elite Chronograph Watch", units: 248, rev: 891280 },
    { n: "Aero Wireless Headphones", units: 219, rev: 280320 },
    { n: "Lumière Silk Saree", units: 168, rev: 470400 },
    { n: "Glow Skincare Set", units: 142, rev: 198800 },
    { n: "Heritage Leather Bag", units: 96, rev: 268800 },
  ];
  const max = Math.max(...top.map((t) => t.units));
  return (
    <div className="space-y-4">
      <KGrid items={[
        { label: "SKUs", value: "342" },
        { label: "Units sold (30d)", value: "3,418" },
        { label: "Low stock", value: "14" },
        { label: "Avg rating", value: "4.6" },
      ]} />
      <section className="surface-card rounded-3xl p-5">
        <h3 className="text-display mb-4 text-sm font-semibold">Top performing products</h3>
        <ul className="space-y-3">
          {top.map((p) => (
            <li key={p.n} className="grid grid-cols-[1fr_140px_100px] items-center gap-3 text-sm">
              <span className="truncate font-medium">{p.n}</span>
              <div className="bg-surface-muted h-2 overflow-hidden rounded-full">
                <div className="bg-primary h-full rounded-full" style={{ width: `${(p.units / max) * 100}%` }} />
              </div>
              <span className="text-right font-semibold tabular-nums">{formatBDT(p.rev)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Customers() {
  return (
    <div className="space-y-4">
      <KGrid items={[
        { label: "Total customers", value: "12,418" },
        { label: "New (30d)", value: "842" },
        { label: "Retention", value: "64%" },
        { label: "LTV", value: formatBDT(6820) },
      ]} />
      <section className="surface-card rounded-3xl p-5">
        <h3 className="text-display mb-3 text-sm font-semibold">Customer cohorts</h3>
        <Segments parts={[
          { label: "Returning", value: 64, color: "#0F766E" },
          { label: "New", value: 28, color: "#3B82F6" },
          { label: "VIP", value: 8, color: "#F59E0B" },
        ]} />
      </section>
    </div>
  );
}

function Funnel() {
  const steps = [
    { n: "Visits", v: 84210 },
    { n: "Product views", v: 41820 },
    { n: "Add to cart", v: 12480 },
    { n: "Checkout", v: 6420 },
    { n: "Purchase", v: 3118 },
  ];
  const max = steps[0].v;
  return (
    <section className="surface-card rounded-3xl p-5">
      <h3 className="text-display mb-4 text-sm font-semibold">Conversion funnel</h3>
      <ul className="space-y-2">
        {steps.map((s, i) => {
          const pct = (s.v / max) * 100;
          const drop = i > 0 ? (((steps[i - 1].v - s.v) / steps[i - 1].v) * 100).toFixed(1) : null;
          return (
            <li key={s.n} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold">{s.n}</span>
                <span className="text-muted-foreground tabular-nums">
                  {s.v.toLocaleString()} {drop && <span className="text-rose-600">↓ {drop}%</span>}
                </span>
              </div>
              <div className="bg-surface-muted h-6 overflow-hidden rounded-full">
                <div className="bg-primary flex h-full items-center justify-end pr-3 text-[10px] font-semibold text-primary-foreground" style={{ width: `${pct}%` }}>
                  {pct.toFixed(1)}%
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function KGrid({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {items.map((i) => (
        <div key={i.label} className="surface-card rounded-3xl p-4">
          <div className="text-muted-foreground text-[10px] uppercase tracking-wider">{i.label}</div>
          <div className="text-display mt-1 text-2xl font-semibold tabular-nums">{i.value}</div>
        </div>
      ))}
    </div>
  );
}

function Segments({ parts }: { parts: { label: string; value: number; color: string }[] }) {
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
