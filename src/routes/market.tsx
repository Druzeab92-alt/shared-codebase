import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { HomeNav } from "@/components/home/HomeNav";
import { Input } from "@/components/ui/input";
import { COIN_USD, FIAT_PER_USD, initialAddresses } from "@/lib/crypto-data";
import { formatMoney } from "@/lib/wallet-data";
import { useWallet } from "@/lib/wallet-store";

export const Route = createFileRoute("/market")({
  head: () => ({ meta: [
    { title: "ماركت — Winter Wolf" },
    { name: "description", content: "أسعار العملات الرقمية بعملة ملفك الشخصي." },
    { property: "og:title", content: "ماركت — Winter Wolf" },
    { property: "og:description", content: "أسعار العملات الرقمية بعملة ملفك الشخصي." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: MarketPage,
});

function MarketPage() {
  const [search, setSearch] = useState("");
  const { profiles, activeProfile } = useWallet();
  const currency = (profiles.find((p) => p.isDefault) ?? activeProfile).currency;
  const coins = Object.entries(COIN_USD).map(([symbol, price]) => ({
    symbol, price, name: initialAddresses.find((a) => a.coin === symbol)?.coinName ?? (symbol === "TRX" ? "Tron" : symbol),
  })).filter((c) => `${c.symbol} ${c.name}`.toLowerCase().includes(search.toLowerCase().trim()));
  return <>
    <HomeNav />
    <div className="mx-auto max-w-6xl px-4 py-8 pb-24">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold sm:text-3xl">ماركت</h1>
        <span className="rounded-md bg-warning/12 px-3 py-1 text-xs text-warning">أسعار تجريبية · ليست مباشرة</span>
      </div>
      <div className="relative mb-6 max-w-md">
        <Search className="absolute end-3 top-2.5 size-4 text-muted-foreground" />
        <Input aria-label="البحث عن عملة" placeholder="البحث عن عملة" value={search} onChange={(e) => setSearch(e.target.value)} className="pe-10" />
      </div>
      <div className="flex justify-between border-b border-border pb-3 text-xs text-muted-foreground"><span>العملة</span><span>السعر · {currency}</span></div>
      {coins.map((coin) => <div key={coin.symbol} className="flex items-center justify-between gap-4 border-b border-border py-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-xs font-bold text-primary">{coin.symbol}</span>
          <div><p className="font-semibold">{coin.name}</p><p className="text-xs text-muted-foreground">{coin.symbol}</p></div>
        </div>
        <p dir="ltr" className="shrink-0 text-sm font-medium tabular-nums">{formatMoney(coin.price * (FIAT_PER_USD[currency] ?? 1), currency)}</p>
      </div>)}
      {coins.length === 0 && <p className="py-12 text-center text-muted-foreground">لا توجد عملات مطابقة</p>}
    </div>
  </>;
}