import { ShieldCheck, ShieldAlert, Ban } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TrustStatus } from "@/lib/wallet-data";

const map: Record<TrustStatus, { label: string; icon: typeof ShieldCheck; cls: string }> = {
  verified: { label: "موثّق", icon: ShieldCheck, cls: "bg-success/12 text-success ring-success/25" },
  unverified: { label: "غير موثّق", icon: ShieldAlert, cls: "bg-warning/12 text-warning ring-warning/25" },
  blocked: { label: "محظور", icon: Ban, cls: "bg-destructive/12 text-destructive ring-destructive/25" },
};

export function StatusBadge({ status }: { status: TrustStatus }) {
  const s = map[status];
  const Icon = s.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1", s.cls)}>
      <Icon className="size-3.5" />
      {s.label}
    </span>
  );
}
