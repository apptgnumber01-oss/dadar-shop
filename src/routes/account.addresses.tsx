import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Plus, Star, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADDRESSES, type SavedAddress } from "@/data/account";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/addresses")({
  component: AddressesPage,
});

function AddressesPage() {
  const [list, setList] = useState<SavedAddress[]>(ADDRESSES);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Omit<SavedAddress, "id" | "isDefault">>({
    label: "Home",
    name: "",
    phone: "",
    line1: "",
    area: "",
    city: "",
  });

  function makeDefault(id: string) {
    setList((l) => l.map((a) => ({ ...a, isDefault: a.id === id })));
  }
  function remove(id: string) {
    setList((l) => l.filter((a) => a.id !== id));
  }
  function add(e: React.FormEvent) {
    e.preventDefault();
    setList((l) => [
      ...l,
      { ...draft, id: `a${Date.now()}`, isDefault: l.length === 0 },
    ]);
    setDraft({ label: "Home", name: "", phone: "", line1: "", area: "", city: "" });
    setAdding(false);
  }

  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-display flex items-center gap-2 text-2xl font-semibold">
            <MapPin className="size-6" /> Saved addresses
          </h1>
          <p className="text-muted-foreground text-xs">
            {list.length} saved {list.length === 1 ? "location" : "locations"}
          </p>
        </div>
        <Button variant="hero" size="sm" onClick={() => setAdding((v) => !v)}>
          <Plus className="size-4" /> {adding ? "Cancel" : "Add address"}
        </Button>
      </header>

      {adding && (
        <form onSubmit={add} className="surface-card grid gap-3 rounded-3xl p-5 sm:grid-cols-2">
          <Field label="Label">
            <Input
              value={draft.label}
              onChange={(e) => setDraft({ ...draft, label: e.target.value })}
            />
          </Field>
          <Field label="Full name">
            <Input
              required
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </Field>
          <Field label="Phone">
            <Input
              required
              value={draft.phone}
              onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
            />
          </Field>
          <Field label="Area">
            <Input
              required
              value={draft.area}
              onChange={(e) => setDraft({ ...draft, area: e.target.value })}
            />
          </Field>
          <Field label="Address line" wide>
            <Input
              required
              value={draft.line1}
              onChange={(e) => setDraft({ ...draft, line1: e.target.value })}
            />
          </Field>
          <Field label="City">
            <Input
              required
              value={draft.city}
              onChange={(e) => setDraft({ ...draft, city: e.target.value })}
            />
          </Field>
          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit" variant="hero">Save address</Button>
          </div>
        </form>
      )}

      <ul className="grid gap-3 sm:grid-cols-2">
        {list.map((a) => (
          <li
            key={a.id}
            className={cn(
              "surface-card relative rounded-3xl p-4",
              a.isDefault && "ring-primary ring-2",
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-surface-muted rounded-pill px-2 py-0.5 text-[10px] font-medium">
                  {a.label}
                </span>
                {a.isDefault && (
                  <span className="bg-primary text-primary-foreground rounded-pill px-2 py-0.5 text-[10px] font-medium">
                    Default
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => remove(a.id)}
                aria-label="Remove address"
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            <div className="mt-2 text-sm leading-relaxed">
              <div className="font-medium">{a.name}</div>
              <div className="text-muted-foreground">
                {a.line1}
                <br />
                {a.area}, {a.city}
                <br />
                {a.phone}
              </div>
            </div>
            {!a.isDefault && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => makeDefault(a.id)}
              >
                <Star className="size-3.5" /> Make default
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Field({
  label,
  children,
  wide,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={cn("space-y-1.5", wide && "sm:col-span-2")}>
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
