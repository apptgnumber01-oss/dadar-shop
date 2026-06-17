import type { Product } from "@/components/shop/ProductCard";

import productWatch from "@/assets/product-watch.jpg";
import productBag from "@/assets/product-bag.jpg";
import productHeadphones from "@/assets/product-headphones.jpg";
import productSneaker from "@/assets/product-sneaker.jpg";
import productSaree from "@/assets/product-saree.jpg";
import productSkincare from "@/assets/product-skincare.jpg";
import productSweater from "@/assets/product-sweater.jpg";
import productSunglasses from "@/assets/product-sunglasses.jpg";

export interface CatalogProduct extends Product {
  category: string;
  subcategory: string;
  brand: string;
}

export const CATEGORIES = [
  {
    slug: "electronics",
    label: "Electronics",
    subcategories: ["All", "Headphones", "Watches", "Speakers", "Cameras"],
  },
  {
    slug: "fashion",
    label: "Fashion",
    subcategories: ["All", "Sharee", "Sneakers", "Knitwear", "Eyewear"],
  },
  {
    slug: "bags",
    label: "Bags",
    subcategories: ["All", "Tote", "Crossbody", "Backpack"],
  },
  {
    slug: "beauty",
    label: "Beauty",
    subcategories: ["All", "Skincare", "Fragrance", "Hair"],
  },
  {
    slug: "weddings",
    label: "Weddings",
    subcategories: ["All", "Bridal", "Groom", "Gifts"],
  },
  {
    slug: "watches",
    label: "Watches",
    subcategories: ["All", "Analog", "Smart", "Vintage"],
  },
] as const;

export const BRANDS = [
  "Maison Dhaka",
  "Tempora Studio",
  "Acoustica BD",
  "Pace & Co.",
  "Mira Beauty",
  "Oat & Wool",
  "Lensoria",
];

const seed: CatalogProduct[] = [
  { id: "1", name: "Onyx Analog Watch", image: productWatch, price: 4290, originalPrice: 6900, rating: 4.8, reviews: 312, category: "watches", subcategory: "Analog", brand: "Tempora Studio", seller: "Tempora Studio", badge: "Bestseller" },
  { id: "2", name: "Emerald Leather Tote", image: productBag, price: 7850, originalPrice: 9800, rating: 4.9, reviews: 184, category: "bags", subcategory: "Tote", brand: "Maison Dhaka", seller: "Maison Dhaka" },
  { id: "3", name: "Over-Ear Headphones", image: productHeadphones, price: 5490, originalPrice: 7200, rating: 4.7, reviews: 1042, category: "electronics", subcategory: "Headphones", brand: "Acoustica BD", seller: "Acoustica BD", badge: "Flash Deal" },
  { id: "4", name: "Cloud Runner Sneakers", image: productSneaker, price: 3990, rating: 4.6, reviews: 271, category: "fashion", subcategory: "Sneakers", brand: "Pace & Co.", seller: "Pace & Co." },
  { id: "5", name: "Banarasi Silk Saree", image: productSaree, price: 8900, originalPrice: 12000, rating: 4.9, reviews: 612, category: "fashion", subcategory: "Sharee", brand: "Maison Dhaka", seller: "Maison Dhaka" },
  { id: "6", name: "Hydration Skincare Trio", image: productSkincare, price: 3290, originalPrice: 4900, rating: 4.9, reviews: 421, category: "beauty", subcategory: "Skincare", brand: "Mira Beauty", seller: "Mira Beauty" },
  { id: "7", name: "Cashmere Knit Sweater", image: productSweater, price: 4650, originalPrice: 6200, rating: 4.8, reviews: 308, category: "fashion", subcategory: "Knitwear", brand: "Oat & Wool", seller: "Oat & Wool" },
  { id: "8", name: "Tortoise Sunglasses", image: productSunglasses, price: 2190, originalPrice: 3500, rating: 4.6, reviews: 188, category: "fashion", subcategory: "Eyewear", brand: "Lensoria", seller: "Lensoria" },
  { id: "9", name: "Minimal Steel Watch", image: productWatch, price: 5290, originalPrice: 7900, rating: 4.7, reviews: 142, category: "watches", subcategory: "Analog", brand: "Tempora Studio", seller: "Tempora Studio" },
  { id: "10", name: "Studio Wireless Cans", image: productHeadphones, price: 7990, rating: 4.8, reviews: 521, category: "electronics", subcategory: "Headphones", brand: "Acoustica BD", seller: "Acoustica BD", badge: "Pro pick" },
  { id: "11", name: "Crossbody Leather Bag", image: productBag, price: 5290, originalPrice: 6900, rating: 4.5, reviews: 96, category: "bags", subcategory: "Crossbody", brand: "Maison Dhaka", seller: "Maison Dhaka" },
  { id: "12", name: "Cream Runner Sneakers", image: productSneaker, price: 4290, rating: 4.4, reviews: 78, category: "fashion", subcategory: "Sneakers", brand: "Pace & Co.", seller: "Pace & Co." },
  { id: "13", name: "Aurora Serum Set", image: productSkincare, price: 4890, originalPrice: 6200, rating: 4.9, reviews: 233, category: "beauty", subcategory: "Skincare", brand: "Mira Beauty", seller: "Mira Beauty", badge: "New" },
  { id: "14", name: "Oat Cardigan", image: productSweater, price: 5290, rating: 4.7, reviews: 51, category: "fashion", subcategory: "Knitwear", brand: "Oat & Wool", seller: "Oat & Wool" },
  { id: "15", name: "Round Tortoise Frames", image: productSunglasses, price: 2890, rating: 4.6, reviews: 64, category: "fashion", subcategory: "Eyewear", brand: "Lensoria", seller: "Lensoria" },
  { id: "16", name: "Wedding Silk Saree", image: productSaree, price: 14900, originalPrice: 18900, rating: 5.0, reviews: 88, category: "weddings", subcategory: "Bridal", brand: "Maison Dhaka", seller: "Maison Dhaka", badge: "Limited" },
  { id: "17", name: "Bridal Gift Set", image: productSkincare, price: 6290, rating: 4.8, reviews: 27, category: "weddings", subcategory: "Gifts", brand: "Mira Beauty", seller: "Mira Beauty" },
  { id: "18", name: "Vintage Field Watch", image: productWatch, price: 6490, originalPrice: 8200, rating: 4.7, reviews: 102, category: "watches", subcategory: "Vintage", brand: "Tempora Studio", seller: "Tempora Studio" },
  { id: "19", name: "Travel Backpack", image: productBag, price: 4990, rating: 4.5, reviews: 312, category: "bags", subcategory: "Backpack", brand: "Pace & Co.", seller: "Pace & Co." },
  { id: "20", name: "Smart Sport Watch", image: productWatch, price: 8990, originalPrice: 11900, rating: 4.6, reviews: 410, category: "watches", subcategory: "Smart", brand: "Acoustica BD", seller: "Acoustica BD" },
];

