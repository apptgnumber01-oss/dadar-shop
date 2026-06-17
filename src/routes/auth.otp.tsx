import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AuthInput,
  AuthLayout,
  PrimaryButton,
} from "@/components/auth/AuthLayout";
import { useAuth } from "@/lib/authStore";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/otp")({
  component: OtpPage,
});

function OtpPage() {
  const { requestOtp, verifyOtp, t, lang } = useAuth();
  const nav = useNavigate();
  const [channel, setChannel] = useState<"email" | "phone">("phone");
  const [target, setTarget] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const send = async () => {
    if (!target.trim()) {
      toast.error(lang === "bn" ? "মান দিন" : "Enter a value");
      return;
    }
    setBusy(true);
    try {
      const code = await requestOtp(channel, target.trim());
      setSent(code); // shown in toast for demo
      setCooldown(60);
      toast.success(
        (lang === "bn" ? "কোড পাঠানো হয়েছে। ডেমো OTP: " : "Code sent. Demo OTP: ") +
          code,
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const u = await verifyOtp(target.trim(), code.trim());
      toast.success(lang === "bn" ? "সাইন ইন সম্পন্ন" : "Signed in");
      nav({ to: u.role === "admin" ? "/admin" : "/account" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title={t("auth.otpLogin")}
      subtitle={
        lang === "bn"
          ? "পাসওয়ার্ড লাগবে না — কোড দিয়ে সাইন ইন।"
          : "No password needed — sign in with a code."
      }
    >
      <div className="mb-4 grid grid-cols-2 gap-2 rounded-full bg-surface-muted p-1 text-sm">
        {(["phone", "email"] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setChannel(c)}
            className={
              "rounded-full px-3 py-2 transition " +
              (channel === c
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground")
            }
          >
            {c === "phone"
              ? lang === "bn"
                ? "মোবাইল"
                : "Phone"
              : lang === "bn"
                ? "ইমেইল"
                : "Email"}
          </button>
        ))}
      </div>

      <form className="space-y-4" onSubmit={verify} noValidate>
        <AuthInput
          label={channel === "email" ? t("auth.email") : t("auth.phone")}
          type={channel === "email" ? "email" : "tel"}
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder={channel === "email" ? "you@example.com" : "+8801XXXXXXXXX"}
        />

        {sent ? (
          <>
            <AuthInput
              label={t("auth.enterOtp")}
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="••••••"
            />
            <PrimaryButton type="submit" loading={busy}>
              {t("auth.verifyOtp")}
            </PrimaryButton>
            <button
              type="button"
              disabled={cooldown > 0 || busy}
              onClick={send}
              className="block w-full text-center text-sm font-medium text-primary disabled:opacity-50"
            >
              {cooldown > 0
                ? (lang === "bn" ? "আবার পাঠান " : "Resend in ") + cooldown + "s"
                : t("auth.resend")}
            </button>
          </>
        ) : (
          <PrimaryButton type="button" loading={busy} onClick={send}>
            {t("auth.sendOtp")}
          </PrimaryButton>
        )}
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link to="/auth/login" className="font-semibold text-primary hover:underline">
          ← {t("auth.signin")}
        </Link>
      </p>
    </AuthLayout>
  );
}
