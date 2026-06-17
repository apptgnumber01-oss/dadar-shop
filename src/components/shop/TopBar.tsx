import { Bell } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function TopBar() {
  return (
    <header className="flex items-center justify-between px-5 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <ThemeToggle />
      <div className="flex flex-col items-center">
        <span className="text-serif text-[22px] font-medium leading-none text-foreground">
          Dadar
        </span>
        <span className="text-primary text-[10px] font-semibold uppercase tracking-[0.18em]">
          Shop
        </span>
      </div>
      <button
        aria-label="Notifications"
        className="glass-strong tap-scale tap-scale-active relative flex size-11 items-center justify-center rounded-pill shadow-soft"
      >
        <Bell className="size-5" strokeWidth={2.25} />
        <span className="bg-coral absolute right-2.5 top-2.5 size-2 rounded-full ring-2 ring-surface" />
      </button>
    </header>
  );
}
