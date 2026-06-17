import { Link } from "@tanstack/react-router";
import { Languages, ShoppingBag } from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/authStore";
import { cn } from "@/lib/utils";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const { lang, setLang, t } = useAuth();
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[color:var(--surface-muted)] via-background to-background">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -left-24 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-amber/20 blur-3xl" />

      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-5 pt-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
            <ShoppingBag className="h-4 w-4" />
          </span>
          <span className="font-serif text-xl tracking-tight">Dadar Shop</span>
        </Link>
        <button
          onClick={() => setLang(lang === "en" ? "bn" : "en")}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1.5 text-xs font-medium backdrop-blur transition hover:bg-surface"
          aria-label="Toggle language"
        >
          <Languages className="h-3.5 w-3.5" />
          {lang === "en" ? "বাংলা" : "English"}
        </button>
      </header>

      <main className="relative z-10 mx-auto flex max-w-md flex-col px-5 pb-16 pt-8">
        <div
          className={cn(
            "rounded-3xl border border-border/70 bg-card/80 p-6 shadow-card backdrop-blur-xl",
            "animate-in fade-in slide-in-from-bottom-4 duration-500",
          )}
        >
          <div className="mb-6 space-y-1.5">
            <h1 className="font-serif text-3xl leading-tight tracking-tight text-foreground">
              {title}
            </h1>
            {subtitle ? (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            ) : (
              <p className="text-sm text-muted-foreground">{t("auth.tagline")}</p>
            )}
          </div>
          {children}
        </div>
        {footer ? <div className="mt-6 text-center text-sm">{footer}</div> : null}
      </main>
    </div>
  );
}

export function AuthInput({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <input
        {...props}
        className={cn(
          "block w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70",
          "transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15",
          error && "border-destructive focus:border-destructive focus:ring-destructive/15",
          props.className,
        )}
      />
      {error ? (
        <span className="mt-1.5 block text-xs text-destructive">{error}</span>
      ) : null}
    </label>
  );
}

export function PrimaryButton({
  children,
  loading,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={cn(
        "group relative inline-flex w-full items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft",
        "transition-all duration-200 hover:shadow-glow active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60",
        props.className,
      )}
    >
      {loading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
      ) : (
        children
      )}
    </button>
  );
}

export function Divider({ label }: { label: string }) {
  return (
    <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
      <div className="h-px flex-1 bg-border" />
      <span>{label}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

export function SocialButtons() {
  const { socialLogin, t } = useAuth();
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <button
        type="button"
        onClick={() => socialLogin("google").catch(() => {})}
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm font-medium transition hover:bg-surface-muted"
      >
        <GoogleIcon className="h-4 w-4" />
        {t("auth.continueGoogle")}
      </button>
      <button
        type="button"
        onClick={() => socialLogin("facebook").catch(() => {})}
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-[#1877F2] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1668d8]"
      >
        <FacebookIcon className="h-4 w-4" />
        {t("auth.continueFacebook")}
      </button>
    </div>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" {...props}>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.2 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.2 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.4 0 10.3-2.1 14-5.4l-6.5-5.3c-2 1.4-4.6 2.2-7.5 2.2-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.4 39.5 16.1 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.5l6.5 5.3C41 35.5 44 30.2 44 24c0-1.3-.1-2.3-.4-3.5z"
      />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12.07C22 6.51 17.52 2 12 2S2 6.51 2 12.07C2 17.1 5.66 21.27 10.44 22v-7.02H7.9v-2.9h2.54V9.84c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.9h-2.34V22C18.34 21.27 22 17.1 22 12.07z" />
    </svg>
  );
}
