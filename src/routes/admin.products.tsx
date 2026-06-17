import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Boxes,
  Download,
  Filter,
  FolderTree,
  Layers,
  Package,
  Plus,
  Search,
  Tag,
  Tags,
  Upload,
  Warehouse,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatBDT } from "@/data/account";
import { BRANDS, CATEGORIES, PRODUCTS } from "@/data/products";

export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [
      { title: "Product Management — Admin" },
      {
        name: "description",
        content:
          "Manage products, categories, brands, tags, variants, inventory and bulk import/export.",
      },
    ],
  }),
  component: AdminProducts,
});

type Tab =
  | "products"
  | "categories"
  | "brands"
  | "tags"
  | "variants"
  | "inventory"
  | "import"
  | "export";

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: "products", label: "Products", icon: Package },
  { id: "categories", label: "Categories", icon: FolderTree },
  { id: "brands", label: "Brands", icon: Boxes },
  { id: "tags", label: "Tags", icon: Tag },
  { id: "variants", label: "Variants", icon: Layers },
  { id: "inventory", label: "Inventory", icon: Warehouse },
  { id: "import", label: "Bulk Import", icon: Upload },
  { id: "export", label: "Bulk Export", icon: Download },
];

// Mock data extending PRODUCTS with inventory/variants/tags
const TAGS = ["Bestseller", "Flash Deal", "New", "Limited", "Pro pick", "Eco", "Trending", "Premium"];
const SIZES = ["XS", "S", "M", "L", "XL"];
const COLORS = ["Black", "White", "Olive", "Beige", "Navy"];

function AdminProducts() {
  const [tab, setTab] = useState<Tab>("products");

  return (
    <div className="bg-background min-h-screen pb-24">
      <div className="mx-auto w-full max-w-[1200px] px-4 pt-6">
        <Link
          to="/admin"
          className="text-muted-foreground hover:text-foreground mb-3 inline-flex items-center gap-1 text-xs"
        >
          <ArrowLeft className="size-3.5" /> Admin Dashboard
        </Link>

        <header className="surface-card mb-4 flex flex-col gap-3 rounded-3xl p-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-display flex items-center gap-2 text-3xl font-semibold">
              <Package className="size-7" /> Product Management
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Catalog operations — products, categories, brands, tags, variants and stock.
            </p>
          </div>
          <Button variant="hero" size="sm" className="gap-1">
            <Plus className="size-4" /> New product
          </Button>
        </header>

        <nav className="surface-card mb-4 flex gap-1 overflow-x-auto rounded-3xl p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-2xl px-4 py-2 text-sm font-medium transition",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-surface-muted",
                )}
              >
                <Icon className="size-4" /> {t.label}
              </button>
            );
          })}
        </nav>

        {tab === "products" && <ProductsTab />}
        {tab === "categories" && <CategoriesTab />}
        {tab === "brands" && <BrandsTab />}
        {tab === "tags" && <TagsTab />}
        {tab === "variants" && <VariantsTab />}
        {tab === "inventory" && <InventoryTab />}
        {tab === "import" && <ImportTab />}
        {tab === "export" && <ExportTab />}
      </div>
    </div>
  );
}

/* ------------------------------- Products ------------------------------- */

