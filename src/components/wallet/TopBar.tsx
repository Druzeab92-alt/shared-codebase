import { Link, useNavigate } from "@tanstack/react-router";
import { Check, ChevronDown, LogOut, Settings, Star } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/winter_wolf_logo.png.asset.json";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWallet } from "@/lib/wallet-store";
import { CURRENCIES } from "@/lib/wallet-data";
import { cn } from "@/lib/utils";
import { ProfileAvatar } from "./ProfileAvatar";

function ProfileSwitcher() {
  const { profiles, activeProfile, setActiveProfile } = useWallet();
  const navigate = useNavigate();

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger
        className="group flex items-center gap-2.5 rounded-full py-1 ps-1 pe-3 outline-none transition-colors glass hover:bg-accent/70 focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="تبديل الملف الشخصي"
      >
        <ProfileAvatar profile={activeProfile} className="size-8" />
        <span className="flex max-w-[9.5rem] flex-col items-start leading-tight">
          <span className="truncate text-sm font-semibold">{activeProfile.name}</span>
          <span className="text-[11px] text-muted-foreground">
            {activeProfile.isDefault ? "الملف الافتراضي" : "ملف إضافي"}
          </span>
        </span>
        <ChevronDown className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-[min(20rem,calc(100vw-1.5rem))] rounded-2xl p-2 glass-strong"
      >
        <DropdownMenuLabel className="px-2 pb-2 pt-1 text-xs font-medium text-muted-foreground">
          ملفاتك الشخصية
        </DropdownMenuLabel>

        <div className="flex flex-col gap-1">
          {profiles.map((p) => {
            const active = p.id === activeProfile.id;
            const currency = CURRENCIES.find((c) => c.code === p.currency);
            return (
              <DropdownMenuItem
                key={p.id}
                onSelect={() => {
                  setActiveProfile(p.id);
                  if (!active) toast.success(`تم التبديل إلى ${p.name}`);
                }}
                className={cn(
                  "cursor-pointer gap-3 rounded-xl px-2 py-2 focus:bg-accent/80",
                  active && "bg-primary/10 ring-1 ring-primary/30 focus:bg-primary/15",
                )}
              >
                <ProfileAvatar profile={p} className="size-10" />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="flex items-center gap-1.5">
                    <span className="truncate font-semibold">{p.name}</span>
                    {p.isDefault && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                        <Star className="size-2.5 fill-current" />
                        افتراضي
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {currency?.label} · {currency?.code}
                  </span>
                </span>
                {active && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3" />
                  </span>
                )}
              </DropdownMenuItem>
            );
          })}
        </div>

        <DropdownMenuSeparator className="my-2 bg-border" />

        <DropdownMenuItem
          onSelect={() => navigate({ to: "/settings/profile" })}
          className="cursor-pointer gap-3 rounded-xl px-3 py-2.5 focus:bg-accent/80"
        >
          <Settings className="text-muted-foreground" />
          الإعدادات
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => toast("تم تسجيل الخروج", { description: "نراك قريباً" })}
          className="cursor-pointer gap-3 rounded-xl px-3 py-2.5 text-destructive focus:bg-destructive/12 focus:text-destructive"
        >
          <LogOut />
          تسجيل الخروج
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/40 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link to="/" aria-label="الرئيسية" className="flex items-center rounded-xl p-1 transition-opacity hover:opacity-80">
          <img src={logo.url} alt="" className="size-10 drop-shadow-[0_0_14px_var(--primary)]" />
        </Link>
        <ProfileSwitcher />
      </div>
    </header>
  );
}
