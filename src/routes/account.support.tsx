import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LifeBuoy, Plus, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TICKETS, formatDate, type SupportTicket } from "@/data/account";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/support")({
  component: SupportPage,
});

const TONE: Record<SupportTicket["status"], string> = {
  Open: "bg-primary-soft text-primary",
  "Awaiting reply": "bg-amber/15 text-amber-foreground",
  Resolved: "bg-success/15 text-success",
};

function SupportPage() {
  const [list, setList] = useState<SupportTicket[]>(TICKETS);
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setList((l) => [
      {
        id: `TKT-${Math.floor(Math.random() * 9000) + 1000}`,
        subject,
        category: "Other",
        status: "Open",
        updatedAt: new Date().toISOString(),
        lastMessage: body,
      },
      ...l,
    ]);
    setSubject("");
    setBody("");
    setOpen(false);
  }

  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-display flex items-center gap-2 text-2xl font-semibold">
            <LifeBuoy className="size-6" /> Support tickets
          </h1>
          <p className="text-muted-foreground text-xs">
            {list.length} {list.length === 1 ? "ticket" : "tickets"}
          </p>
        </div>
        <Button variant="hero" size="sm" onClick={() => setOpen((v) => !v)}>
          <Plus className="size-4" /> {open ? "Cancel" : "New ticket"}
        </Button>
      </header>

      {open && (
        <form onSubmit={submit} className="surface-card space-y-3 rounded-3xl p-5">
          <div className="space-y-1.5">
            <Label className="text-xs">Subject</Label>
            <Input
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">How can we help?</Label>
            <Textarea
              required
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="hero">
              <Send className="size-4" /> Submit
            </Button>
          </div>
        </form>
      )}

      <ul className="space-y-3">
        {list.map((t) => (
          <li key={t.id} className="surface-card rounded-3xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{t.id}</span>
                  <span
                    className={cn(
                      "rounded-pill px-2 py-0.5 text-[10px] font-medium",
                      TONE[t.status],
                    )}
                  >
                    {t.status}
                  </span>
                </div>
                <div className="mt-0.5 text-sm font-medium">{t.subject}</div>
                <div className="text-muted-foreground mt-1 text-xs">
                  {t.category} • Updated {formatDate(t.updatedAt)}
                </div>
              </div>
            </div>
            <p className="bg-surface-muted text-muted-foreground mt-3 rounded-2xl p-3 text-xs">
              {t.lastMessage}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
