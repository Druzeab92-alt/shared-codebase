import { Link } from "@tanstack/react-router";
import { Fingerprint, MonitorSmartphone, Palette, Radio, UserRound, Vault } from "lucide-react";

const items = [
  { to: "/settings/profile", label: "الملف الشخصي", icon: UserRound },
  { to: "/settings/appearance", label: "المظهر", icon: Palette },
  { to: "/settings/devices", label: "الأجهزة", icon: MonitorSmartphone },
  { to: "/settings/sessions", label: "الجلسات", icon: Radio },
  { to: "/settings/passkeys", label: "مفاتيح المرور", icon: Fingerprint },
  { to: "/settings/vault", label: "الخزنة", icon: Vault },
] as const;

export function SettingsNav() {
  return (
    <nav className="sticky top-16 z-30 border-b border-border/60 bg-background/50 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-2 sm:px-4">
        <ul className="flex gap-1 overflow-x-auto py-2 scrollbar-none">
          {items.map(({ to, label, icon: Icon }) => (
            <li key={to} className="shrink-0">
              <Link
                to={to}
                className="group flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground sm:flex-row sm:gap-2 sm:px-4"
                activeProps={{ className: "bg-primary/12 !text-primary ring-1 ring-primary/30" }}
              >
                <Icon className="size-5 sm:size-4" />
                <span className="text-[11px] font-medium sm:text-sm">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
