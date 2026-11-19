import { createFileRoute } from "@tanstack/react-router";
import { HomeNav } from "@/components/home/HomeNav";
import { Panel, SectionHeader } from "@/components/settings/SectionHeader";
import { CURRENCIES, formatMoney } from "@/lib/wallet-data";
import { NETWORKS, sortPinnedFirst, totalInFiat, valueInFiat } from "@/lib/crypto-data";
import { useCryptoAddresses } from "@/lib/crypto-store";
import { useWallet } from "@/lib/wallet-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "نظرة عامة — Winter Wolf" },
      { name: "description", content: "إجمالي رصيد محفظتك بعملة ملفك الافتراضي." },
      { property: "og:title", content: "نظرة عامة — Winter Wolf" },
      { property: "og:description", content: "إجمالي رصيد محفظتك بعملة ملفك الافتراضي." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Overview,
});

function Overview() {
  const { profiles, vault } = useWallet();
  const { addresses } = useCryptoAddresses();
  const def = profiles.find((p) => p.isDefault) ?? profiles[0]!;
  const fiat = def.currency;
  const total = totalInFiat(addresses, fiat);
  const hide = vault.hideBalance;
  const cur = CURRENCIES.find((c) => c.code === fiat);

  return (
    <>
      <HomeNav />
      <div className="mx-auto max-w-6xl px-4 py-8 pb-24">
        <SectionHeader title="نظرة عامة" description={`الرصيد محسوب بعملة الملف الافتراضي: ${def.name}`} />
        <Panel className="relative overflow-hidden">
          <div className="pointer-events-none absolute -end-16 -top-16 size-56 rounded-full bg-gradient-primary opacity-20 blur-3xl" />
          <p className="text-sm text-muted-foreground">إجمالي الرصيد</p>
          <p className="mt-2 text-4xl font-bold tabular-nums text-gradient-primary sm:text-5xl" dir="ltr">
            {hide ? "••••••" : formatMoney(total, fiat)}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">{cur?.label} · {addresses.length} عناوين</p>
        </Panel>

        <h2 className="mb-3 mt-8 text-lg font-semibold">توزيع الأصول</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sortPinnedFirst(addresses).map((a) => {
            const v = valueInFiat(a, fiat);
            const pct = total ? (v / total) * 100 : 0;
            return (
              <Panel key={a.id} className="!p-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{a.coin}</p>
                    <p className="text-xs text-muted-foreground">{NETWORKS[a.network]?.label}</p>
                  </div>
                  <p className="text-sm font-medium tabular-nums" dir="ltr">{hide ? "••••" : formatMoney(v, fiat)}</p>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${pct}%` }} />
                </div>
              </Panel>
            );
          })}
        </div>
      </div>
    </>
  );
}
