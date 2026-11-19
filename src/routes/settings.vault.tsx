import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff, KeyRound, Lock, LockOpen, ShieldCheck, Timer } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/winter_wolf_logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Panel, SectionHeader } from "@/components/settings/SectionHeader";
import { formatMoney, validatePasswordChange, VAULT_MIN_PASSWORD } from "@/lib/wallet-data";
import { useWallet } from "@/lib/wallet-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings/vault")({
  head: () => ({
    meta: [
      { title: "الخزنة — Winter Wolf" },
      { name: "description", content: "قفل وفتح خزنة المحفظة وتغيير كلمة السر." },
      { property: "og:title", content: "الخزنة — Winter Wolf" },
      { property: "og:description", content: "قفل وفتح خزنة المحفظة وتغيير كلمة السر." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VaultPage,
});

function PasswordInput({ id, value, onChange, autoFocus }: { id: string; value: string; onChange: (v: string) => void; autoFocus?: boolean }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-xl bg-background/50 pe-11"
        dir="ltr"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute inset-y-0 end-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground"
        aria-label={show ? "إخفاء" : "إظهار"}
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

function UnlockDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { vault, updateVault } = useWallet();
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (pw !== vault.password) {
      setError("كلمة السر غير صحيحة");
      return;
    }
    updateVault({ locked: false });
    toast.success("تم فتح الخزنة");
    setPw("");
    setError("");
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong rounded-2xl sm:max-w-md">
        <form onSubmit={submit} className="grid gap-4">
          <DialogHeader className="text-start sm:text-start">
            <DialogTitle>فتح الخزنة</DialogTitle>
            <DialogDescription>أدخل كلمة سر الخزنة للمتابعة.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="unlock">كلمة السر</Label>
            <PasswordInput id="unlock" value={pw} onChange={(v) => { setPw(v); setError(""); }} autoFocus />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <p className="text-xs text-muted-foreground">للتجربة: كلمة السر الافتراضية 123456</p>
          </div>
          <DialogFooter className="gap-2">
            <Button type="submit" variant="hero">
              <LockOpen />
              فتح
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ChangePasswordDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { vault, updateVault } = useWallet();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err = validatePasswordChange(vault, current, next, confirm);
    if (err) {
      setError(err);
      return;
    }
    updateVault({ password: next });
    toast.success("تم تغيير كلمة سر الخزنة");
    setCurrent("");
    setNext("");
    setConfirm("");
    setError("");
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong rounded-2xl sm:max-w-md">
        <form onSubmit={submit} className="grid gap-4">
          <DialogHeader className="text-start sm:text-start">
            <DialogTitle>تغيير كلمة السر</DialogTitle>
            <DialogDescription>يجب أن تتكون من {VAULT_MIN_PASSWORD} أحرف على الأقل.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="cur">كلمة السر الحالية</Label>
            <PasswordInput id="cur" value={current} onChange={(v) => { setCurrent(v); setError(""); }} autoFocus />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new">كلمة السر الجديدة</Label>
            <PasswordInput id="new" value={next} onChange={(v) => { setNext(v); setError(""); }} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="conf">تأكيد كلمة السر</Label>
            <PasswordInput id="conf" value={confirm} onChange={(v) => { setConfirm(v); setError(""); }} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter className="gap-2">
            <Button type="submit" variant="hero">حفظ كلمة السر</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Row({ icon, title, hint, children }: { icon: React.ReactNode; title: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 py-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary [&_svg]:size-5">{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="font-medium">{title}</div>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function VaultPage() {
  const { vault, updateVault, activeProfile } = useWallet();
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const masked = vault.locked || vault.hideBalance;

  return (
    <>
      <SectionHeader title="الخزنة" description="مكان آمن لمدخراتك. اقفلها عندما لا تحتاجها." />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <section
          className={cn(
            "relative overflow-hidden rounded-3xl p-6 glass shadow-panel transition-all sm:p-8",
            !vault.locked && "shadow-glow",
          )}
        >
          <div className="absolute -top-20 -end-20 size-64 rounded-full bg-primary opacity-20 blur-3xl" />
          <img
            src={logo.url}
            alt=""
            className={cn(
              "pointer-events-none absolute -bottom-10 -start-10 size-56 opacity-[0.07] transition-transform duration-700",
              !vault.locked && "rotate-6 scale-110",
            )}
          />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">رصيد الخزنة · {activeProfile.name}</p>
              <p className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl" dir="ltr">
                {masked ? "••••••" : formatMoney(vault.balance, activeProfile.currency)}
              </p>
            </div>
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1",
                vault.locked ? "bg-destructive/12 text-destructive ring-destructive/25" : "bg-success/12 text-success ring-success/25",
              )}
            >
              {vault.locked ? <Lock className="size-3.5" /> : <LockOpen className="size-3.5" />}
              {vault.locked ? "مقفلة" : "مفتوحة"}
            </span>
          </div>

          <div className="relative mt-10 flex flex-col items-center gap-4">
            <button
              onClick={() => {
                if (vault.locked) setUnlockOpen(true);
                else {
                  updateVault({ locked: true });
                  toast("تم قفل الخزنة");
                }
              }}
              className={cn(
                "group relative flex size-28 items-center justify-center rounded-full transition-all hover:scale-105",
                vault.locked ? "glass ring-2 ring-border" : "bg-gradient-primary text-primary-foreground shadow-glow",
              )}
              aria-label={vault.locked ? "فتح الخزنة" : "قفل الخزنة"}
            >
              <span className={cn("absolute inset-0 rounded-full ring-1 ring-primary/30", !vault.locked && "animate-ping opacity-40")} />
              {vault.locked ? <Lock className="size-10 text-primary" /> : <LockOpen className="size-10" />}
            </button>
            <p className="text-sm text-muted-foreground">{vault.locked ? "اضغط لفتح الخزنة" : "اضغط لقفل الخزنة"}</p>
          </div>
        </section>

        <Panel className="py-2 sm:py-2">
          <div className="divide-y divide-border">
            <Row icon={<KeyRound />} title="كلمة سر الخزنة" hint="غيّرها بانتظام لحماية أفضل.">
              <Button size="sm" variant="soft" onClick={() => setPwOpen(true)}>تغيير</Button>
            </Row>
            <Row icon={<Timer />} title="القفل التلقائي" hint="اقفل الخزنة بعد فترة من عدم النشاط.">
              <Switch checked={vault.autoLock} onCheckedChange={(v) => updateVault({ autoLock: v })} />
            </Row>
            {vault.autoLock && (
              <div className="pb-4">
                <Select dir="rtl" value={String(vault.autoLockMinutes)} onValueChange={(v) => updateVault({ autoLockMinutes: Number(v) })}>
                  <SelectTrigger className="h-10 rounded-xl bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-strong rounded-xl">
                    {[1, 5, 15, 30, 60].map((m) => (
                      <SelectItem key={m} value={String(m)}>
                        بعد {m === 60 ? "ساعة" : `${m} دقيقة`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <Row icon={<EyeOff />} title="إخفاء الرصيد" hint="لا يظهر الرصيد حتى عندما تكون الخزنة مفتوحة.">
              <Switch checked={vault.hideBalance} onCheckedChange={(v) => updateVault({ hideBalance: v })} />
            </Row>
            <Row icon={<ShieldCheck />} title="حالة الحماية" hint={vault.locked ? "الخزنة محمية حالياً." : "الخزنة مفتوحة — تذكّر قفلها."}>
              <span className={cn("text-xs font-medium", vault.locked ? "text-success" : "text-warning")}>
                {vault.locked ? "آمنة" : "تنبيه"}
              </span>
            </Row>
          </div>
        </Panel>
      </div>

      <UnlockDialog open={unlockOpen} onOpenChange={setUnlockOpen} />
      <ChangePasswordDialog open={pwOpen} onOpenChange={setPwOpen} />
    </>
  );
}
