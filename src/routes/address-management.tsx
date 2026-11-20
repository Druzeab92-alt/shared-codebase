import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Pin, PinOff, Search } from "lucide-react";
import { toast } from "sonner";
import { HomeNav } from "@/components/home/HomeNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NETWORKS, sortPinnedFirst } from "@/lib/crypto-data";
import { useCryptoAddresses } from "@/lib/crypto-store";

export const Route = createFileRoute("/address-management")({
  head: () => ({ meta: [
    { title: "إدارة العناوين — Winter Wolf" },
    { name: "description", content: "البحث والتصفية والتثبيت لعناوين العملات الرقمية." },
    { property: "og:title", content: "إدارة العناوين — Winter Wolf" },
    { property: "og:description", content: "البحث والتصفية والتثبيت لعناوين العملات الرقمية." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: AddressManagementPage,
});

function AddressManagementPage() {
  const { addresses, togglePin } = useCryptoAddresses();
  const [search, setSearch] = useState("");
  const [network, setNetwork] = useState("all");
  const filtered = sortPinnedFirst(addresses).filter((a) =>
    (network === "all" || a.network === network) &&
    `${a.coin} ${a.coinName} ${a.address}`.toLowerCase().includes(search.toLowerCase().trim()),
  );
  async function copy(address: string) {
    try { await navigator.clipboard.writeText(address); toast.success("تم نسخ العنوان"); }
    catch { toast.error("تعذر نسخ العنوان"); }
  }
  return <>
    <HomeNav />
    <div className="mx-auto max-w-6xl px-4 py-8 pb-24">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold sm:text-3xl">إدارة العناوين</h1>
        <span className="text-sm text-muted-foreground">{filtered.length} / {addresses.length} عناوين</span>
      </div>
      <p className="mb-5 text-xs text-warning">عناوين تجريبية · لا ترسل أموالًا إليها</p>
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative min-w-0 flex-1 basis-60"><Search className="absolute end-3 top-2.5 size-4 text-muted-foreground" /><Input aria-label="البحث عن عنوان" placeholder="البحث عن عملة أو عنوان" value={search} onChange={(e) => setSearch(e.target.value)} className="pe-10" /></div>
        <Select value={network} onValueChange={setNetwork}><SelectTrigger aria-label="تصفية حسب الشبكة" className="w-full sm:w-60"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">كل الشبكات</SelectItem>{Object.values(NETWORKS).map((n) => <SelectItem key={n.key} value={n.key}>{n.label}</SelectItem>)}</SelectContent></Select>
      </div>
      <div className="divide-y divide-border border-y border-border">
        {filtered.map((a) => <div key={a.id} className="py-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0"><p className="font-semibold">{a.coinName} <span className="text-muted-foreground">· {a.coin}</span></p><p className="mt-1 text-xs text-muted-foreground">{NETWORKS[a.network]?.label}</p></div>
            <div className="flex shrink-0 gap-1">
              <Button variant="ghost" size="icon" aria-label={`نسخ عنوان ${a.coin}`} title="نسخ العنوان" onClick={() => copy(a.address)}><Copy /></Button>
              <Button variant={a.pinned ? "soft" : "ghost"} size="icon" aria-label={`${a.pinned ? "إلغاء تثبيت" : "تثبيت"} ${a.coin}`} title={a.pinned ? "إلغاء التثبيت" : "تثبيت في الأعلى"} onClick={() => togglePin(a.id)}>{a.pinned ? <PinOff /> : <Pin />}</Button>
            </div>
          </div>
          <p dir="ltr" className="mt-3 break-all font-mono text-xs text-muted-foreground">{a.address}</p>
        </div>)}
      </div>
      {filtered.length === 0 && <p className="py-12 text-center text-muted-foreground">لا توجد عناوين مطابقة</p>}
    </div>
  </>;
}