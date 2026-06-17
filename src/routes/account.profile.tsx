import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, Save, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PROFILE } from "@/data/account";

export const Route = createFileRoute("/account/profile")({
  component: ProfileEdit,
});

function ProfileEdit() {
  const [form, setForm] = useState(PROFILE);
  const [saved, setSaved] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 1800);
      }}
      className="space-y-4"
    >
      <header>
        <h1 className="text-display text-2xl font-semibold">Profile</h1>
        <p className="text-muted-foreground text-xs">Update your personal information.</p>
      </header>

      <section className="surface-card flex items-center gap-4 rounded-3xl p-5">
        <div className="bg-primary text-primary-foreground flex size-16 items-center justify-center rounded-full text-xl font-semibold">
          {form.avatarInitials}
        </div>
        <div>
          <div className="text-sm font-semibold">{form.name}</div>
          <div className="text-muted-foreground text-xs">
            {form.tier} • Member since {form.memberSince}
          </div>
        </div>
      </section>

      <section className="surface-card grid gap-4 rounded-3xl p-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs">
            <User className="mr-1 inline size-3" /> Full name
          </Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs">
            <Mail className="mr-1 inline size-3" /> Email
          </Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="phone" className="text-xs">
            <Phone className="mr-1 inline size-3" /> Phone
          </Label>
          <Input
            id="phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        {saved && <span className="text-success text-xs">Saved</span>}
        <Button type="submit" variant="hero">
          <Save className="size-4" /> Save changes
        </Button>
      </div>
    </form>
  );
}
