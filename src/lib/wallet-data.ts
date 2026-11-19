// Pure data + rules for the wallet UI. No React here so it can be unit-tested.

export type TrustStatus = "verified" | "unverified" | "blocked";

export type Currency = { code: string; symbol: string; label: string };

export const CURRENCIES: Currency[] = [
  { code: "SAR", symbol: "ر.س", label: "ريال سعودي" },
  { code: "AED", symbol: "د.إ", label: "درهم إماراتي" },
  { code: "KWD", symbol: "د.ك", label: "دينار كويتي" },
  { code: "JOD", symbol: "د.أ", label: "دينار أردني" },
  { code: "EGP", symbol: "ج.م", label: "جنيه مصري" },
  { code: "USD", symbol: "$", label: "دولار أمريكي" },
  { code: "EUR", symbol: "€", label: "يورو" },
];

export type PrimaryColor = { key: string; label: string; value: string; glow: string };

export const PRIMARY_COLORS: PrimaryColor[] = [
  { key: "ice", label: "جليدي", value: "oklch(0.8 0.13 215)", glow: "oklch(0.68 0.15 240)" },
  { key: "emerald", label: "زمردي", value: "oklch(0.8 0.16 162)", glow: "oklch(0.7 0.17 180)" },
  { key: "gold", label: "ذهبي", value: "oklch(0.84 0.15 82)", glow: "oklch(0.74 0.17 55)" },
  { key: "amber", label: "برتقالي", value: "oklch(0.75 0.16 55)", glow: "oklch(0.66 0.19 35)" },
  { key: "lime", label: "ليموني", value: "oklch(0.88 0.19 128)", glow: "oklch(0.78 0.18 150)" },
  { key: "rose", label: "وردي", value: "oklch(0.75 0.17 355)", glow: "oklch(0.66 0.2 330)" },
];

export type BackgroundKey = "constellation" | "aurora" | "grid" | "orbits" | "none";

/** Selected background: an animated key, or `wp:<wallpaperId>` for a preset image. */
export type BackgroundChoice = BackgroundKey | `wp:${string}`;

export const BACKGROUNDS: { key: BackgroundKey; label: string; hint: string }[] = [
  { key: "constellation", label: "المجسمات المترابطة", hint: "نقاط متصلة تتحرك ببطء" },
  { key: "aurora", label: "الشفق", hint: "تدرجات ضوئية متموجة" },
  { key: "grid", label: "الشبكة", hint: "شبكة منظورية متحركة" },
  { key: "orbits", label: "المدارات", hint: "حلقات تدور حول المركز" },
  { key: "none", label: "بدون", hint: "خلفية هادئة ثابتة" },
];

export type Profile = {
  id: string;
  name: string;
  avatar: string | null; // data URL when the user uploads one
  currency: string;
  isDefault: boolean;
};

export type Device = {
  id: string;
  name: string;
  kind: "phone" | "laptop" | "tablet" | "desktop";
  os: string;
  location: string;
  lastActive: string;
  current: boolean;
  status: TrustStatus;
};

export type Session = {
  id: string;
  browser: string;
  device: string;
  ip: string;
  location: string;
  startedAt: string;
  current: boolean;
  status: TrustStatus;
};

export type Passkey = {
  id: string;
  name: string;
  authenticator: string;
  createdAt: string;
  lastUsed: string;
  status: TrustStatus;
};

export type Vault = {
  locked: boolean;
  password: string;
  balance: number;
  autoLock: boolean;
  autoLockMinutes: number;
  hideBalance: boolean;
};

type Trustable = { id: string; status: TrustStatus; current?: boolean };

/** Toggle verify/block on one item. The item marked `current` can never be blocked. */
export function applyTrustAction<T extends Trustable>(
  items: T[],
  id: string,
  action: "verify" | "block" | "unblock",
): T[] {
  return items.map((item) => {
    if (item.id !== id) return item;
    if (action === "block") return item.current ? item : { ...item, status: "blocked" };
    if (action === "verify") return { ...item, status: "verified" };
    return { ...item, status: "unverified" };
  });
}

