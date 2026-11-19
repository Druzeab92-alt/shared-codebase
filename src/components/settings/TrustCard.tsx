import type { ReactNode } from "react";
import { Ban, RotateCw, ShieldCheck, Unlock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/wallet/StatusBadge";
import { cn } from "@/lib/utils";
import type { TrustStatus } from "@/lib/wallet-data";

type Props = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  meta: { label: string; value: string }[];
  status: TrustStatus;
  current?: boolean;
  onAction: (a: "verify" | "block" | "unblock") => void;
  onRenew?: () => void;
};

export function TrustCard({ icon, title, subtitle, meta, status, current, onAction, onRenew }: Props) {
  const blocked = status === "blocked";
  return (
    <article
      className={cn(
        "group relative flex flex-col gap-4 overflow-hidden rounded-2xl p-5 glass transition-all hover:-translate-y-0.5 hover:shadow-glow",
        blocked && "opacity-75",
        current && "ring-1 ring-primary/40",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/25 [&_svg]:size-5",
            blocked && "bg-destructive/12 text-destructive ring-destructive/25",
          )}
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-semibold">{title}</h3>
            {current && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                الحالي
              </span>
            )}
          </div>
          <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      <dl className="grid grid-cols-2 gap-3 rounded-xl bg-background/40 p-3 text-xs">
        {meta.map((m) => (
          <div key={m.label} className="min-w-0">
            <dt className="text-muted-foreground">{m.label}</dt>
            <dd className="mt-0.5 truncate font-medium" dir="auto">
              {m.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap gap-2">
        {!blocked && (
          <Button
            size="sm"
            variant="soft-success"
            disabled={status === "verified"}
            onClick={() => {
              onAction("verify");
              toast.success(`تم توثيق ${title}`);
            }}
          >
            <ShieldCheck />
            {status === "verified" ? "موثّق" : "توثيق"}
          </Button>
        )}
        {blocked ? (
          <Button
            size="sm"
            variant="glass"
            onClick={() => {
              onAction("unblock");
              toast(`تم إلغاء حظر ${title}`);
            }}
          >
            <Unlock />
            إلغاء الحظر
          </Button>
        ) : (
          <Button
            size="sm"
            variant="soft-destructive"
            disabled={current}
            title={current ? "لا يمكن حظر الجهاز أو الجلسة الحالية" : undefined}
            onClick={() => {
              onAction("block");
              toast.error(`تم حظر ${title}`);
            }}
          >
            <Ban />
            حظر
          </Button>
        )}
        {onRenew && !blocked && (
          <Button
            size="sm"
            variant="soft"
            onClick={() => {
              onRenew();
              toast.success(`تم تجديد ${title}`);
            }}
          >
            <RotateCw />
            تجديد
          </Button>
        )}
      </div>
    </article>
  );
}

export function TrustSummary({ items }: { items: { status: TrustStatus }[] }) {
  const count = (s: TrustStatus) => items.filter((i) => i.status === s).length;
  const stats = [
    { label: "موثّق", value: count("verified"), cls: "text-success" },
    { label: "غير موثّق", value: count("unverified"), cls: "text-warning" },
    { label: "محظور", value: count("blocked"), cls: "text-destructive" },
  ];
  return (
    <div className="mb-5 grid grid-cols-3 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="rounded-2xl p-4 text-center glass">
          <div className={cn("font-display text-2xl font-semibold", s.cls)}>{s.value}</div>
          <div className="text-xs text-muted-foreground">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
