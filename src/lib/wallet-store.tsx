import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  applyTrustAction,
  initialDevices,
  initialPasskeys,
  initialProfiles,
  initialSessions,
  initialVault,
  PRIMARY_COLORS,
  type BackgroundChoice,
  type Device,
  type Passkey,
  type Profile,
  type Session,
  type Vault,
} from "./wallet-data";

type State = {
  profiles: Profile[];
  activeProfileId: string;
  primary: string;
  background: BackgroundChoice;
  wallpaperDim: number;
  devices: Device[];
  sessions: Session[];
  passkeys: Passkey[];
  vault: Vault;
};

const STORAGE_KEY = "ww-wallet-ui-v1";

const initialState: State = {
  profiles: initialProfiles,
  activeProfileId: initialProfiles[0]!.id,
  primary: "ice",
  background: "constellation",
  wallpaperDim: 45,
  devices: initialDevices,
  sessions: initialSessions,
  passkeys: initialPasskeys,
  vault: initialVault,
};

type TrustAction = "verify" | "block" | "unblock";

type Ctx = State & {
  activeProfile: Profile;
  setActiveProfile: (id: string) => void;
  updateProfile: (id: string, patch: Partial<Omit<Profile, "id" | "isDefault">>) => void;
  setDefaultProfile: (id: string) => void;
  setPrimary: (key: string) => void;
  setBackground: (key: BackgroundChoice) => void;
  setWallpaperDim: (v: number) => void;
  deviceAction: (id: string, a: TrustAction) => void;
  sessionAction: (id: string, a: TrustAction) => void;
  passkeyAction: (id: string, a: TrustAction) => void;
  renewPasskey: (id: string) => void;
  updateVault: (patch: Partial<Vault>) => void;
};

const WalletContext = createContext<Ctx | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...JSON.parse(raw) });
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  useEffect(() => {
    const c = PRIMARY_COLORS.find((p) => p.key === state.primary) ?? PRIMARY_COLORS[0]!;
    const root = document.documentElement;
    root.style.setProperty("--primary", c.value);
    root.style.setProperty("--primary-glow", c.glow);
  }, [state.primary]);

  const patch = useCallback((fn: (s: State) => Partial<State>) => setState((s) => ({ ...s, ...fn(s) })), []);

  const value = useMemo<Ctx>(() => {
    const activeProfile = state.profiles.find((p) => p.id === state.activeProfileId) ?? state.profiles[0]!;
    const today = new Intl.DateTimeFormat("ar", { day: "numeric", month: "long", year: "numeric" }).format(new Date());
    return {
      ...state,
      activeProfile,
      setActiveProfile: (id) => patch(() => ({ activeProfileId: id })),
      updateProfile: (id, p) => patch((s) => ({ profiles: s.profiles.map((x) => (x.id === id ? { ...x, ...p } : x)) })),
      setDefaultProfile: (id) => patch((s) => ({ profiles: s.profiles.map((x) => ({ ...x, isDefault: x.id === id })) })),
      setPrimary: (key) => patch(() => ({ primary: key })),
      setBackground: (key) => patch(() => ({ background: key })),
      setWallpaperDim: (v) => patch(() => ({ wallpaperDim: v })),
      deviceAction: (id, a) => patch((s) => ({ devices: applyTrustAction(s.devices, id, a) })),
      sessionAction: (id, a) => patch((s) => ({ sessions: applyTrustAction(s.sessions, id, a) })),
      passkeyAction: (id, a) => patch((s) => ({ passkeys: applyTrustAction(s.passkeys, id, a) })),
      renewPasskey: (id) =>
        patch((s) => ({
          passkeys: s.passkeys.map((k) => (k.id === id ? { ...k, createdAt: today, lastUsed: "الآن", status: "verified" } : k)),
        })),
      updateVault: (p) => patch((s) => ({ vault: { ...s.vault, ...p } })),
    };
  }, [state, patch]);

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
}
