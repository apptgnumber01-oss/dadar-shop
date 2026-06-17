import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bell,
  Check,
  CreditCard,
  Mail,
  MessageSquare,
  Package,
  RotateCcw,
  Smartphone,
  Sparkles,
  TicketPercent,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  NOTIFICATIONS,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_CHANNEL_LABEL,
  NOTIFICATION_EVENT_LABEL,
  DEFAULT_NOTIFICATION_PREFS,
  formatDate,
  type AppNotification,
  type NotificationChannel,
  type NotificationEvent,
} from "@/data/account";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Dadar Shop" },
      {
        name: "description",
        content:
          "All in-app, email, SMS and push notifications, and channel preferences for orders, payments, refunds and coupons.",
      },
    ],
  }),
  component: NotificationsPage,
});

const KIND_ICON = {
  order: Package,
  promo: Sparkles,
  system: Bell,
  payment: CreditCard,
  refund: RotateCcw,
} as const;

const CHANNEL_ICON: Record<NotificationChannel, typeof Mail> = {
  in_app: Bell,
  email: Mail,
  sms: MessageSquare,
  push: Smartphone,
};

const EVENT_ICON: Record<NotificationEvent, typeof Bell> = {
  new_order: Package,
  payment_success: CreditCard,
  payment_failed: CreditCard,
  order_shipped: Package,
  order_delivered: Package,
  refund_approved: RotateCcw,
  coupon_available: TicketPercent,
};

type ChannelFilter = "all" | NotificationChannel;

function NotificationsPage() {
  const [items, setItems] = useState<AppNotification[]>(NOTIFICATIONS);
  const [channel, setChannel] = useState<ChannelFilter>("all");
  const [prefs, setPrefs] = useState(DEFAULT_NOTIFICATION_PREFS);

  const visible = useMemo(() => {
    if (channel === "all") return items;
    return items.filter((n) => (n.channels ?? []).includes(channel));
  }, [items, channel]);

  const unread = visible.filter((i) => i.unread).length;

  function markAll() {
    setItems((l) => l.map((n) => ({ ...n, unread: false })));
  }
  function togglePref(ev: NotificationEvent, ch: NotificationChannel) {
    setPrefs((p) => ({ ...p, [ev]: { ...p[ev], [ch]: !p[ev][ch] } }));
  }

  return (
    <div className="space-y-5">
      <header className="surface-card flex flex-col gap-3 rounded-3xl p-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-display flex items-center gap-2 text-2xl font-semibold">
            <Bell className="size-6" /> Notifications
          </h1>
          <p className="text-muted-foreground mt-1 text-xs">
            {unread} unread of {visible.length} · across in-app, email, SMS, push
          </p>
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={markAll}>
            <Check className="size-3.5" /> Mark all read
          </Button>
        )}
      </header>

      {/* Channel filter */}
      <div className="surface-card flex flex-wrap gap-1.5 rounded-3xl p-2">
        {(["all", ...NOTIFICATION_CHANNELS] as ChannelFilter[]).map((c) => {
          const Icon = c === "all" ? Bell : CHANNEL_ICON[c];
          const label = c === "all" ? "All channels" : NOTIFICATION_CHANNEL_LABEL[c];
          const active = channel === c;
          return (
            <button
              key={c}
              onClick={() => setChannel(c)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-2xl px-3 py-1.5 text-xs font-medium transition",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground hover:bg-surface-muted",
              )}
            >
              <Icon className="size-3.5" /> {label}
            </button>
          );
        })}
      </div>

      {/* Notification list */}
      <ul className="space-y-2">
        {visible.length === 0 && (
          <li className="surface-card rounded-3xl p-8 text-center">
            <Bell className="text-muted-foreground mx-auto mb-2 size-8" />
            <p className="text-muted-foreground text-sm">
              No notifications on this channel yet.
            </p>
          </li>
        )}
        {visible.map((n) => {
          const Icon = KIND_ICON[n.kind];
          return (
            <li
              key={n.id}
              className={cn(
                "surface-card flex gap-3 rounded-3xl p-4",
                n.unread && "ring-primary/30 ring-1",
              )}
            >
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-2xl",
                  n.kind === "promo"
                    ? "bg-amber/15 text-amber-foreground"
                    : n.kind === "payment"
                      ? "bg-blue-100 text-blue-700"
                      : n.kind === "refund"
                        ? "bg-teal-100 text-teal-700"
                        : n.kind === "order"
                          ? "bg-primary-soft text-primary"
                          : "bg-surface-muted text-foreground",
                )}
              >
                <Icon className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-semibold">{n.title}</div>
                  <div className="text-muted-foreground whitespace-nowrap text-[11px]">
                    {formatDate(n.at)}
                  </div>
                </div>
                <p className="text-muted-foreground mt-0.5 text-xs">{n.body}</p>
                {(n.channels?.length ?? 0) > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {n.channels!.map((c) => {
                      const CIcon = CHANNEL_ICON[c];
                      return (
                        <span
                          key={c}
                          className="bg-surface-muted text-muted-foreground inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                        >
                          <CIcon className="size-3" /> {NOTIFICATION_CHANNEL_LABEL[c]}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
              {n.unread && (
                <span className="bg-primary mt-1 size-2 shrink-0 self-start rounded-full" />
              )}
            </li>
          );
        })}
      </ul>

      {/* Preferences */}
      <section className="surface-card rounded-3xl p-5">
        <h2 className="text-display text-base font-semibold">Notification preferences</h2>
        <p className="text-muted-foreground mt-0.5 text-xs">
          Choose which channels deliver each event.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="text-muted-foreground text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-2 pr-3">Event</th>
                {NOTIFICATION_CHANNELS.map((c) => {
                  const CIcon = CHANNEL_ICON[c];
                  return (
                    <th key={c} className="px-2 text-center">
                      <span className="inline-flex items-center gap-1">
                        <CIcon className="size-3.5" />
                        {NOTIFICATION_CHANNEL_LABEL[c]}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {(Object.keys(prefs) as NotificationEvent[]).map((ev) => {
                const EvIcon = EVENT_ICON[ev];
                return (
                  <tr key={ev} className="border-border border-t">
                    <td className="py-2.5 pr-3 align-middle">
                      <span className="inline-flex items-center gap-2 font-medium">
                        <EvIcon className="text-muted-foreground size-4" />
                        {NOTIFICATION_EVENT_LABEL[ev]}
                      </span>
                    </td>
                    {NOTIFICATION_CHANNELS.map((c) => (
                      <td key={c} className="px-2 py-2.5 text-center">
                        <Switch
                          checked={prefs[ev][c]}
                          onCheckedChange={() => togglePref(ev, c)}
                          aria-label={`${NOTIFICATION_EVENT_LABEL[ev]} via ${NOTIFICATION_CHANNEL_LABEL[c]}`}
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
