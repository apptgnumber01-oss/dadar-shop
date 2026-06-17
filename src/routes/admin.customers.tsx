import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Award, Mail, Phone, Search, Users } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatBDT } from "@/data/account";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/customers")({
  head: () => ({
    meta: [
      { title: "Customers — Admin · Dadar Shop" },
      { name: "description", content: "Customer profiles, order history, loyalty points, support and payments." },
    ],
  }),
  component: CustomersPage,
});

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: "Silver" | "Gold" | "Platinum";
  orders: number;
  spend: number;
  points: number;
  supportTickets: number;
  lastOrder: string;
}

const CUSTOMERS: Customer[] = [
  { id: "CUST-1001", name: "Arif Hossain", email: "arif.hossain@example.com", phone: "+8801711-234567", tier: "Gold", orders: 24, spend: 84500, points: 1820, supportTickets: 3, lastOrder: "2026-06-12" },
  { id: "CUST-1002", name: "Sumaiya Akter", email: "sumaiya.a@example.com", phone: "+8801812-987654", tier: "Platinum", orders: 41, spend: 192300, points: 4150, supportTickets: 5, lastOrder: "2026-06-14" },
  { id: "CUST-1003", name: "Rakib Khan", email: "rakib.k@example.com", phone: "+8801933-112233", tier: "Silver", orders: 6, spend: 18420, points: 320, supportTickets: 1, lastOrder: "2026-05-30" },
  { id: "CUST-1004", name: "Nusrat Jahan", email: "nusrat.j@example.com", phone: "+8801511-445566", tier: "Gold", orders: 17, spend: 62100, points: 1240, supportTickets: 2, lastOrder: "2026-06-10" },
  { id: "CUST-1005", name: "Mahmud Sarker", email: "mahmud.s@example.com", phone: "+8801611-778899", tier: "Silver", orders: 3, spend: 7820, points: 95, supportTickets: 0, lastOrder: "2026-04-22" },
];

const TIER_TONE: Record<Customer["tier"], string> = {
  Silver: "bg-slate-100 text-slate-700",
  Gold: "bg-amber-100 text-amber-800",
  Platinum: "bg-violet-100 text-violet-800",
};

function CustomersPage() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Customer | null>(CUSTOMERS[0]);

  const list = useMemo(
    () =>
      CUSTOMERS.filter(
        (c) =>
          !q ||
          c.name.toLowerCase().includes(q.toLowerCase()) ||
          c.email.toLowerCase().includes(q.toLowerCase()) ||
          c.id.toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  );

  return (
    <div className="bg-background min-h-screen pb-24">
      <div className="mx-auto w-full max-w-[1200px] px-4 pt-6">
        <Link to="/admin" className="text-muted-foreground hover:text-foreground mb-3 inline-flex items-center gap-1 text-xs">
          <ArrowLeft className="size-3.5" /> Back to admin
        </Link>

        <header className="surface-card mb-4 rounded-3xl p-6">
          <h1 className="text-display flex items-center gap-2 text-3xl font-semibold">
            <Users className="size-7" /> Customer management
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Profiles, order history, loyalty points, support & payment history.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
          <section className="surface-card rounded-3xl p-3">
            <div className="relative mb-3">
              <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              <Input placeholder="Search customers" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
            </div>
            <ul className="space-y-1">
              {list.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => setSelected(c)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-2xl px-3 py-2 text-left text-sm transition",
                      selected?.id === c.id ? "bg-primary text-primary-foreground" : "hover:bg-surface-muted",
                    )}
                  >
                    <div className="min-w-0">
                      <div className="truncate font-semibold">{c.name}</div>
                      <div className={cn("truncate text-[11px]", selected?.id === c.id ? "text-primary-foreground/80" : "text-muted-foreground")}>
                        {c.id} · {c.orders} orders
                      </div>
                    </div>
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", TIER_TONE[c.tier])}>{c.tier}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {selected && <CustomerDetail c={selected} />}
        </div>
      </div>
    </div>
  );
}

function CustomerDetail({ c }: { c: Customer }) {
  return (
    <section className="space-y-4">
      <div className="surface-card rounded-3xl p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-display text-2xl font-semibold">{c.name}</h2>
            <p className="text-muted-foreground mt-1 flex flex-wrap gap-3 text-xs">
              <span className="inline-flex items-center gap-1"><Mail className="size-3" /> {c.email}</span>
              <span className="inline-flex items-center gap-1"><Phone className="size-3" /> {c.phone}</span>
            </p>
          </div>
          <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", TIER_TONE[c.tier])}>{c.tier} member</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Orders" value={c.orders.toString()} />
          <Stat label="Total spend" value={formatBDT(c.spend)} />
          <Stat label="Loyalty points" value={c.points.toLocaleString()} icon={<Award className="size-3.5" />} />
          <Stat label="Support tickets" value={c.supportTickets.toString()} />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Panel title="Recent order history">
          <ol className="space-y-2 text-sm">
            <Row left="DS-10248 · 2 items" right={formatBDT(4870)} />
            <Row left="DS-10241 · 1 item" right={formatBDT(1280)} />
            <Row left="DS-10227 · 4 items" right={formatBDT(8210)} />
            <Row left="DS-10219 · 1 item" right={formatBDT(2390)} />
          </ol>
        </Panel>
        <Panel title="Payment history">
          <ol className="space-y-2 text-sm">
            <Row left="bKash · TXN-77124" right={formatBDT(4870)} />
            <Row left="Card · VISA •••• 4421" right={formatBDT(1280)} />
            <Row left="Nagad · TXN-77098" right={formatBDT(8210)} />
            <Row left="COD" right={formatBDT(2390)} />
          </ol>
        </Panel>
        <Panel title="Loyalty points ledger">
          <ol className="space-y-2 text-sm">
            <Row left="Order DS-10248 +97" right="+97" tone="success" />
            <Row left="Birthday bonus" right="+200" tone="success" />
            <Row left="Redeemed voucher" right="-150" tone="warn" />
            <Row left="Order DS-10227 +164" right="+164" tone="success" />
          </ol>
        </Panel>
        <Panel title="Support history">
          <ol className="space-y-2 text-sm">
            <Row left="#T-2104 · Delivery delay" right="Resolved" tone="success" />
            <Row left="#T-2079 · Refund inquiry" right="Resolved" tone="success" />
            <Row left="#T-2031 · Invoice copy" right="Closed" />
          </ol>
        </Panel>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm">Email customer</Button>
        <Button variant="hero" size="sm">Adjust points</Button>
      </div>
    </section>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="bg-surface-muted rounded-2xl p-3">
      <div className="text-muted-foreground text-[10px] uppercase tracking-wide">{label}</div>
      <div className="text-display mt-1 inline-flex items-center gap-1 text-lg font-semibold">
        {icon}
        {value}
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="surface-card rounded-3xl p-5">
      <h3 className="text-display mb-3 text-sm font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function Row({ left, right, tone }: { left: string; right: string; tone?: "success" | "warn" }) {
  return (
    <li className="flex items-center justify-between gap-3 border-b border-border/40 pb-1.5 last:border-0">
      <span className="text-muted-foreground truncate">{left}</span>
      <span
        className={cn(
          "font-semibold tabular-nums",
          tone === "success" && "text-emerald-700",
          tone === "warn" && "text-amber-700",
        )}
      >
        {right}
      </span>
    </li>
  );
}
