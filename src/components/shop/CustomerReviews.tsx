import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
  name: string;
  initials: string;
  location: string;
  rating: number;
  text: string;
  product: string;
  tone: "primary" | "amber" | "coral";
}

const reviews: Review[] = [
  {
    name: "Nusrat A.",
    initials: "NA",
    location: "Dhaka",
    rating: 5,
    text: "The saree arrived in beautiful packaging — quality far exceeded the price. Felt like a boutique experience.",
    product: "Silk Saree, Maison Dhaka",
    tone: "primary",
  },
  {
    name: "Tanvir H.",
    initials: "TH",
    location: "Chittagong",
    rating: 5,
    text: "Delivery was next-day and the watch is exactly as pictured. The seller chat was instant.",
    product: "Onyx Watch, Tempora",
    tone: "amber",
  },
  {
    name: "Rumana K.",
    initials: "RK",
    location: "Sylhet",
    rating: 4,
    text: "Great curation — finally a Bangladeshi marketplace that feels designed, not just functional.",
    product: "Cashmere Sweater",
    tone: "coral",
  },
];

const toneBg = {
  primary: "bg-primary-soft text-primary",
  amber: "bg-amber/20 text-amber-foreground",
  coral: "bg-coral/15 text-coral",
} as const;

export function CustomerReviews() {
  return (
    <div className="hide-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5">
      {reviews.map((r) => (
        <article
          key={r.name}
          className="surface-card relative w-[280px] shrink-0 snap-start rounded-3xl p-5"
        >
          <Quote className="text-primary/15 absolute right-4 top-4 size-8" strokeWidth={1.5} />
          <div className="flex items-center gap-1 text-amber">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "size-3.5",
                  i < r.rating ? "fill-amber text-amber" : "text-muted-foreground/30",
                )}
                strokeWidth={0}
              />
            ))}
          </div>
          <p className="text-foreground/85 mt-3 text-[13px] leading-relaxed">
            “{r.text}”
          </p>
          <div className="border-border mt-4 flex items-center gap-3 border-t pt-3">
            <div
              className={cn(
                "flex size-9 items-center justify-center rounded-full text-[12px] font-semibold",
                toneBg[r.tone],
              )}
            >
              {r.initials}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-medium leading-tight">{r.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">
                {r.location} · {r.product}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
