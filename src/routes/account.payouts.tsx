import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Banknote, Plus, Smartphone, Trash2, Wallet as WalletIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/payouts")({
  head: () => ({
    meta: [
      { title: "Payout methods — Dadar Shop" },
      {
        name: "description",
        content:
          "Add and manage your bank account or mobile wallet (bKash, Nagad, Rocket, Upay) for refunds and payouts.",
      },
    ],
  }),
  component: PayoutsPage,
});

type Wallet = "bKash" | "Nagad" | "Rocket" | "Upay";
type Method =
  | { id: string; kind: "bank"; bankName: string; accountName: string; accountNumber: string; branch: string; isDefault?: boolean }
  | { id: string; kind: "wallet"; wallet: Wallet; number: string; isDefault?: boolean };

const SEED: Method[] = [
  { id: "p1", kind: "wallet", wallet: "bKash", number: "+8801711-234567", isDefault: true },
  { id: "p2", kind: "bank", bankName: "BRAC Bank", accountName: "Arif Hossain", accountNumber: "1501-203-457821", branch: "Gulshan" },
];

const WALLETS: { id: Wallet; color: string }[] = [
  { id: "bKash", color: "#E2136E" },
  { id: "Nagad", color: "#EB6E1F" },
  { id: "Rocket", color: "#8C2D8D" },
  { id: "Upay", color: "#0F766E" },
];

function PayoutsPage() {
  const [methods, setMethods] = useState<Method[]>(SEED);
  const [mode, setMode] = useState<"wallet" | "bank" | null>(null);

  function remove(id: string) {
    setMethods((m) => m.filter((x) => x.id !== id));
  }
  function setDefault(id: string) {
    setMethods((m) => m.map((x) => ({ ...x, isDefault: x.id === id })));
  }

  return (
    <div className="space-y-4">
      <header className="surface-card flex flex-col gap-2 rounded-3xl p-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-display flex items-center gap-2 text-2xl font-semibold">
            <WalletIcon className="size-6" /> Payout methods
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Refunds and earnings will be sent to your selected default.
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setMode("wallet")}>
            <Smartphone className="size-4" /> Add mobile wallet
          </Button>
          <Button size="sm" variant="hero" onClick={() => setMode("bank")}>
            <Plus className="size-4" /> Add bank
          </Button>
        </div>
      </header>

      {mode === "wallet" && (
        <WalletForm
          onCancel={() => setMode(null)}
          onAdd={(m) => {
            setMethods((p) => [...p, m]);
            setMode(null);
          }}
        />
      )}
      {mode === "bank" && (
        <BankForm
          onCancel={() => setMode(null)}
          onAdd={(m) => {
            setMethods((p) => [...p, m]);
            setMode(null);
          }}
        />
      )}

      <ul className="space-y-3">
        {methods.length === 0 && (
          <li className="surface-card rounded-3xl p-8 text-center text-sm text-muted-foreground">
            No payout methods yet.
          </li>
        )}
        {methods.map((m) => (
          <li key={m.id} className="surface-card flex items-center justify-between gap-3 rounded-3xl p-4">
            <div className="flex min-w-0 items-center gap-3">
              {m.kind === "wallet" ? (
                <span
                  className="text-display flex size-10 items-center justify-center rounded-2xl text-[10px] font-bold text-white"
                  style={{ background: WALLETS.find((w) => w.id === m.wallet)?.color }}
                >
                  {m.wallet}
                </span>
              ) : (
                <span className="bg-surface-muted flex size-10 items-center justify-center rounded-2xl">
                  <Banknote className="size-5" />
                </span>
              )}
              <div className="min-w-0">
                {m.kind === "wallet" ? (
                  <>
                    <div className="truncate text-sm font-semibold">{m.wallet} · {m.number}</div>
                    <div className="text-muted-foreground text-[11px]">Mobile financial service</div>
                  </>
                ) : (
                  <>
                    <div className="truncate text-sm font-semibold">{m.bankName} · {m.accountNumber}</div>
                    <div className="text-muted-foreground text-[11px]">{m.accountName} · {m.branch}</div>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {m.isDefault ? (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                  Default
                </span>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setDefault(m.id)}>
                  Make default
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => remove(m.id)} aria-label="Remove">
                <Trash2 className="size-4 text-rose-600" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WalletForm({ onCancel, onAdd }: { onCancel: () => void; onAdd: (m: Method) => void }) {
  const [wallet, setWallet] = useState<Wallet>("bKash");
  const [number, setNumber] = useState("");
  return (
    <form
      className="surface-card space-y-3 rounded-3xl p-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!number) return;
        onAdd({ id: crypto.randomUUID(), kind: "wallet", wallet, number });
      }}
    >
      <h3 className="text-display text-sm font-semibold">Add mobile wallet</h3>
      <div className="flex flex-wrap gap-2">
        {WALLETS.map((w) => (
          <button
            type="button"
            key={w.id}
            onClick={() => setWallet(w.id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold transition",
              wallet === w.id ? "text-white" : "bg-surface-muted text-foreground",
            )}
            style={wallet === w.id ? { background: w.color } : undefined}
          >
            {w.id}
          </button>
        ))}
      </div>
      <Input
        placeholder="+8801XXX-XXXXXX"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        inputMode="tel"
      />
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
        <Button size="sm" variant="hero" type="submit">Save</Button>
      </div>
    </form>
  );
}

function BankForm({ onCancel, onAdd }: { onCancel: () => void; onAdd: (m: Method) => void }) {
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [branch, setBranch] = useState("");
  return (
    <form
      className="surface-card grid gap-3 rounded-3xl p-5 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!bankName || !accountNumber) return;
        onAdd({ id: crypto.randomUUID(), kind: "bank", bankName, accountName, accountNumber, branch });
      }}
    >
      <h3 className="text-display sm:col-span-2 text-sm font-semibold">Add bank account</h3>
      <Input placeholder="Bank name (e.g. BRAC Bank)" value={bankName} onChange={(e) => setBankName(e.target.value)} />
      <Input placeholder="Account holder name" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
      <Input placeholder="Account number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
      <Input placeholder="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} />
      <div className="flex justify-end gap-2 sm:col-span-2">
        <Button size="sm" variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
        <Button size="sm" variant="hero" type="submit">Save</Button>
      </div>
    </form>
  );
}
