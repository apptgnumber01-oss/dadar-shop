import { Instagram, Facebook, Twitter, Youtube, ShieldCheck, Truck, RotateCcw } from "lucide-react";

const cols = [
  {
    title: "Shop",
    links: ["New arrivals", "Best sellers", "Flash deals", "Brands", "Gift cards"],
  },
  {
    title: "Help",
    links: ["Order tracking", "Returns", "Shipping", "Contact us", "FAQ"],
  },
  {
    title: "Company",
    links: ["About Dadar", "Sell on Dadar", "Careers", "Press", "Sustainability"],
  },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background mt-12 rounded-t-[2rem] px-5 pb-32 pt-10">
      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        <Badge icon={Truck} label="Free delivery" sub="Over ৳1,500" />
        <Badge icon={RotateCcw} label="7-day returns" sub="No questions" />
        <Badge icon={ShieldCheck} label="Buyer safe" sub="Protected pay" />
      </div>

      <div className="mt-8 flex flex-col gap-1">
        <span className="text-serif text-2xl">Dadar</span>
        <span className="text-amber text-[10px] font-semibold uppercase tracking-[0.22em]">
          Shop
        </span>
        <p className="mt-3 max-w-[28ch] text-[13px] leading-relaxed opacity-70">
          A premium marketplace for Bangladesh — curated, verified, delivered with care.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-7 sm:grid-cols-3">
        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber">
              {c.title}
            </h4>
            <ul className="mt-3 space-y-2">
              {c.links.map((l) => (
                <li key={l}>
                  <a className="text-[14px] opacity-85 hover:opacity-100" href="#">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-9 flex items-center gap-2">
        {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
          <a
            key={i}
            href="#"
            className="tap-scale tap-scale-active flex size-10 items-center justify-center rounded-pill border border-white/15 hover:bg-white/10"
            aria-label="social"
          >
            <Icon className="size-4" strokeWidth={2} />
          </a>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-[11px] opacity-70">
        <span>© 2026 Dadar Shop Ltd.</span>
        <div className="flex gap-4">
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </footer>
  );
}

function Badge({
  icon: Icon,
  label,
  sub,
}: {
  icon: typeof Truck;
  label: string;
  sub: string;
}) {
  return (
    <div className="flex flex-1 items-center gap-2">
      <span className="bg-amber/15 text-amber flex size-9 shrink-0 items-center justify-center rounded-pill">
        <Icon className="size-4" strokeWidth={2.2} />
      </span>
      <div className="min-w-0 leading-tight">
        <p className="text-[12px] font-medium">{label}</p>
        <p className="truncate text-[10px] opacity-60">{sub}</p>
      </div>
    </div>
  );
}
