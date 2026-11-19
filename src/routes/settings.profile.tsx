import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Camera, Check, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Panel, SectionHeader } from "@/components/settings/SectionHeader";
import { ProfileAvatar } from "@/components/wallet/ProfileAvatar";
import { CURRENCIES } from "@/lib/wallet-data";
import { useWallet } from "@/lib/wallet-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings/profile")({
  head: () => ({
    meta: [
      { title: "الملف الشخصي — Winter Wolf" },
      { name: "description", content: "تعديل صورة واسم وعملة ملفك الشخصي في Winter Wolf." },
      { property: "og:title", content: "الملف الشخصي — Winter Wolf" },
      { property: "og:description", content: "تعديل صورة واسم وعملة ملفك الشخصي في Winter Wolf." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { profiles, activeProfile, updateProfile, setDefaultProfile } = useWallet();
  const [editingId, setEditingId] = useState(activeProfile.id);
  const profile = profiles.find((p) => p.id === editingId) ?? activeProfile;

  const [name, setName] = useState(profile.name);
  const [currency, setCurrency] = useState(profile.currency);
  const [avatar, setAvatar] = useState<string | null>(profile.avatar);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(profile.name);
    setCurrency(profile.currency);
    setAvatar(profile.avatar);
  }, [profile.id, profile.name, profile.currency, profile.avatar]);

  const dirty = name !== profile.name || currency !== profile.currency || avatar !== profile.avatar;

  const onFile = (file?: File) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("حجم الصورة يجب ألا يتجاوز 2 ميغابايت");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
  };

  const save = () => {
    if (!name.trim()) {
      toast.error("الاسم مطلوب");
      return;
    }
    updateProfile(profile.id, { name: name.trim(), currency, avatar });
    toast.success("تم حفظ الملف الشخصي");
  };

  return (
    <>
      <SectionHeader title="الملف الشخصي" description="عدّل صورة واسم والعملة الافتراضية لكل ملف من ملفاتك." />

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {profiles.map((p) => (
          <button
            key={p.id}
            onClick={() => setEditingId(p.id)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full py-1 ps-1 pe-4 text-sm transition-colors glass hover:bg-accent/70",
              p.id === profile.id && "bg-primary/12 text-primary ring-1 ring-primary/30",
            )}
          >
            <ProfileAvatar profile={p} className="size-7 text-xs" />
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Panel className="flex flex-col items-center text-center">
          <div className="relative">
            <ProfileAvatar profile={{ ...profile, name, avatar }} className="size-32 text-3xl ring-4 shadow-glow" />
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-1 end-1 flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow transition-transform hover:scale-105"
              aria-label="تغيير الصورة"
            >
              <Camera className="size-4" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
          </div>
          <h2 className="mt-4 text-lg font-semibold">{name || "بدون اسم"}</h2>
          <p className="text-sm text-muted-foreground">{CURRENCIES.find((c) => c.code === currency)?.label}</p>
          <div className="mt-4 flex gap-2">
            <Button variant="glass" size="sm" onClick={() => fileRef.current?.click()}>
              <Camera />
              رفع صورة
            </Button>
            {avatar && (
              <Button variant="soft-destructive" size="sm" onClick={() => setAvatar(null)}>
                <Trash2 />
                إزالة
              </Button>
            )}
          </div>
        </Panel>

        <Panel>
          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="pname">اسم الملف الشخصي</Label>
              <Input id="pname" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} className="h-11 rounded-xl bg-background/50" />
            </div>
            <div className="grid gap-2">
              <Label>العملة الافتراضية</Label>
              <Select dir="rtl" value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="h-11 rounded-xl bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-strong rounded-xl">
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      <span className="inline-flex w-9 justify-center font-mono text-xs text-muted-foreground">{c.symbol}</span>
                      {c.label} ({c.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-xl bg-background/40 p-4">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 font-medium">
                  <Star className="size-4 text-primary" />
                  الملف الافتراضي
                </div>
                <p className="text-xs text-muted-foreground">يُفتح هذا الملف تلقائياً عند تسجيل الدخول.</p>
              </div>
              {profile.isDefault ? (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
                  <Check className="size-3.5" />
                  افتراضي
                </span>
              ) : (
                <Button
                  size="sm"
                  variant="soft"
                  className="shrink-0"
                  onClick={() => {
                    setDefaultProfile(profile.id);
                    toast.success(`أصبح "${profile.name}" الملف الافتراضي`);
                  }}
                >
                  تعيين كافتراضي
                </Button>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-5">
              <Button
                variant="ghost"
                disabled={!dirty}
                onClick={() => {
                  setName(profile.name);
                  setCurrency(profile.currency);
                  setAvatar(profile.avatar);
                }}
              >
                تراجع
              </Button>
              <Button variant="hero" disabled={!dirty} onClick={save}>
                حفظ التغييرات
              </Button>
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}