// Expand to ~60 products for pagination demos
export const PRODUCTS: CatalogProduct[] = [
  ...seed,
  ...seed.map((p, i) => ({ ...p, id: `${p.id}-b`, name: p.name, reviews: p.reviews - 20 + i })),
  ...seed.map((p, i) => ({ ...p, id: `${p.id}-c`, name: p.name, price: Math.round(p.price * 0.92), reviews: 40 + i })),
];

export const SORT_OPTIONS = [
  { id: "popular", label: "Most popular" },
  { id: "newest", label: "Newest first" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "rating", label: "Highest rated" },
] as const;

export type SortId = (typeof SORT_OPTIONS)[number]["id"];

export const PRICE_BUCKETS = [
  { id: "any", label: "Any price", min: 0, max: 100000 },
  { id: "under-2k", label: "Under ৳2,000", min: 0, max: 2000 },
  { id: "2-5k", label: "৳2,000 – ৳5,000", min: 2000, max: 5000 },
  { id: "5-10k", label: "৳5,000 – ৳10,000", min: 5000, max: 10000 },
  { id: "over-10k", label: "Over ৳10,000", min: 10000, max: 100000 },
] as const;

export type PriceBucketId = (typeof PRICE_BUCKETS)[number]["id"];

export interface ListingFilters {
  q: string;
  category: string;
  subcategory: string;
  brands: string[];
  price: PriceBucketId;
  minRating: number;
  sort: SortId;
  page: number;
}

export const PAGE_SIZE = 8;

export function filterAndSort(
  products: CatalogProduct[],
  f: ListingFilters,
): { items: CatalogProduct[]; total: number } {
  const bucket = PRICE_BUCKETS.find((b) => b.id === f.price) ?? PRICE_BUCKETS[0];
  const q = f.q.trim().toLowerCase();

  let list = products.filter((p) => {
    if (f.category && f.category !== "all" && p.category !== f.category) return false;
    if (f.subcategory && f.subcategory !== "All" && p.subcategory !== f.subcategory) return false;
    if (f.brands.length > 0 && !f.brands.includes(p.brand)) return false;
    if (p.price < bucket.min || p.price > bucket.max) return false;
    if (p.rating < f.minRating) return false;
    if (q && !`${p.name} ${p.brand} ${p.subcategory}`.toLowerCase().includes(q)) return false;
    return true;
  });

  list = list.slice().sort((a, b) => {
    switch (f.sort) {
      case "price-asc": return a.price - b.price;
      case "price-desc": return b.price - a.price;
      case "rating": return b.rating - a.rating;
      case "newest": return a.id < b.id ? 1 : -1;
      case "popular":
      default: return b.reviews - a.reviews;
    }
  });

  const total = list.length;
  const start = (f.page - 1) * PAGE_SIZE;
  return { items: list.slice(start, start + PAGE_SIZE), total };
}
