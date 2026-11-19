import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { BackgroundChoice } from "@/lib/wallet-data";
import { WALLPAPERS } from "@/lib/wallpapers";

type Props = {
  variant: BackgroundChoice;
  color: string;
  className?: string;
  density?: number;
  dim?: number;
  thumb?: boolean;
};

/** Connected particles ("المجسمات المترابطة") drawn on canvas. */
function Constellation({ color, density = 1 }: { color: string; density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    type P = { x: number; y: number; vx: number; vy: number; r: number };
    let pts: P[] = [];
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(110, Math.max(18, (w * h) / 14000)) * density);
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6,
      }));
    };

    const maxDist = 130;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      ctx.strokeStyle = color;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i]!;
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j]!;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < maxDist) {
            ctx.globalAlpha = (1 - d / maxDist) * 0.35;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (md < 180) {
          ctx.globalAlpha = (1 - md / 180) * 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
      ctx.fillStyle = color;
      for (const p of pts) {
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    resize();
    tick();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [color, density]);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}

function Aurora() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-1/4 -right-1/4 h-[70%] w-[70%] animate-drift rounded-full bg-primary opacity-25 blur-[90px]" />
      <div className="absolute -bottom-1/4 -left-1/4 h-[70%] w-[70%] animate-drift-slow rounded-full bg-primary-glow opacity-25 blur-[100px]" />
      <div className="absolute top-1/3 left-1/3 h-[40%] w-[40%] animate-drift rounded-full bg-primary opacity-10 blur-[80px]" />
    </div>
  );
}

function Grid() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-x-[-50%] top-[38%] h-[120%] perspective-grid animate-grid" />
      <div className="absolute inset-x-0 top-[30%] h-40 bg-primary opacity-15 blur-[80px]" />
    </div>
  );
}

function Orbits() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {[1, 1.7, 2.5, 3.4].map((s, i) => (
        <div
          key={s}
          className={cn(
            "absolute aspect-square rounded-full border border-primary/20",
            i % 2 ? "animate-spin-slower" : "animate-spin-slow",
          )}
          style={{ width: `${s * 22}vmax` }}
        >
          <span className="absolute -top-1 left-1/2 size-2 rounded-full bg-primary shadow-glow" />
        </div>
      ))}
      <div className="absolute size-[30vmax] rounded-full bg-primary opacity-10 blur-[90px]" />
    </div>
  );
}

export function AnimatedBackground({ variant, color, className, density, dim = 45, thumb }: Props) {
  if (variant.startsWith("wp:")) {
    const wp = WALLPAPERS.find((w) => `wp:${w.id}` === variant) ?? WALLPAPERS[0]!;
    return (
      <div aria-hidden className={cn("pointer-events-none overflow-hidden bg-background", className)}>
        <img src={thumb ? wp.thumb : wp.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-background" style={{ opacity: dim / 100 }} />
      </div>
    );
  }
  return (
    <div aria-hidden className={cn("pointer-events-none overflow-hidden bg-background", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--secondary),transparent_60%)]" />
      {variant === "constellation" && <Constellation color={color} density={density ?? 1} />}
      {variant === "aurora" && <Aurora />}
      {variant === "grid" && <Grid />}
      {variant === "orbits" && <Orbits />}
    </div>
  );
}
