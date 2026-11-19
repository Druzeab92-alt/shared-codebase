import type { ReactNode } from "react";
import { DirectionProvider } from "@radix-ui/react-direction";
import { Toaster } from "@/components/ui/sonner";
import { WalletProvider, useWallet } from "@/lib/wallet-store";
import { PRIMARY_COLORS } from "@/lib/wallet-data";
import { AnimatedBackground } from "./AnimatedBackground";
import { TopBar } from "./TopBar";

function Frame({ children }: { children: ReactNode }) {
  const { background, primary, wallpaperDim } = useWallet();
  const color = (PRIMARY_COLORS.find((c) => c.key === primary) ?? PRIMARY_COLORS[0]!).value;
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground variant={background} color={color} dim={wallpaperDim} className="fixed inset-0 -z-10" />
      <TopBar />
      <main className="relative">{children}</main>
      <Toaster position="top-center" dir="rtl" />
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <DirectionProvider dir="rtl">
      <WalletProvider>
        <Frame>{children}</Frame>
      </WalletProvider>
    </DirectionProvider>
  );
}
