import { createFileRoute } from "@tanstack/react-router";
import { Gift, TrendingUp } from "lucide-react";

import { REWARDS, formatDate } from "@/data/account";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/rewards")({
  component: RewardsPage,
});

function RewardsPage() {
  const total = REWARDS.balance + REWARDS.nextTier.pointsNeeded;
  const progress = Math.round((REWARDS.balance / total) * 100);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-display flex items-center gap-2 text-2xl font-semibold">
          <Gift className="size-6" /> Reward points
        </h1>
        <p className="text-muted-foreground text-xs">
          Earn points on every order and redeem at checkout.
        </p>
      </header>

      <section className="surface-card rounded-3xl p-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-muted-foreground text-[10px] uppercase tracking-wide">
              Available balance
            </div>
            <div className="text-display text-4xl font-semibold">
              {REWARDS.balance.toLocaleString()}
            </div>
            <div className="text-muted-foreground text-xs">points</div>
          </div>
          <div className="bg-amber/15 text-amber-foreground rounded-pill px-3 py-1 text-xs font-medium">
            {REWARDS.tier} tier
          </div>
        </div>

        <div className="mt-5">
          <div className="text-muted-foreground mb-1.5 flex items-center justify-between text-xs">
            <span>
              <TrendingUp className="mr-1 inline size-3" />
              {REWARDS.nextTier.pointsNeeded} pts to {REWARDS.nextTier.name}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="bg-surface-muted h-2 overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </section>

      <section className="surface-card rounded-3xl p-5">
        <h2 className="text-display mb-3 text-sm font-semibold">Activity</h2>
        <ul className="divide-border divide-y">
          {REWARDS.activity.map((a) => (
            <li key={a.id} className="flex items-center justify-between py-3">
              <div>
                <div className="text-sm font-medium">{a.label}</div>
                <div className="text-muted-foreground text-[11px]">
                  {formatDate(a.at)}
                </div>
              </div>
              <div
                className={cn(
                  "text-sm font-semibold",
                  a.points >= 0 ? "text-success" : "text-destructive",
                )}
              >
                {a.points >= 0 ? "+" : ""}
                {a.points} pts
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
