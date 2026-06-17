import { createFileRoute } from "@tanstack/react-router";
import {
  Laptop, Headphones, ShoppingBag, Shirt, Gift, HeartPulse, Watch, Sparkles,
  ChevronRight, Mail, Flame, TrendingUp, Leaf,
} from "lucide-react";

import { StickyHeader } from "@/components/shop/StickyHeader";
import { HeroSlider } from "@/components/shop/HeroSlider";
import { FlashSale } from "@/components/shop/FlashSale";
import { CategoryCard } from "@/components/shop/CategoryCard";
import { ProductCard, type Product } from "@/components/shop/ProductCard";
import { CustomerReviews } from "@/components/shop/CustomerReviews";
import { Footer } from "@/components/shop/Footer";
import { FloatingBottomNav } from "@/components/shop/FloatingBottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import productWatch from "@/assets/product-watch.jpg";
import productBag from "@/assets/product-bag.jpg";
import productHeadphones from "@/assets/product-headphones.jpg";
import productSneaker from "@/assets/product-sneaker.jpg";
import productSaree from "@/assets/product-saree.jpg";
import productSkincare from "@/assets/product-skincare.jpg";
import productSweater from "@/assets/product-sweater.jpg";
import productSunglasses from "@/assets/product-sunglasses.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dadar Shop — Shop Anything, Beautifully" },
      {
        name: "description",
        content:
          "A premium mobile-first marketplace. Curated products, verified sellers, fast delivery across Bangladesh.",
      },
      { property: "og:title", content: "Dadar Shop" },
      { property: "og:description", content: "Curated, verified, delivered." },
    ],
  }),
  component: Home,
});

const categories = [
  { label: "Electronics", icon: Laptop, count: 1240, tone: "primary" as const, href: "/shop/electronics" },
  { label: "Accessories", icon: Headphones, count: 890, href: "/shop/electronics" },
  { label: "Bags", icon: ShoppingBag, count: 412, tone: "amber" as const, href: "/shop/bags" },
  { label: "Sharee", icon: Shirt, count: 728, href: "/shop/fashion" },
  { label: "Weddings", icon: Sparkles, count: 156, tone: "coral" as const, href: "/shop/weddings" },
  { label: "Health", icon: HeartPulse, count: 304, href: "/shop/beauty" },
  { label: "Gifts", icon: Gift, count: 522, href: "/shop/weddings" },
  { label: "Watches", icon: Watch, count: 198, href: "/shop/watches" },
];


const flashProducts: Product[] = [
  { id: "f1", name: "Onyx Analog Watch", image: productWatch, price: 4290, originalPrice: 6900, rating: 4.8, reviews: 312, badge: "-38%" },
  { id: "f2", name: "Wireless Headphones", image: productHeadphones, price: 5490, originalPrice: 7200, rating: 4.7, reviews: 1042, badge: "Hot" },
  { id: "f3", name: "Tortoise Sunglasses", image: productSunglasses, price: 2190, originalPrice: 3500, rating: 4.6, reviews: 188 },
  { id: "f4", name: "Skincare Trio", image: productSkincare, price: 3290, originalPrice: 4900, rating: 4.9, reviews: 421 },
];

const featured: Product[] = [
  { id: "p1", name: "Emerald Leather Tote", image: productBag, price: 7850, originalPrice: 9800, rating: 4.9, reviews: 184, seller: "Maison Dhaka", badge: "Editor's pick" },
  { id: "p2", name: "Minimalist Analog Watch", image: productWatch, price: 4290, originalPrice: 6900, rating: 4.8, reviews: 312, seller: "Tempora Studio" },
  { id: "p3", name: "Over-Ear Headphones", image: productHeadphones, price: 5490, originalPrice: 7200, rating: 4.7, reviews: 1042, seller: "Acoustica BD" },
  { id: "p4", name: "Cloud Runner Sneakers", image: productSneaker, price: 3990, rating: 4.6, reviews: 271, seller: "Pace & Co." },
];

const bestSellers: Product[] = [
  { id: "b1", name: "Banarasi Silk Saree — Burgundy", image: productSaree, price: 8900, originalPrice: 12000, rating: 4.9, reviews: 612, seller: "Maison Dhaka", badge: "#1 in Sharee" },
  { id: "b2", name: "Cashmere Knit Sweater", image: productSweater, price: 4650, originalPrice: 6200, rating: 4.8, reviews: 308, seller: "Oat & Wool" },
  { id: "b3", name: "Hydration Skincare Trio", image: productSkincare, price: 3290, originalPrice: 4900, rating: 4.9, reviews: 421, seller: "Mira Beauty" },
  { id: "b4", name: "Tortoiseshell Sunglasses", image: productSunglasses, price: 2190, rating: 4.6, reviews: 188, seller: "Lensoria" },
];

const newArrivals: Product[] = [
  { id: "n1", name: "Cashmere Knit Sweater", image: productSweater, price: 4650, rating: 4.8, reviews: 12, seller: "Oat & Wool", badge: "New" },
  { id: "n2", name: "Tortoise Sunglasses", image: productSunglasses, price: 2190, rating: 4.6, reviews: 8, seller: "Lensoria", badge: "New" },
  { id: "n3", name: "Skincare Trio", image: productSkincare, price: 3290, rating: 4.9, reviews: 5, seller: "Mira", badge: "New" },
  { id: "n4", name: "Emerald Leather Tote", image: productBag, price: 7850, rating: 4.9, reviews: 3, seller: "Maison", badge: "New" },
];