export const VAULT_MIN_PASSWORD = 6;

export function validatePasswordChange(
  vault: Pick<Vault, "password">,
  current: string,
  next: string,
  confirm: string,
): string | null {
  if (current !== vault.password) return "كلمة السر الحالية غير صحيحة";
  if (next.length < VAULT_MIN_PASSWORD)
    return `يجب أن تتكون كلمة السر من ${VAULT_MIN_PASSWORD} أحرف على الأقل`;
  if (next !== confirm) return "كلمتا السر غير متطابقتين";
  if (next === current) return "اختر كلمة سر مختلفة عن الحالية";
  return null;
}

export function formatMoney(amount: number, currencyCode: string) {
  const c = CURRENCIES.find((x) => x.code === currencyCode) ?? CURRENCIES[0]!;
  const n = new Intl.NumberFormat("ar", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  return `${n} ${c.symbol}`;
}

export const initialProfiles: Profile[] = [
  { id: "p1", name: "سارة الأحمد", avatar: null, currency: "SAR", isDefault: true },
  { id: "p2", name: "سارة · أعمال", avatar: null, currency: "USD", isDefault: false },
  { id: "p3", name: "سارة · سفر", avatar: null, currency: "EUR", isDefault: false },
];

export const initialDevices: Device[] = [
  { id: "d1", name: "iPhone 16 Pro", kind: "phone", os: "iOS 19.1", location: "الرياض، السعودية", lastActive: "نشط الآن", current: true, status: "verified" },
  { id: "d2", name: "MacBook Air", kind: "laptop", os: "macOS 16", location: "الرياض، السعودية", lastActive: "منذ ساعتين", current: false, status: "verified" },
  { id: "d3", name: "Galaxy Tab S10", kind: "tablet", os: "Android 16", location: "جدة، السعودية", lastActive: "منذ 3 أيام", current: false, status: "unverified" },
  { id: "d4", name: "Windows PC", kind: "desktop", os: "Windows 11", location: "إسطنبول، تركيا", lastActive: "منذ أسبوع", current: false, status: "blocked" },
];

export const initialSessions: Session[] = [
  { id: "s1", browser: "Safari", device: "iPhone 16 Pro", ip: "185.24.12.8", location: "الرياض", startedAt: "اليوم، 09:12", current: true, status: "verified" },
  { id: "s2", browser: "Chrome 142", device: "MacBook Air", ip: "185.24.12.31", location: "الرياض", startedAt: "أمس، 22:40", current: false, status: "verified" },
  { id: "s3", browser: "Firefox 140", device: "Galaxy Tab S10", ip: "94.201.7.112", location: "جدة", startedAt: "16 نوفمبر، 14:05", current: false, status: "unverified" },
  { id: "s4", browser: "Edge 141", device: "Windows PC", ip: "78.180.3.9", location: "إسطنبول", startedAt: "11 نوفمبر، 03:22", current: false, status: "blocked" },
];

export const initialPasskeys: Passkey[] = [
  { id: "k1", name: "Face ID — الهاتف", authenticator: "iCloud Keychain", createdAt: "2 مارس 2026", lastUsed: "اليوم", status: "verified" },
  { id: "k2", name: "مفتاح YubiKey 5C", authenticator: "مفتاح أمان مادي", createdAt: "18 يناير 2026", lastUsed: "منذ 5 أيام", status: "verified" },
  { id: "k3", name: "Windows Hello", authenticator: "Windows Hello", createdAt: "9 سبتمبر 2025", lastUsed: "منذ شهرين", status: "unverified" },
];

export const initialVault: Vault = {
  locked: true,
  password: "123456",
  balance: 48250.75,
  autoLock: true,
  autoLockMinutes: 5,
  hideBalance: false,
};
