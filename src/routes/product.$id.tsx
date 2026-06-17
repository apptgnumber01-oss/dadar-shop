import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft, Heart, Share2, Star, ShieldCheck, Truck, RotateCcw,
  Minus, Plus, ShoppingBag, Zap, Play, ChevronRight, Check, MessageCircle,
} from "lucide-react";

import { PRODUCTS, type CatalogProduct } from "@/data/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsWishlisted, useShopActions } from "@/lib/shopStore";
import { useAuth } from "@/lib/authStore";
import { toast } from "sonner";
import { ReviewWriter } from "@/components/shop/ReviewWriter";

import productWatch from "@/assets/product-watch.jpg";
import productBag from "@/assets/product-bag.jpg";
import productHeadphones from "@/assets/product-headphones.jpg";
import productSneaker from "@/assets/product-sneaker.jpg";

const fallbackGallery = [productWatch, productBag, productHeadphones, productSneaker];

export const Route = createFileRoute("/product/$id")({
  beforeLoad: ({ params }) => {
    if (!PRODUCTS.some((p) => p.id === params.id)) throw notFound();
  },
  head: ({ params }) => {
    const p = PRODUCTS.find((x) => x.id === params.id);
    return {
      meta: [
        { title: `${p?.name ?? "Product"} — Dadar Shop` },
        { name: "description", content: `${p?.name} by ${p?.brand}. Buy now on Dadar Shop with free delivery.` },
        { property: "og:title", content: `${p?.name} — Dadar Shop` },
        { property: "og:image", content: p?.image ?? "" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="bg-background flex min-h-screen items-center justify-center px-5 text-center">
      <div>
        <h1 className="text-display text-2xl font-semibold">Product not found</h1>
        <Link to="/shop" className="text-primary mt-3 inline-block text-sm underline">
          Back to shop
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="bg-background flex min-h-screen items-center justify-center px-5 text-center">
      <button onClick={reset} className="text-primary text-sm font-medium underline">
        Try again
      </button>
    </div>
  ),
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { id } = Route.useParams();
  const router = useRouter();
  const product = useMemo(() => PRODUCTS.find((p) => p.id === id)!, [id]);

  const gallery = useMemo(() => {
    const others = fallbackGallery.filter((src) => src !== product.image);
    return [product.image, ...others].slice(0, 4);
  }, [product]);

  const [activeImg, setActiveImg] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [videoOpen, setVideoOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const liked = useIsWishlisted(product.id);
  const { addToCart, toggleWishlist } = useShopActions();
  const { isAuthenticated } = useAuth();
  const [variant, setVariant] = useState("M");
  const [color, setColor] = useState(0);
  const [tab, setTab] = useState<"specs" | "reviews">("specs");

  const requireAuth = (next: string): boolean => {
    if (isAuthenticated) return true;
    toast.error("Please sign in to continue");
    router.navigate({ to: "/auth/login", search: { redirect: next } as never });
    return false;
  };

  const handleAddToCart = () => {
    if (!requireAuth(`/product/${product.id}`)) return;
    addToCart(product.id, qty);
    toast.success("Added to your cart");
  };

  const handleBuyNow = () => {
    if (!requireAuth(`/product/${product.id}`)) return;
    addToCart(product.id, qty);
    router.navigate({ to: "/cart" });
  };

  const handleToggleWishlist = () => {
    if (!requireAuth(`/product/${product.id}`)) return;
    toggleWishlist(product.id);
  };

  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id,
  ).slice(0, 4);

  const fbt = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 2);
  const fbtTotal = product.price + fbt.reduce((s, p) => s + p.price, 0);
  const [fbtChecked, setFbtChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(fbt.map((p) => [p.id, true])),
  );
  const fbtSelectedTotal =
    product.price + fbt.filter((p) => fbtChecked[p.id]).reduce((s, p) => s + p.price, 0);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const colors = ["#1d3a2e", "#caa472", "#d97757", "#1a1a1a"];
  const sizes = ["S", "M", "L", "XL"];

  const specs = [
    { k: "Brand", v: product.brand },
    { k: "Category", v: product.category },
    { k: "Subcategory", v: product.subcategory },
    { k: "Material", v: "Premium grade, ethically sourced" },
    { k: "Origin", v: "Made in Bangladesh" },
    { k: "Warranty", v: "1 year manufacturer warranty" },
    { k: "Delivery", v: "Free across Dhaka · 1–3 days" },
  ];

  const reviewSummary = [
    { stars: 5, pct: 78 },
    { stars: 4, pct: 16 },
    { stars: 3, pct: 4 },
    { stars: 2, pct: 1 },
    { stars: 1, pct: 1 },
  ];

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url });
      } catch { /* dismissed */ }
    } else {
      await navigator.clipboard?.writeText(url);
    }
  };

  return (
    <div className="bg-background min-h-screen pb-32">
      <div className="mx-auto w-full max-w-[440px]">
        {/* Floating top bar */}
        <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center">
          <div className="pointer-events-auto mx-auto flex w-full max-w-[440px] items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <button
              aria-label="Back"
              onClick={() => router.history.back()}
              className="glass-strong tap-scale tap-scale-active flex size-10 items-center justify-center rounded-pill"
            >
              <ArrowLeft className="size-5" strokeWidth={2.25} />
            </button>
            <div className="flex items-center gap-1.5">
              <button
                aria-label="Share"
                onClick={handleShare}
                className="glass-strong tap-scale tap-scale-active flex size-10 items-center justify-center rounded-pill"
              >
                <Share2 className="size-[18px]" strokeWidth={2.25} />
              </button>
              <button
                aria-label="Wishlist"
                onClick={handleToggleWishlist}
                className="glass-strong tap-scale tap-scale-active flex size-10 items-center justify-center rounded-pill"
              >
                <Heart
                  className={cn("size-[18px] transition-colors", liked ? "fill-coral text-coral" : "text-foreground")}
                  strokeWidth={2.25}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <section className="bg-surface-muted relative">
          <div
            className="relative aspect-square w-full overflow-hidden"
            onMouseMove={(e) => {
              const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
              setZoomPos({
                x: ((e.clientX - r.left) / r.width) * 100,
                y: ((e.clientY - r.top) / r.height) * 100,
              });
            }}
            onMouseEnter={() => setZoomed(true)}
            onMouseLeave={() => setZoomed(false)}
            onClick={() => setZoomed((v) => !v)}
          >
            <img
              src={gallery[activeImg]}
              alt={product.name}
              className={cn(
                "size-full object-cover transition-transform duration-300",
                zoomed ? "scale-[2]" : "scale-100",
              )}
              style={zoomed ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined}
            />
            {discount && (
              <span className="bg-coral text-coral-foreground absolute left-4 top-20 rounded-pill px-2.5 py-1 text-[11px] font-semibold tabular-nums">
                -{discount}% OFF
              </span>
            )}
            <button
              aria-label="Play product video"
              onClick={(e) => { e.stopPropagation(); setVideoOpen(true); }}
              className="glass-strong tap-scale tap-scale-active absolute bottom-4 left-4 flex items-center gap-2 rounded-pill px-3 py-2 text-[12px] font-medium"
            >
              <span className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-full">
                <Play className="size-3 fill-current" strokeWidth={0} />
              </span>
              Watch
            </button>
            <div className="glass-strong absolute bottom-4 right-4 rounded-pill px-2.5 py-1 text-[11px] font-medium tabular-nums">
              {activeImg + 1} / {gallery.length}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto px-5 pb-4 pt-3 hide-scrollbar">
            {gallery.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={cn(
                  "tap-scale tap-scale-active relative size-16 shrink-0 overflow-hidden rounded-2xl border-2 transition-colors",
                  i === activeImg ? "border-primary" : "border-border",
                )}
              >
                <img src={src} alt="" className="size-full object-cover" />
              </button>
            ))}
            <button
              onClick={() => setVideoOpen(true)}
              className="tap-scale tap-scale-active bg-foreground/85 relative flex size-16 shrink-0 items-center justify-center rounded-2xl text-background"
            >
              <Play className="size-5 fill-current" strokeWidth={0} />
            </button>
          </div>
        </section>

        {/* Title block */}
        <section className="px-5 pt-2">
          <div className="flex items-center gap-2">
            <span className="bg-primary-soft text-primary rounded-pill px-2 py-0.5 text-[11px] font-medium">
              {product.brand}
            </span>
            {product.badge && (
              <span className="bg-amber/20 text-amber-foreground rounded-pill px-2 py-0.5 text-[11px] font-medium">
                {product.badge}
              </span>
            )}
          </div>
          <h1 className="text-display mt-2 text-[22px] font-semibold leading-tight">
            {product.name}
          </h1>

          <div className="mt-2 flex items-center gap-3 text-[13px]">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "size-3.5",
                    i < Math.round(product.rating) ? "fill-amber text-amber" : "text-muted-foreground/30",
                  )}
                  strokeWidth={0}
                />
              ))}
              <span className="ml-1 font-medium tabular-nums">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-muted-foreground">·</span>
            <button
              onClick={() => setTab("reviews")}
              className="text-muted-foreground tabular-nums hover:text-foreground"
            >
              {product.reviews} reviews
            </button>
            <span className="text-muted-foreground">·</span>
            <span className="text-success font-medium">In stock</span>
          </div>

          <div className="mt-4 flex items-end gap-3">
            <span className="text-display text-[28px] font-semibold tabular-nums">
              ৳{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-muted-foreground pb-1 text-[14px] line-through tabular-nums">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
                {discount && (
                  <span className="text-coral pb-1 text-[13px] font-semibold">
                    Save {discount}%
                  </span>
                )}
              </>
            )}
          </div>
        </section>

        {/* Variants */}
        <section className="mt-5 px-5">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-medium">Color</p>
              <p className="text-muted-foreground text-[12px]">4 options</p>
            </div>
            <div className="mt-2 flex gap-2.5">
              {colors.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setColor(i)}
                  className={cn(
                    "tap-scale tap-scale-active relative size-10 rounded-full ring-offset-2 ring-offset-background",
                    color === i ? "ring-2 ring-primary" : "ring-1 ring-border",
                  )}
                  style={{ backgroundColor: c }}
                  aria-label={`Color ${i + 1}`}
                >
                  {color === i && (
                    <Check className="absolute inset-0 m-auto size-4 text-white drop-shadow" strokeWidth={3} />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-medium">Size</p>
              <button className="text-primary text-[12px] font-medium">Size guide</button>
            </div>
            <div className="mt-2 flex gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setVariant(s)}
                  className={cn(
                    "tap-scale tap-scale-active h-10 min-w-12 rounded-2xl border px-3 text-[13px] font-medium transition-colors",
                    variant === s
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-surface text-foreground",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-[13px] font-medium">Quantity</p>
            <div className="mt-2 inline-flex items-center gap-1 rounded-pill border border-border bg-surface p-1">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="tap-scale tap-scale-active flex size-9 items-center justify-center rounded-full"
                aria-label="Decrease"
              >
                <Minus className="size-4" strokeWidth={2.25} />
              </button>
              <span className="min-w-8 text-center text-[14px] font-semibold tabular-nums">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="tap-scale tap-scale-active bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-full"
                aria-label="Increase"
              >
                <Plus className="size-4" strokeWidth={2.25} />
              </button>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section className="mt-6 px-5">
          <div className="surface-card grid grid-cols-3 gap-2 rounded-2xl p-3 text-center">
            {[
              { icon: Truck, label: "Free delivery" },
              { icon: RotateCcw, label: "7-day returns" },
              { icon: ShieldCheck, label: "Verified seller" },
            ].map(({ icon: I, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <I className="text-primary size-4" strokeWidth={2.25} />
                <span className="text-[11px] font-medium leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Tabs: Specs / Reviews */}
        <section className="mt-7 px-5">
          <div className="border-border flex gap-6 border-b">
            {(["specs", "reviews"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "relative -mb-px py-2 text-[14px] font-medium capitalize transition-colors",
                  tab === t ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {t === "specs" ? "Specifications" : "Reviews"}
                {tab === t && (
                  <span className="bg-primary absolute inset-x-0 -bottom-px h-0.5 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {tab === "specs" ? (
            <div className="mt-3">
              <p className="text-foreground/80 text-[13px] leading-relaxed">
                A meticulously crafted {product.name.toLowerCase()} from {product.brand}.
                Designed for everyday excellence with premium materials and a refined finish.
              </p>
              <dl className="surface-card mt-3 divide-y divide-border rounded-2xl p-1">
                {specs.map((s) => (
                  <div key={s.k} className="flex items-start justify-between gap-4 px-3 py-2.5">
                    <dt className="text-muted-foreground text-[12px]">{s.k}</dt>
                    <dd className="text-foreground text-right text-[13px] font-medium">{s.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : (
            <div className="mt-3">
              <div className="surface-card flex items-center gap-4 rounded-2xl p-4">
                <div className="text-center">
                  <p className="text-display text-3xl font-semibold tabular-nums">
                    {product.rating.toFixed(1)}
                  </p>
                  <div className="mt-1 flex justify-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "size-3",
                          i < Math.round(product.rating) ? "fill-amber text-amber" : "text-muted-foreground/30",
                        )}
                        strokeWidth={0}
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mt-1 text-[11px] tabular-nums">
                    {product.reviews} reviews
                  </p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {reviewSummary.map((r) => (
                    <div key={r.stars} className="flex items-center gap-2">
                      <span className="text-muted-foreground w-3 text-[11px] tabular-nums">{r.stars}</span>
                      <div className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full">
                        <div className="bg-amber h-full rounded-full" style={{ width: `${r.pct}%` }} />
                      </div>
                      <span className="text-muted-foreground w-8 text-right text-[11px] tabular-nums">{r.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 space-y-3">
                {[
                  { name: "Nusrat A.", rating: 5, text: "Exactly as pictured. Premium packaging too — felt like opening an Apple box.", date: "2 weeks ago" },
                  { name: "Tanvir H.", rating: 5, text: "Worth every taka. Fast delivery and the seller was super responsive.", date: "1 month ago" },
                  { name: "Rumana K.", rating: 4, text: "Great quality. Slightly different shade than the photo but still beautiful.", date: "1 month ago" },
                ].map((r, i) => (
                  <article key={i} className="surface-card rounded-2xl p-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary-soft text-primary flex size-8 items-center justify-center rounded-full text-[11px] font-semibold">
                          {r.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-[13px] font-medium leading-tight">{r.name}</p>
                          <p className="text-muted-foreground text-[11px]">{r.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star
                            key={j}
                            className={cn("size-3", j < r.rating ? "fill-amber text-amber" : "text-muted-foreground/30")}
                            strokeWidth={0}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-foreground/85 mt-2 text-[13px] leading-relaxed">“{r.text}”</p>
                  </article>
                ))}
              </div>

              <Button variant="outline" className="mt-3 w-full">
                <MessageCircle className="size-4" /> See all {product.reviews} reviews
              </Button>

              <ReviewWriter productId={product.id} productName={product.name} />
            </div>
          )}
        </section>

        {/* Frequently Bought Together */}
        {fbt.length > 0 && (
          <section className="mt-8 px-5">
            <div className="flex items-end justify-between">
              <h2 className="text-display text-[18px] font-semibold">Frequently bought together</h2>
            </div>
            <div className="surface-card mt-3 rounded-3xl p-3">
              <div className="flex items-center gap-2">
                {[product, ...fbt].map((p, i) => (
                  <div key={p.id} className="flex flex-1 items-center gap-1">
                    <div className="bg-surface-muted relative aspect-square w-full overflow-hidden rounded-2xl">
                      <img src={p.image} alt={p.name} className="size-full object-cover" />
                    </div>
                    {i < fbt.length && <Plus className="text-muted-foreground size-4 shrink-0" strokeWidth={2.5} />}
                  </div>
                ))}
              </div>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center gap-2 text-[13px]">
                  <span className="bg-primary text-primary-foreground flex size-4 items-center justify-center rounded-[6px]">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  <span className="flex-1 truncate font-medium">This item: {product.name}</span>
                  <span className="font-semibold tabular-nums">৳{product.price.toLocaleString()}</span>
                </li>
                {fbt.map((p) => (
                  <li key={p.id} className="flex items-center gap-2 text-[13px]">
                    <button
                      onClick={() => setFbtChecked((c) => ({ ...c, [p.id]: !c[p.id] }))}
                      className={cn(
                        "flex size-4 items-center justify-center rounded-[6px] border",
                        fbtChecked[p.id]
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-surface",
                      )}
                      aria-label="Toggle"
                    >
                      {fbtChecked[p.id] && <Check className="size-3" strokeWidth={3} />}
                    </button>
                    <span className="text-foreground/85 flex-1 truncate">{p.name}</span>
                    <span className="tabular-nums">৳{p.price.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
              <div className="border-border mt-3 flex items-center justify-between border-t pt-3">
                <div>
                  <p className="text-muted-foreground text-[11px]">Bundle total</p>
                  <p className="text-display text-[18px] font-semibold tabular-nums">
                    ৳{fbtSelectedTotal.toLocaleString()}
                    {fbtSelectedTotal < fbtTotal && (
                      <span className="text-muted-foreground ml-2 text-[12px] line-through">
                        ৳{fbtTotal.toLocaleString()}
                      </span>
                    )}
                  </p>
                </div>
                <Button variant="hero" size="sm">Add bundle</Button>
              </div>
            </div>
          </section>
        )}

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-8 px-5">
            <div className="flex items-end justify-between">
              <h2 className="text-display text-[18px] font-semibold">You may also like</h2>
              <Link to="/shop" className="text-primary inline-flex items-center text-[12px] font-medium">
                See all <ChevronRight className="size-3.5" />
              </Link>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky bottom action bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 flex justify-center"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        <div className="glass-strong mx-3 flex w-full max-w-[440px] items-center gap-2 rounded-3xl p-2 shadow-[var(--shadow-float)]">
          <button
            onClick={handleToggleWishlist}
            aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={liked}
            className="tap-scale tap-scale-active bg-surface flex size-12 shrink-0 items-center justify-center rounded-2xl border border-border"
          >
            <Heart
              className={cn("size-5 transition-colors", liked ? "fill-coral text-coral" : "text-foreground")}
              strokeWidth={2.25}
            />
          </button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 flex-1 rounded-2xl"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="size-4" /> Add to cart
          </Button>
          <Button
            variant="hero"
            size="lg"
            className="h-12 flex-1 rounded-2xl"
            onClick={handleBuyNow}
          >
            <Zap className="size-4" /> Buy now
          </Button>
        </div>
      </div>

      {/* Video modal */}
      {videoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setVideoOpen(false)}
        >
          <div
            className="relative aspect-video w-full max-w-[600px] overflow-hidden rounded-3xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setVideoOpen(false)}
              className="glass-strong absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-pill text-foreground"
              aria-label="Close"
            >
              ✕
            </button>
            <video
              src="https://cdn.coverr.co/videos/coverr-a-girl-shopping-online-9165/1080p.mp4"
              poster={product.image}
              controls
              autoPlay
              playsInline
              className="size-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}