const brands = [
  { name: "Maison Dhaka", tag: "Heritage textiles" },
  { name: "Tempora", tag: "Modern watches" },
  { name: "Acoustica", tag: "Audio engineering" },
  { name: "Mira Beauty", tag: "Clean skincare" },
  { name: "Oat & Wool", tag: "Slow knitwear" },
  { name: "Lensoria", tag: "Eyewear studio" },
];

function Home() {
  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-[440px]">
        <StickyHeader />

        {/* Greeting / Hero */}
        <section className="px-5 pt-5">
          <p className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
            Good evening
          </p>
          <h1 className="text-display mt-1 text-[26px] leading-[1.1]">
            Shop anything,
            <span className="text-serif text-primary italic font-normal"> beautifully</span>.
          </h1>
        </section>

        <section className="mt-5 px-5">
          <HeroSlider />
        </section>

        {/* Flash sale */}
        <section className="mt-7 px-5">
          <FlashSale products={flashProducts} />
        </section>

        {/* Categories */}
        <section className="mt-9 px-5">
          <SectionHeader
            kicker="Browse"
            title="Shop by category"
            subtitle="Eight worlds, one marketplace"
          />
          <div className="mt-4 grid grid-cols-4 gap-y-5">
            {categories.map((c) => (
              <CategoryCard key={c.label} {...c} />
            ))}
          </div>
        </section>

        {/* Featured */}
        <section className="mt-10 px-5">
          <SectionHeader
            kicker={<><Sparkles className="size-3" /> Featured</>}
            title="Picked by our editors"
            subtitle="Limited-run finds we love this week"
          />
          <div className="mt-4 grid grid-cols-2 gap-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Best sellers — horizontal */}
        <section className="mt-10">
          <div className="px-5">
            <SectionHeader
              kicker={<><TrendingUp className="size-3" /> Best sellers</>}
              title="Most-loved this month"
              subtitle="What Bangladesh is buying"
            />
          </div>
          <div className="hide-scrollbar mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1">
            {bestSellers.map((p) => (
              <div key={p.id} className="w-[180px] shrink-0 snap-start">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>

        {/* New arrivals */}
        <section className="mt-10 px-5">
          <SectionHeader
            kicker={<><Leaf className="size-3" /> Just landed</>}
            title="New arrivals"
            subtitle="Fresh drops, updated daily"
          />
          <div className="mt-4 grid grid-cols-2 gap-3">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Brands */}
        <section className="mt-10 px-5">
          <SectionHeader
            kicker={<><Flame className="size-3" /> Brands</>}
            title="Verified makers"
            subtitle="Independent studios, vetted in person"
          />
          <div className="hide-scrollbar -mx-5 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5">
            {brands.map((b, i) => (
              <div
                key={b.name}
                className="surface-card tap-scale tap-scale-active flex w-[160px] shrink-0 snap-start flex-col items-start gap-3 rounded-3xl p-4"
              >
                <div
                  className={
                    "flex size-12 items-center justify-center rounded-2xl text-display text-base font-semibold " +
                    (i % 3 === 0
                      ? "bg-primary text-primary-foreground"
                      : i % 3 === 1
                        ? "bg-amber-gradient text-amber-foreground"
                        : "bg-primary-soft text-primary")
                  }
                >
                  {b.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="text-[14px] font-semibold leading-tight">{b.name}</p>
                  <p className="text-[11px] text-muted-foreground">{b.tag}</p>
                </div>
                <span className="text-primary mt-auto inline-flex items-center text-[12px] font-medium">
                  Visit store <ChevronRight className="size-3.5" />
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="mt-10">
          <div className="px-5">
            <SectionHeader
              kicker="Loved by 240k+ shoppers"
              title="From our customers"
              subtitle="Verified reviews from real orders"
            />
          </div>
          <div className="mt-4">
            <CustomerReviews />
          </div>
        </section>

        {/* Newsletter */}
        <section className="mt-10 px-5">
          <div className="bg-hero-gradient text-primary-foreground relative overflow-hidden rounded-3xl p-6 shadow-card">
            <div className="bg-amber/25 absolute -right-10 -top-10 size-40 rounded-full blur-3xl" />
            <span className="bg-amber text-amber-foreground inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider">
              <Mail className="size-3" /> Dadar Letter
            </span>
            <h3 className="text-display mt-3 text-xl font-semibold leading-tight">
              Early access to weekly drops
            </h3>
            <p className="mt-1.5 text-[13px] opacity-85">
              Member-only pricing, flash deals & curated editorials. One email a week, never spam.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-4 flex gap-2"
            >
              <Input
                type="email"
                required
                placeholder="you@example.com"
                className="bg-white/12 border-white/20 text-primary-foreground placeholder:text-white/55 focus-visible:border-white/60 focus-visible:ring-white/20"
              />
              <Button type="submit" variant="amber" size="default">
                Join
              </Button>
            </form>
            <p className="mt-3 text-[10px] opacity-70">
              By subscribing you agree to our Privacy Policy.
            </p>
          </div>
        </section>

        <Footer />
      </div>

      <FloatingBottomNav />
    </div>
  );
}

function SectionHeader({
  kicker,
  title,
  subtitle,
}: {
  kicker?: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="flex items-end justify-between gap-3">
      <div className="min-w-0">
        {kicker && (
          <span className="text-primary inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em]">
            {kicker}
          </span>
        )}
        <h2 className="text-display mt-1 text-xl font-semibold leading-tight">{title}</h2>
        {subtitle && (
          <p className="text-[12px] text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <button className="text-primary shrink-0 inline-flex items-center gap-0.5 text-[13px] font-medium">
        See all <ChevronRight className="size-4" />
      </button>
    </header>
  );
}
