import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  Check,
  Copy,
  Download,
  MapPin,
  Package,
  Phone,
  MessageCircle,
  Star,
  Printer,
  RefreshCw,
  Truck,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ORDERS, formatBDT, formatDate, type Order } from "@/data/account";
import { COURIERS, ZONE_LABEL } from "@/data/couriers";
import { printLabel } from "./account.delivery";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/orders/$id")({
  loader: ({ params }) => {
    const order = ORDERS.find((o) => o.id === params.id);
    if (!order) throw notFound();
    return { order };
  },
  notFoundComponent: () => (
    <div className="surface-card rounded-3xl p-8 text-center">
      <h2 className="text-display text-lg font-semibold">Order not found</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        We couldn't find that order in your history.
      </p>
      <Button variant="hero" className="mt-4" asChild>
        <Link to="/account/orders">Back to orders</Link>
      </Button>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div role="alert" className="surface-card rounded-3xl p-6 text-sm">
      {error.message}
    </div>
  ),
  component: OrderDetail,
});

function OrderDetail() {
  const { order } = Route.useLoaderData() as { order: Order };
  const courier = COURIERS[order.courier];
  const subtotal = order.items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = order.deliveryCharge ?? Math.max(0, order.total - subtotal);
  const [refreshedAt, setRefreshedAt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const steps = order.timeline.length;
  const completed = order.timeline.filter((e) => e.done).length;
  const progress = steps ? Math.round((completed / steps) * 100) : 0;

  function copyTracking() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(order.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  function refreshTracking() {
    setRefreshedAt(new Date().toISOString());
  }

  function downloadInvoice() {
    const lines = [
      `DADAR SHOP — INVOICE`,
      ``,
      `Order:        ${order.id}`,
      `Placed:       ${formatDate(order.placedAt)}`,
      `Payment:      ${order.paymentMethod}`,
      `Courier:      ${order.courier} (${order.trackingNumber})`,
      ``,
      `Ship to:`,
      `  ${order.shipTo.name}`,
      `  ${order.shipTo.line1}`,
      `  ${order.shipTo.area}, ${order.shipTo.city}`,
      `  ${order.shipTo.phone}`,
      ``,
      `Items:`,
      ...order.items.map(
        (i) => `  ${i.qty} × ${i.name.padEnd(36)} ${formatBDT(i.price * i.qty)}`,
      ),
      ``,
      `Subtotal:     ${formatBDT(subtotal)}`,
      `Shipping:     ${formatBDT(shipping)}`,
      `TOTAL:        ${formatBDT(order.total)}`,
      ``,
      `Thank you for shopping with Dadar Shop.`,
    ].join("\n");

    const blob = new Blob([lines], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${order.id}-invoice.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <header className="surface-card flex flex-col gap-3 rounded-3xl p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-display text-2xl font-semibold">{order.id}</h1>
          <p className="text-muted-foreground text-xs">
            Placed {formatDate(order.placedAt)} • {order.paymentMethod}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={downloadInvoice}>
            <Download className="size-4" /> Invoice
          </Button>
        </div>
      </header>

      {/* Tracking summary */}
      <section className="surface-card rounded-3xl p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-muted-foreground text-[10px] uppercase tracking-wide">
              Shipment status
            </div>
            <div className="text-display text-lg font-semibold">{order.status}</div>
            <div className="text-muted-foreground mt-0.5 text-xs">
              ETA {formatDate(order.estimatedDelivery, { hour: undefined, minute: undefined })}
            </div>
          </div>
          <div
            className="rounded-2xl px-3 py-2 text-right"
            style={{ background: `${courier.accent}14` }}
          >
            <div className="text-muted-foreground flex items-center justify-end gap-1 text-[10px] uppercase tracking-wide">
              <Truck className="size-3" /> Courier
            </div>
            <div className="text-sm font-semibold" style={{ color: courier.accent }}>
              {courier.name}
            </div>
            <button
              type="button"
              onClick={copyTracking}
              className="text-primary mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium"
            >
              {order.trackingNumber} {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
            </button>
          </div>
        </div>

        <div className="bg-surface-muted mt-4 h-2 overflow-hidden rounded-full">
          <div
            className="bg-primary h-full rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-muted-foreground mt-1 text-[11px]">
          {completed} of {steps} steps complete
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {order.deliveryAgent ? (
            <Button asChild size="sm" variant="hero">
              <a href={`tel:${order.deliveryAgent.phone}`}>
                <Phone className="size-3.5" /> Contact delivery man
              </a>
            </Button>
          ) : (
            <Button size="sm" variant="hero" disabled>
              <Phone className="size-3.5" /> Delivery man not assigned yet
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={refreshTracking}>
            <RefreshCw className="size-3.5" /> Refresh
          </Button>
          <Button size="sm" variant="outline" onClick={() => printLabel(order)}>
            <Printer className="size-3.5" /> Shipping label
          </Button>
          <a
            href={`tel:${courier.hotline}`}
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 self-center text-xs"
          >
            Hotline {courier.hotline}
          </a>
        </div>
        {refreshedAt && (
          <div className="text-muted-foreground mt-2 text-[11px]">
            Last refreshed {formatDate(refreshedAt)} — no new courier events.
          </div>
        )}
      </section>

      {/* Delivery man card */}
      {order.deliveryAgent && (
        <section className="surface-card rounded-3xl p-5">
          <h2 className="text-display mb-3 flex items-center gap-2 text-sm font-semibold">
            <Truck className="size-4" /> Your delivery man
          </h2>
          <div className="flex items-center gap-4">
            <div
              className="flex size-14 items-center justify-center rounded-full text-base font-semibold text-white"
              style={{ background: courier.accent }}
            >
              {order.deliveryAgent.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">{order.deliveryAgent.name}</div>
              <div className="text-muted-foreground text-xs">
                {order.deliveryAgent.vehicle} · {courier.name}
              </div>
              {order.deliveryAgent.rating && (
                <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-amber-600">
                  <Star className="size-3 fill-current" /> {order.deliveryAgent.rating} rider rating
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Button asChild size="sm" variant="hero">
                <a href={`tel:${order.deliveryAgent.phone}`}>
                  <Phone className="size-3.5" /> Call
                </a>
              </Button>
              <Button asChild size="sm" variant="outline">
                <a
                  href={`https://wa.me/${order.deliveryAgent.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="size-3.5" /> WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Timeline */}
      <section className="surface-card rounded-3xl p-5">
        <h2 className="text-display mb-4 flex items-center gap-2 text-sm font-semibold">
          <Package className="size-4" /> Delivery timeline
        </h2>
        <ol className="relative ml-3 space-y-5 border-l">
          {order.timeline.map((e, i) => (
            <li key={i} className="ml-4">
              <span
                className={cn(
                  "absolute -left-[9px] flex size-4 items-center justify-center rounded-full ring-4",
                  e.done
                    ? "bg-primary text-primary-foreground ring-background"
                    : "bg-surface-muted ring-background",
                )}
              >
                {e.done && <Check className="size-2.5" />}
              </span>
              <div className="flex items-baseline justify-between gap-2">
                <div
                  className={cn(
                    "text-sm font-medium",
                    !e.done && "text-muted-foreground",
                  )}
                >
                  {e.status}
                </div>
                <div className="text-muted-foreground text-[11px]">
                  {e.at ? formatDate(e.at) : "Pending"}
                </div>
              </div>
              {(e.note || e.location) && (
                <div className="text-muted-foreground mt-0.5 text-xs">
                  {[e.location, e.note].filter(Boolean).join(" • ")}
                </div>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* Courier status snapshot */}
      <section className="surface-card rounded-3xl p-5">
        <h2 className="text-display mb-3 text-sm font-semibold">Courier status</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Carrier" value={courier.name} />
          <Stat label="Tracking #" value={order.trackingNumber} />
          <Stat label="Current stage" value={order.status} />
          <Stat
            label="Zone"
            value={order.deliveryZone ? ZONE_LABEL[order.deliveryZone] : "—"}
          />
        </div>
      </section>

      {/* Items */}
      <section className="surface-card rounded-3xl p-5">
        <h2 className="text-display mb-3 text-sm font-semibold">Items</h2>
        <ul className="divide-border divide-y">
          {order.items.map((i) => (
            <li key={i.id} className="flex items-center justify-between py-3">
              <div>
                <div className="text-sm font-medium">{i.name}</div>
                <div className="text-muted-foreground text-xs">Qty {i.qty}</div>
              </div>
              <div className="text-sm font-semibold">{formatBDT(i.price * i.qty)}</div>
            </li>
          ))}
        </ul>
        <div className="border-border mt-3 space-y-1 border-t pt-3 text-sm">
          <Row label="Subtotal" value={formatBDT(subtotal)} />
          <Row
            label={`Shipping (${courier.name})`}
            value={formatBDT(shipping)}
          />
          <Row label="Total" value={formatBDT(order.total)} bold />
        </div>
      </section>

      {/* Ship to */}
      <section className="surface-card rounded-3xl p-5">
        <h2 className="text-display mb-2 flex items-center gap-2 text-sm font-semibold">
          <MapPin className="size-4" /> Shipping address
        </h2>
        <div className="text-sm leading-relaxed">
          <div className="font-medium">{order.shipTo.name}</div>
          <div className="text-muted-foreground">
            {order.shipTo.line1}
            <br />
            {order.shipTo.area}, {order.shipTo.city}
            <br />
            {order.shipTo.phone}
          </div>
        </div>
      </section>

      {/* Delivery history */}
      <section className="surface-card rounded-3xl p-5">
        <h2 className="text-display mb-3 text-sm font-semibold">Delivery history</h2>
        <ul className="text-sm">
          {order.timeline
            .filter((e) => e.done)
            .slice()
            .reverse()
            .map((e, i) => (
              <li
                key={i}
                className="border-border flex items-start justify-between gap-3 border-b py-2 last:border-0"
              >
                <div>
                  <div className="font-medium">{e.status}</div>
                  {(e.location || e.note) && (
                    <div className="text-muted-foreground text-xs">
                      {[e.location, e.note].filter(Boolean).join(" • ")}
                    </div>
                  )}
                </div>
                <div className="text-muted-foreground whitespace-nowrap text-[11px]">
                  {formatDate(e.at)}
                </div>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-muted rounded-2xl p-3">
      <div className="text-muted-foreground text-[10px] uppercase tracking-wide">
        {label}
      </div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={cn("text-muted-foreground", bold && "text-foreground font-semibold")}>
        {label}
      </span>
      <span className={cn(bold && "text-display text-base font-semibold")}>{value}</span>
    </div>
  );
}
