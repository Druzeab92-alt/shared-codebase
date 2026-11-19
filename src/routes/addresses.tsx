import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Pin, PinOff, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { HomeNav } from "@/components/home/HomeNav";
import { Panel, SectionHeader } from "@/components/settings/SectionHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NETWORKS, paymentUri, sortPinnedFirst, type CryptoAddress } from "@/lib/crypto-data";
import { useCryptoAddresses } from "@/lib/crypto-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/addresses")({
  head: () => ({
    meta: [
      { title: "العناوين — Winter Wolf" },
      { name: "description", content: "عناوين العملات الرقمية مع الشبكة ورمز QR للاستقبال." },
      { property: "og:title", content: "العناوين — Winter Wolf" },
      { property: "og:description", content: "عناوين العملات الرقمية مع الشبكة ورمز QR للاستقبال." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AddressesPage,
});

function copy(text: string) {
  navigator.clipboard.writeText(text).then(() => toast.success("تم نسخ العنوان"));
}

function AddressesPage() {
  const { addresses, togglePin } = useCryptoAddresses();
  const [receive, setReceive] = useState<CryptoAddress | null>(null);

  return (
    <>
      <HomeNav />
      <div className="mx-auto max-w-6xl px-4 py-8 pb-24">
        <SectionHeader title="العناوين" description="عناوين الاستقبال لكل عملة وشبكة. المثبتة تظهر في الأعلى." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortPinnedFirst(addresses).map((a) => (
            <Panel key={a.id} className={cn("!p-5", a.pinned && "ring-1 ring-primary/40")}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/12 text-sm font-bold text-primary">
                    {a.coin.slice(0, 4)}
                  </div>
                  <div>
                    <p className="font-semibold">{a.coinName} <span className="text-muted-foreground">· {a.coin}</span></p>
                    <span className="mt-1 inline-block rounded-full bg-accent/60 px-2 py-0.5 text-[11px] text-muted-foreground">
                      {NETWORKS[a.network]?.label}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => togglePin(a.id)}
                  aria-label={a.pinned ? "إلغاء التثبيت" : "تثبيت في الأعلى"}
                  className={cn("rounded-lg p-2 transition-colors hover:bg-accent/60", a.pinned ? "text-primary" : "text-muted-foreground")}
                >
                  {a.pinned ? <PinOff className="size-4" /> : <Pin className="size-4" />}
                </button>
              </div>
              <p className="mt-4 break-all rounded-xl bg-background/50 p-3 font-mono text-xs" dir="ltr">{a.address}</p>
              <div className="mt-4 flex gap-2">
                <Button className="flex-1 rounded-xl" onClick={() => setReceive(a)}>
                  <QrCode className="size-4" /> استقبال
                </Button>
                <Button variant="outline" className="rounded-xl" onClick={() => copy(a.address)} aria-label="نسخ">
                  <Copy className="size-4" />
                </Button>
              </div>
            </Panel>
          ))}
        </div>
      </div>

      <Dialog open={!!receive} onOpenChange={(o) => !o && setReceive(null)}>
        <DialogContent className="max-w-sm">
          {receive && (
            <>
              <DialogHeader>
                <DialogTitle>استقبال {receive.coin}</DialogTitle>
                <DialogDescription>الشبكة: {NETWORKS[receive.network]?.label}. أرسل فقط على هذه الشبكة.</DialogDescription>
              </DialogHeader>
              <div className="mx-auto rounded-2xl bg-card-foreground p-4">
                <QRCodeSVG value={paymentUri(receive)} size={208} level="M" bgColor="transparent" fgColor="currentColor" className="text-background" />
              </div>
              <p className="break-all rounded-xl bg-background/50 p-3 text-center font-mono text-xs" dir="ltr">{receive.address}</p>
              <Button className="rounded-xl" onClick={() => copy(receive.address)}>
                <Copy className="size-4" /> نسخ العنوان
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
