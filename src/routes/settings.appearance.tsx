import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Panel, SectionHeader } from "@/components/settings/SectionHeader";
import { AnimatedBackground } from "@/components/wallet/AnimatedBackground";
import { BACKGROUNDS, PRIMARY_COLORS } from "@/lib/wallet-data";
import { WALLPAPERS } from "@/lib/wallpapers";
import { useWallet } from "@/lib/wallet-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings/appearance")({
  head: () => ({
    meta: [
      { title: "المظهر — Winter Wolf" },
      { name: "description", content: "اختر اللون الأساسي والخلفية المتحركة أو الصورة لمحفظتك." },
      { property: "og:title", content: "المظهر — Winter Wolf" },
      { property: "og:description", content: "اختر اللون الأساسي والخلفية المتحركة أو الصورة لمحفظتك." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AppearancePage,
});

function SelectedMark() {
  return (
    <span className="absolute top-2 start-2 z-10 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow">
      <Check className="size-3.5" />
    </span>
  );
}

function AppearancePage() {
  const { primary, setPrimary, background, setBackground, wallpaperDim, setWallpaperDim } = useWallet();
  const color = (PRIMARY_COLORS.find((c) => c.key === primary) ?? PRIMARY_COLORS[0]!).value;
  const isWallpaper = background.startsWith("wp:");

  return (
    <>
      <SectionHeader title="المظهر" description="خصّص ألوان التطبيق وخلفيته كما تحب." />

      <div className="grid gap-5">
        <Panel>
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_280px] sm:items-center">
            <div>
              <h2 className="text-lg font-semibold">اللون الأساسي</h2>
              <p className="text-sm text-muted-foreground">يُطبّق على الأزرار والتحديدات والخلفيات المتحركة.</p>
            </div>
            <div className="grid gap-2">
              <Label className="sr-only">اللون الأساسي</Label>
              <Select dir="rtl" value={primary} onValueChange={setPrimary}>
                <SelectTrigger className="h-11 rounded-xl bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-strong rounded-xl">
                  {PRIMARY_COLORS.map((c) => (
                    <SelectItem key={c.key} value={c.key}>
                      <span className="flex items-center gap-2.5">
                        <span
                          className="size-4 rounded-full ring-2 ring-border"
                          style={{ background: `linear-gradient(135deg, ${c.value}, ${c.glow})` }}
                        />
                        {c.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Panel>

        <Panel>
          <h2 className="text-lg font-semibold">خلفيات متحركة</h2>
          <p className="mb-4 text-sm text-muted-foreground">خلفيات حيّة تتفاعل مع لونك الأساسي.</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {BACKGROUNDS.map((b) => {
              const active = background === b.key;
              return (
                <button
                  key={b.key}
                  onClick={() => setBackground(b.key)}
                  className={cn(
                    "group relative overflow-hidden rounded-xl text-start ring-1 ring-border transition-all hover:-translate-y-0.5",
                    active && "ring-2 ring-primary shadow-glow",
                  )}
                >
                  {active && <SelectedMark />}
                  <div className="relative h-28">
                    <AnimatedBackground variant={b.key} color={color} density={0.6} className="absolute inset-0" />
                  </div>
                  <div className="bg-background/70 p-2.5">
                    <div className="text-sm font-medium">{b.label}</div>
                    <div className="truncate text-[11px] text-muted-foreground">{b.hint}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </Panel>

        <Panel>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">خلفيات جاهزة</h2>
              <p className="text-sm text-muted-foreground">اختر صورة لتكون خلفية محفظتك.</p>
            </div>
            {isWallpaper && (
              <div className="grid w-full gap-2 sm:w-64">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>تعتيم الخلفية</span>
                  <span className="font-mono">{wallpaperDim}%</span>
                </div>
                <Slider dir="rtl" min={0} max={85} step={5} value={[wallpaperDim]} onValueChange={(v) => setWallpaperDim(v[0] ?? 0)} />
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {WALLPAPERS.map((w) => {
              const key = `wp:${w.id}` as const;
              const active = background === key;
              return (
                <button
                  key={w.id}
                  onClick={() => setBackground(key)}
                  className={cn(
                    "group relative aspect-[9/16] overflow-hidden rounded-xl ring-1 ring-border transition-all hover:-translate-y-0.5",
                    active && "ring-2 ring-primary shadow-glow",
                  )}
                  aria-label={w.label}
                >
                  {active && <SelectedMark />}
                  <img src={w.thumb} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-2 pt-6 text-[11px] font-medium">
                    {w.label}
                  </span>
                </button>
              );
            })}
          </div>
        </Panel>
      </div>
    </>
  );
}
