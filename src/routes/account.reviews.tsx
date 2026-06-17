import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Flag,
  Image as ImageIcon,
  PlayCircle,
  Star,
  ThumbsUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { REVIEWS, formatDay, type Review } from "@/data/account";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/reviews")({
  head: () => ({
    meta: [
      { title: "Your reviews — Dadar Shop" },
      {
        name: "description",
        content:
          "All reviews you've posted with star ratings, photos, videos, verified-purchase badge and moderation status.",
      },
    ],
  }),
  component: ReviewsPage,
});

type StatusFilter = "all" | "Published" | "Pending" | "Rejected";

const STATUS_TONE: Record<Review["status"], string> = {
  Published: "bg-emerald-100 text-emerald-800",
  Pending: "bg-amber-100 text-amber-800",
  Rejected: "bg-rose-100 text-rose-800",
};

function ReviewsPage() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [items, setItems] = useState<Review[]>(REVIEWS);

  const visible = useMemo(
    () => (filter === "all" ? items : items.filter((r) => r.status === filter)),
    [items, filter],
  );

  const avg = useMemo(() => {
    if (items.length === 0) return 0;
    return items.reduce((s, r) => s + r.rating, 0) / items.length;
  }, [items]);

  function like(id: string) {
    setItems((l) =>
      l.map((r) => (r.id === id ? { ...r, likes: (r.likes ?? 0) + 1 } : r)),
    );
  }
  function report(id: string) {
    setItems((l) =>
      l.map((r) => (r.id === id ? { ...r, reports: (r.reports ?? 0) + 1 } : r)),
    );
  }

  const FILTERS: { id: StatusFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "Published", label: "Published" },
    { id: "Pending", label: "Pending review" },
    { id: "Rejected", label: "Rejected" },
  ];

  return (
    <div className="space-y-4">
      <header className="surface-card flex flex-col gap-3 rounded-3xl p-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-display flex items-center gap-2 text-2xl font-semibold">
            <Star className="fill-amber text-amber size-6" /> Your reviews
          </h1>
          <p className="text-muted-foreground mt-0.5 text-xs">
            {items.length} posted · avg{" "}
            <span className="text-foreground font-semibold">{avg.toFixed(1)}</span>★
          </p>
        </div>
      </header>

      <div className="surface-card flex flex-wrap gap-1.5 rounded-3xl p-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "shrink-0 rounded-2xl px-3 py-1.5 text-xs font-medium transition",
              filter === f.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground hover:bg-surface-muted",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {visible.length === 0 && (
          <li className="surface-card rounded-3xl p-8 text-center">
            <Star className="text-muted-foreground mx-auto mb-2 size-8" />
            <p className="text-muted-foreground text-sm">No reviews in this filter.</p>
          </li>
        )}
        {visible.map((r) => (
          <li key={r.id} className="surface-card rounded-3xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold">{r.productName}</div>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "size-3.5",
                          i < r.rating
                            ? "fill-amber text-amber"
                            : "text-muted-foreground/40",
                        )}
                      />
                    ))}
                  </div>
                  {r.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                      <BadgeCheck className="size-3" /> Verified purchase
                    </span>
                  )}
                </div>
              </div>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                  STATUS_TONE[r.status],
                )}
              >
                {r.status}
              </span>
            </div>

            {r.title && (
              <h3 className="mt-2 text-sm font-semibold">{r.title}</h3>
            )}
            <p className="text-muted-foreground mt-1 text-sm">{r.comment}</p>

            {(r.photos?.length || r.videos?.length) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {r.photos?.map((src, i) => (
                  <div
                    key={`p-${i}`}
                    className="bg-surface-muted relative size-20 overflow-hidden rounded-2xl"
                  >
                    <img
                      src={src}
                      alt={`Review photo ${i + 1}`}
                      className="size-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
                {r.videos?.map((src, i) => (
                  <div
                    key={`v-${i}`}
                    className="bg-surface-muted relative flex size-20 items-center justify-center overflow-hidden rounded-2xl"
                  >
                    <video src={src} className="size-full object-cover" muted />
                    <PlayCircle className="absolute size-7 text-white drop-shadow" />
                  </div>
                ))}
              </div>
            )}

            <div className="text-muted-foreground mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <span>Posted {formatDay(r.at)}</span>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 gap-1 px-2"
                  onClick={() => like(r.id)}
                >
                  <ThumbsUp className="size-3.5" /> {r.likes ?? 0}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 gap-1 px-2"
                  onClick={() => report(r.id)}
                >
                  <Flag className="size-3.5" /> Report ({r.reports ?? 0})
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <section className="surface-card rounded-3xl p-5">
        <h2 className="text-display text-base font-semibold">Write a new review</h2>
        <p className="text-muted-foreground mt-0.5 text-xs">
          Add star rating, write your experience, attach photos or a short video.
          Reviews from delivered orders get a verified-purchase badge.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="hero" size="sm">
            <Star className="size-3.5" /> New review
          </Button>
          <Button variant="outline" size="sm">
            <ImageIcon className="size-3.5" /> Add photos
          </Button>
          <Button variant="outline" size="sm">
            <PlayCircle className="size-3.5" /> Add video
          </Button>
        </div>
      </section>
    </div>
  );
}
