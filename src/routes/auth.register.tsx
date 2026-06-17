import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  AuthInput,
  AuthLayout,
  Divider,
  PrimaryButton,
  SocialButtons,
} from "@/components/auth/AuthLayout";
import { useAuth } from "@/lib/authStore";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const { register, t, lang } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2)
      next.name = lang === "bn" ? "নাম দিন" : "Enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      next.email = lang === "bn" ? "সঠিক ইমেইল দিন" : "Enter a valid email";
    if (!/^\+?\d{10,15}$/.test(form.phone.replace(/\s/g, "")))
      next.phone = lang === "bn" ? "সঠিক নম্বর দিন" : "Enter a valid phone";
    if (form.password.length < 8)
      next.password =
        lang === "bn" ? "কমপক্ষে ৮ অক্ষর" : "At least 8 characters";
    if (form.password !== form.confirm)
      next.confirm = lang === "bn" ? "পাসওয়ার্ড মিলছে না" : "Passwords don't match";
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });
      toast.success(lang === "bn" ? "অ্যাকাউন্ট তৈরি হয়েছে" : "Account created");
      nav({ to: "/auth/verify-email" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title={t("auth.register")}
      subtitle={
        lang === "bn"
          ? "মাত্র এক মিনিটে শুরু করুন।"
          : "Get started in under a minute."
      }
    >
      <form className="space-y-4" onSubmit={submit} noValidate>
        <AuthInput
          label={t("auth.name")}
          value={form.name}
          onChange={set("name")}
          placeholder="John Doe"
          error={errors.name}
        />
        <AuthInput
          label={t("auth.email")}
          type="email"
          value={form.email}
          onChange={set("email")}
          placeholder="you@example.com"
          error={errors.email}
        />
        <AuthInput
          label={t("auth.phone")}
          type="tel"
          value={form.phone}
          onChange={set("phone")}
          placeholder="+8801XXXXXXXXX"
          error={errors.phone}
        />
        <AuthInput
          label={t("auth.password")}
          type="password"
          value={form.password}
          onChange={set("password")}
          placeholder="••••••••"
          error={errors.password}
        />
        <AuthInput
          label={t("auth.confirmPassword")}
          type="password"
          value={form.confirm}
          onChange={set("confirm")}
          placeholder="••••••••"
          error={errors.confirm}
        />

        <PrimaryButton type="submit" loading={busy}>
          {t("auth.signup")}
        </PrimaryButton>

        <Divider label={t("auth.or")} />
        <SocialButtons />
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("auth.haveAccount")}{" "}
        <Link to="/auth/login" className="font-semibold text-primary hover:underline">
          {t("auth.signin")}
        </Link>
      </p>
    </AuthLayout>
  );
}
