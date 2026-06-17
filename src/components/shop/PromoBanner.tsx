import { ArrowUpRight } from "lucide-react";
import bannerSale from "@/assets/banner-sale.jpg";

export function PromoBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl shadow-card">
      <img
        src={bannerSale}
        alt=""
        className="absolute inset-0 size-full object-cover"
        width={1280}
        height={768}
      />
      <div className="bg-gradient-to-r from-primary/85 via-primary/55 to-transparent absolute inset-0" />
      <div className="relative flex items-center justify-between gap-4 p-5">
        <div className="text-primary-foreground max-w-[60%]">
          <span className="bg-amber text-amber-foreground inline-flex rounded-pill px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider">
            Final Sale
          </span>
          <h2 className="text-display mt-3 text-2xl leading-tight">
            Up to <span className="tabular-nums">60%</span> off Eid Edit
          </h2>
          <p className="mt-1.5 text-[13px] opacity-90">
            Curated picks from verified sellers. Limited time.
          </p>
        </div>
        <button
          aria-label="Shop the sale"
          className="bg-amber text-amber-foreground tap-scale tap-scale-active flex size-12 shrink-0 items-center justify-center rounded-pill shadow-float"
        >
          <ArrowUpRight className="size-5" strokeWidth={2.4} />
        </button>
      </div>
      <div className="absolute bottom-3 left-5 flex gap-1.5">
        <span className="bg-primary-foreground/90 size-1.5 rounded-full" />
        <span className="bg-primary-foreground/40 size-1.5 rounded-full" />
        <span className="bg-primary-foreground/40 size-1.5 rounded-full" />
      </div>
    </div>
  );
}
