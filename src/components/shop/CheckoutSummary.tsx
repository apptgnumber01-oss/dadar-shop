import { Truck, Tag, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CheckoutSummaryProps {
  subtotal: number;
  shipping: number;
  discount: number;
}

export function CheckoutSummary({ subtotal, shipping, discount }: CheckoutSummaryProps) {
  const total = subtotal + shipping - discount;
  return (
    <section className="surface-card rounded-3xl p-5">
      <h3 className="text-display text-base font-semibold">Order summary</h3>
      <dl className="mt-4 space-y-2.5 text-sm">
        <Row label="Subtotal" value={`৳${subtotal.toLocaleString()}`} />
        <Row
          label={
            <span className="flex items-center gap-1.5">
              <Truck className="size-3.5 text-muted-foreground" /> Shipping
            </span>
          }
          value={shipping === 0 ? "Free" : `৳${shipping}`}
        />
        <Row
          label={
            <span className="text-success flex items-center gap-1.5">
              <Tag className="size-3.5" /> Discount
            </span>
          }
          value={`−৳${discount.toLocaleString()}`}
          tone="success"
        />
      </dl>
      <div className="border-border mt-4 flex items-end justify-between border-t pt-4">
        <span className="text-sm text-muted-foreground">Total</span>
        <span className="text-display text-2xl font-semibold tabular-nums">
          ৳{total.toLocaleString()}
        </span>
      </div>
      <Button variant="hero" size="xl" className="mt-5 w-full">
        Place order securely
      </Button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
        <ShieldCheck className="size-3.5" /> Buyer protection on every order
      </p>
    </section>
  );
}

function Row({
  label,
  value,
  tone,
}: {
  label: React.ReactNode;
  value: string;
  tone?: "success";
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={
          "tabular-nums font-medium " + (tone === "success" ? "text-success" : "text-foreground")
        }
      >
        {value}
      </dd>
    </div>
  );
}
