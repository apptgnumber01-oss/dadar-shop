import { useEffect, useState } from "react";
import { Zap, ChevronRight } from "lucide-react";
import { ProductCard, type Product } from "./ProductCard";

interface FlashSaleProps {
  products: Product[];
  endsInSeconds?: number;
}

export function FlashSale({ products, endsInSeconds = 6 * 3600 + 42 * 60 + 17 }: FlashSaleProps) {
  const [t, setT] = useState(endsInSeconds);
  useEffect(() => {
    const id = setInterval(() => setT((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <section className="bg-foreground text-background relative overflow-hidden rounded-3xl p-5 shadow-card">
      <div className="bg-amber/15 absolute -right-12 -top-12 size-48 rounded-full blur-3xl" />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-amber text-amber-foreground flex size-8 items-center justify-center rounded-pill">
            <Zap className="size-4 fill-amber-foreground" strokeWidth={0} />
          </span>
          <div>
            <h2 className="text-display text-base font-semibold leading-none">Flash Sale</h2>
            <p className="text-[11px] opacity-70">Limited drops, hourly</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {[pad(h), pad(m), pad(s)].map((v, idx) => (
            <span key={idx} className="flex items-center gap-1.5">
              <span className="bg-background/10 text-background flex h-8 min-w-8 items-center justify-center rounded-lg px-1.5 font-mono text-[13px] font-semibold tabular-nums">
                {v}
              </span>
              {idx < 2 && <span className="text-background/40 text-xs">:</span>}
            </span>
          ))}
        </div>
      </div>

      <div className="hide-scrollbar relative -mx-5 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5">
        {products.map((p) => (
          <div key={p.id} className="w-[160px] shrink-0 snap-start">
            <ProductCard product={p} />
          </div>
        ))}
        <button className="bg-background/10 text-background tap-scale tap-scale-active flex w-[100px] shrink-0 snap-start flex-col items-center justify-center gap-2 rounded-3xl px-4 text-[12px] font-medium">
          See all <ChevronRight className="size-4" />
        </button>
      </div>
    </section>
  );
}