function ProductsTab() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");

  const list = useMemo(() => {
    return PRODUCTS.filter((p) => (cat === "all" ? true : p.category === cat)).filter(
      (p) => !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.brand.toLowerCase().includes(q.toLowerCase()),
    );
  }, [q, cat]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <KPI label="Total products" value={PRODUCTS.length.toString()} />
        <KPI label="Categories" value={CATEGORIES.length.toString()} />
        <KPI label="Brands" value={BRANDS.length.toString()} />
        <KPI label="Avg price" value={formatBDT(Math.round(PRODUCTS.reduce((s, p) => s + p.price, 0) / PRODUCTS.length))} />
      </div>

      <div className="surface-card flex flex-col gap-3 rounded-3xl p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products or brands" className="pl-9" />
        </div>
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="bg-surface-muted h-9 rounded-2xl px-3 text-sm"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <section className="surface-card overflow-x-auto rounded-3xl p-2">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-muted-foreground text-[11px] uppercase tracking-wide">
            <tr>
              <th className="px-3 py-2">SKU</th>
              <th className="py-2">Product</th>
              <th className="py-2">Category</th>
              <th className="py-2">Brand</th>
              <th className="py-2 text-right">Price</th>
              <th className="py-2 text-right">Rating</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className="border-border border-t">
                <td className="text-muted-foreground px-3 py-2 font-mono text-xs">DS-P-{p.id.padStart(4, "0")}</td>
                <td className="py-2 font-medium">{p.name}</td>
                <td className="text-muted-foreground py-2 capitalize">{p.category}</td>
                <td className="py-2">{p.brand}</td>
                <td className="py-2 text-right font-semibold">{formatBDT(p.price)}</td>
                <td className="py-2 text-right tabular-nums">{p.rating.toFixed(1)}</td>
                <td className="py-2 text-right">
                  <Button size="sm" variant="outline">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

/* ----------------------------- Categories ------------------------------- */

function CategoriesTab() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="hero" size="sm" className="gap-1">
          <Plus className="size-4" /> Add category
        </Button>
      </div>
      <section className="grid gap-3 sm:grid-cols-2">
        {CATEGORIES.map((c) => {
          const count = PRODUCTS.filter((p) => p.category === c.slug).length;
          return (
            <div key={c.slug} className="surface-card rounded-3xl p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-display text-base font-semibold capitalize">{c.label}</h3>
                <span className="bg-primary-soft text-primary rounded-full px-2 py-0.5 text-[11px] font-semibold">
                  {count} products
                </span>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">Slug: /{c.slug}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {c.subcategories.map((s) => (
                  <span key={s} className="bg-surface-muted rounded-full px-2 py-0.5 text-[11px]">
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline">Edit</Button>
                <Button size="sm" variant="ghost">Reorder</Button>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

/* ------------------------------- Brands --------------------------------- */

function BrandsTab() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="hero" size="sm" className="gap-1">
          <Plus className="size-4" /> Add brand
        </Button>
      </div>
      <section className="surface-card overflow-x-auto rounded-3xl p-2">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="text-muted-foreground text-[11px] uppercase tracking-wide">
            <tr>
              <th className="px-3 py-2">Brand</th>
              <th className="py-2">Products</th>
              <th className="py-2">Top category</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {BRANDS.map((b) => {
              const ps = PRODUCTS.filter((p) => p.brand === b);
              const cats = ps.reduce<Record<string, number>>((acc, p) => {
                acc[p.category] = (acc[p.category] ?? 0) + 1;
                return acc;
              }, {});
              const top = Object.entries(cats).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
              return (
                <tr key={b} className="border-border border-t">
                  <td className="px-3 py-2 font-semibold">{b}</td>
                  <td className="py-2">{ps.length}</td>
                  <td className="text-muted-foreground py-2 capitalize">{top}</td>
                  <td className="py-2 text-right">
                    <Button size="sm" variant="outline">Edit</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

/* -------------------------------- Tags ---------------------------------- */

function TagsTab() {
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState(TAGS);
  return (
    <div className="space-y-4">
      <div className="surface-card flex flex-col gap-3 rounded-3xl p-5 sm:flex-row">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="New tag name e.g. Eco-friendly"
        />
        <Button
          variant="hero"
          onClick={() => {
            if (newTag.trim()) {
              setTags((t) => [...t, newTag.trim()]);
              setNewTag("");
            }
          }}
          className="gap-1"
        >
          <Plus className="size-4" /> Add tag
        </Button>
      </div>
      <section className="surface-card rounded-3xl p-5">
        <h3 className="text-display mb-3 flex items-center gap-2 text-sm font-semibold">
          <Tags className="size-4" /> All tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="bg-surface-muted hover:bg-primary-soft inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition"
            >
              {t}
              <button
                onClick={() => setTags((arr) => arr.filter((x) => x !== t))}
                className="text-muted-foreground hover:text-rose-600"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ------------------------------ Variants -------------------------------- */

function VariantsTab() {
  const sample = PRODUCTS.slice(0, 6);
  return (
    <div className="space-y-4">
      <section className="surface-card rounded-3xl p-5">
        <h3 className="text-display mb-3 text-sm font-semibold">Variant attributes</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-muted-foreground mb-2 text-[11px] uppercase tracking-wide">Sizes</div>
            <div className="flex flex-wrap gap-1.5">
              {SIZES.map((s) => (
                <span key={s} className="bg-surface-muted rounded-full px-3 py-1 text-xs font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground mb-2 text-[11px] uppercase tracking-wide">Colors</div>
            <div className="flex flex-wrap gap-1.5">
              {COLORS.map((c) => (
                <span key={c} className="bg-surface-muted rounded-full px-3 py-1 text-xs font-medium">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="surface-card overflow-x-auto rounded-3xl p-2">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-muted-foreground text-[11px] uppercase tracking-wide">
            <tr>
              <th className="px-3 py-2">Product</th>
              <th className="py-2">Variant SKU</th>
              <th className="py-2">Size</th>
              <th className="py-2">Color</th>
              <th className="py-2 text-right">Price</th>
              <th className="py-2 text-right">Stock</th>
            </tr>
          </thead>
          <tbody>
            {sample.flatMap((p, idx) =>
              SIZES.slice(0, 3).map((s, i) => (
                <tr key={`${p.id}-${s}`} className="border-border border-t">
                  <td className="px-3 py-2 font-medium">{p.name}</td>
                  <td className="text-muted-foreground py-2 font-mono text-xs">
                    DS-V-{p.id.padStart(3, "0")}-{s}
                  </td>
                  <td className="py-2">{s}</td>
                  <td className="py-2">{COLORS[(idx + i) % COLORS.length]}</td>
                  <td className="py-2 text-right">{formatBDT(p.price)}</td>
                  <td className="py-2 text-right tabular-nums">{20 + ((idx * 7 + i * 5) % 90)}</td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

/* ------------------------------ Inventory ------------------------------- */

function InventoryTab() {
  const rows = useMemo(
    () =>
      PRODUCTS.map((p, i) => {
        const stock = (i * 13 + 5) % 120;
        const reserved = (i * 3) % 12;
        const reorder = 15;
        const status: "OK" | "Low" | "Out" = stock === 0 ? "Out" : stock < reorder ? "Low" : "OK";
        return { p, stock, reserved, reorder, status };
      }),
    [],
  );
  const low = rows.filter((r) => r.status === "Low").length;
  const out = rows.filter((r) => r.status === "Out").length;
  const value = rows.reduce((s, r) => s + r.stock * r.p.price, 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <KPI label="SKUs in stock" value={(rows.length - out).toString()} />
        <KPI label="Low stock" value={low.toString()} tone="warn" />
        <KPI label="Out of stock" value={out.toString()} tone="danger" />
        <KPI label="Stock value" value={formatBDT(value)} tone="primary" />
      </div>

      <section className="surface-card overflow-x-auto rounded-3xl p-2">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-muted-foreground text-[11px] uppercase tracking-wide">
            <tr>
              <th className="px-3 py-2">SKU</th>
              <th className="py-2">Product</th>
              <th className="py-2 text-right">On hand</th>
              <th className="py-2 text-right">Reserved</th>
              <th className="py-2 text-right">Available</th>
              <th className="py-2 text-right">Reorder at</th>
              <th className="py-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.p.id} className="border-border border-t">
                <td className="text-muted-foreground px-3 py-2 font-mono text-xs">
                  DS-P-{r.p.id.padStart(4, "0")}
                </td>
                <td className="py-2 font-medium">{r.p.name}</td>
                <td className="py-2 text-right tabular-nums">{r.stock}</td>
                <td className="py-2 text-right tabular-nums">{r.reserved}</td>
                <td className="py-2 text-right tabular-nums">{Math.max(r.stock - r.reserved, 0)}</td>
                <td className="text-muted-foreground py-2 text-right tabular-nums">{r.reorder}</td>
                <td className="py-2 text-right">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      r.status === "OK" && "bg-emerald-100 text-emerald-800",
                      r.status === "Low" && "bg-amber-100 text-amber-800",
                      r.status === "Out" && "bg-rose-100 text-rose-800",
                    )}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

/* ------------------------------- Import --------------------------------- */

function ImportTab() {
  const [file, setFile] = useState<File | null>(null);
  const [history] = useState([
    { id: "IMP-118", file: "spring-2026.csv", rows: 412, status: "Completed", at: "2026-06-10" },
    { id: "IMP-117", file: "winter-restock.xlsx", rows: 180, status: "Completed", at: "2026-05-22" },
    { id: "IMP-116", file: "watches-batch.csv", rows: 64, status: "Failed", at: "2026-05-19" },
  ]);

  return (
    <div className="space-y-4">
      <section className="surface-card rounded-3xl p-6">
        <h3 className="text-display flex items-center gap-2 text-sm font-semibold">
          <Upload className="size-4" /> Bulk import products
        </h3>
        <p className="text-muted-foreground mt-1 text-xs">
          Upload a CSV or XLSX with columns: <code>sku, name, category, brand, price, stock, tags</code>.
        </p>

        <label className="bg-surface-muted hover:bg-primary-soft mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-border p-10 text-center transition">
          <Upload className="text-muted-foreground size-8" />
          <span className="text-sm font-medium">
            {file ? file.name : "Drop file or click to browse"}
          </span>
          <span className="text-muted-foreground text-[11px]">CSV / XLSX up to 10 MB</span>
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="hidden"
          />
        </label>

        <div className="mt-4 flex gap-2">
          <Button variant="hero" disabled={!file}>Start import</Button>
          <Button variant="outline" className="gap-1">
            <Download className="size-4" /> Download template
          </Button>
        </div>
      </section>

      <section className="surface-card rounded-3xl p-5">
        <h3 className="text-display mb-3 text-sm font-semibold">Recent imports</h3>
        <table className="w-full text-left text-sm">
          <thead className="text-muted-foreground text-[11px] uppercase tracking-wide">
            <tr>
              <th className="py-2">Job</th>
              <th>File</th>
              <th className="text-right">Rows</th>
              <th>Status</th>
              <th className="text-right">Date</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h.id} className="border-border border-t">
                <td className="py-2 font-medium">{h.id}</td>
                <td className="text-muted-foreground">{h.file}</td>
                <td className="text-right tabular-nums">{h.rows}</td>
                <td>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      h.status === "Completed"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800",
                    )}
                  >
                    {h.status}
                  </span>
                </td>
                <td className="text-muted-foreground text-right">{h.at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

/* ------------------------------- Export --------------------------------- */

function ExportTab() {
  const [scope, setScope] = useState<"all" | "low" | "category">("all");
  const [format, setFormat] = useState<"csv" | "xlsx" | "json">("csv");

  function downloadCSV() {
    const rows = [
      ["sku", "name", "category", "brand", "price", "rating"],
      ...PRODUCTS.map((p) => [
        `DS-P-${p.id.padStart(4, "0")}`,
        p.name,
        p.category,
        p.brand,
        p.price.toString(),
        p.rating.toString(),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dadar-products-${Date.now()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <section className="surface-card rounded-3xl p-6">
        <h3 className="text-display flex items-center gap-2 text-sm font-semibold">
          <Download className="size-4" /> Bulk export
        </h3>
        <p className="text-muted-foreground mt-1 text-xs">
          Export your catalog to share with sellers, accountants or marketplaces.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-muted-foreground text-[11px] uppercase tracking-wide">Scope</span>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value as any)}
              className="bg-surface-muted mt-1 h-10 w-full rounded-2xl px-3 text-sm"
            >
              <option value="all">All products ({PRODUCTS.length})</option>
              <option value="low">Low stock only</option>
              <option value="category">By category</option>
            </select>
          </label>
          <label className="block">
            <span className="text-muted-foreground text-[11px] uppercase tracking-wide">Format</span>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="bg-surface-muted mt-1 h-10 w-full rounded-2xl px-3 text-sm"
            >
              <option value="csv">CSV</option>
              <option value="xlsx">XLSX (Excel)</option>
              <option value="json">JSON</option>
            </select>
          </label>
        </div>

        <Button variant="hero" className="mt-5 gap-1" onClick={downloadCSV}>
          <Download className="size-4" /> Export now
        </Button>
      </section>

      <section className="surface-card rounded-3xl p-5">
        <h3 className="text-display mb-3 text-sm font-semibold">Recent exports</h3>
        <ul className="divide-border divide-y text-sm">
          {[
            { name: "products-2026-06-12.csv", size: "184 KB", at: "12 Jun 2026" },
            { name: "low-stock-2026-06-05.xlsx", size: "42 KB", at: "5 Jun 2026" },
            { name: "watches-2026-05-22.csv", size: "21 KB", at: "22 May 2026" },
          ].map((e) => (
            <li key={e.name} className="flex items-center justify-between py-2.5">
              <div>
                <div className="font-medium">{e.name}</div>
                <div className="text-muted-foreground text-[11px]">{e.at} · {e.size}</div>
              </div>
              <Button size="sm" variant="outline" className="gap-1">
                <Download className="size-3.5" /> Download
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/* ------------------------------- Primitive ------------------------------ */

function KPI({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "primary" | "warn" | "danger";
}) {
  return (
    <div className="surface-card rounded-3xl p-4">
      <div className="text-muted-foreground text-[10px] uppercase tracking-wider">{label}</div>
      <div
        className={cn(
          "text-display mt-1 text-2xl font-semibold tabular-nums",
          tone === "primary" && "text-primary",
          tone === "warn" && "text-amber-700",
          tone === "danger" && "text-rose-700",
        )}
      >
        {value}
      </div>
    </div>
  );
}
