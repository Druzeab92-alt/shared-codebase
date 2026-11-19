// Pure crypto address + balance rules. No React so it can be unit-tested.

export type Network = {
  key: string;
  label: string;
  /** URI scheme understood by other wallets (BIP-21 / EIP-681 style). */
  scheme: "bitcoin" | "ethereum" | "tron" | "solana" | "litecoin";
  /** EVM chain id, when the network is EVM. */
  chainId?: number;
};

export const NETWORKS: Record<string, Network> = {
  btc: { key: "btc", label: "Bitcoin", scheme: "bitcoin" },
  eth: { key: "eth", label: "Ethereum (ERC20)", scheme: "ethereum", chainId: 1 },
  bsc: { key: "bsc", label: "BNB Smart Chain (BEP20)", scheme: "ethereum", chainId: 56 },
  trx: { key: "trx", label: "Tron (TRC20)", scheme: "tron" },
  sol: { key: "sol", label: "Solana", scheme: "solana" },
  ltc: { key: "ltc", label: "Litecoin", scheme: "litecoin" },
};

export type CryptoAddress = {
  id: string;
  coin: string; // BTC, ETH, USDT...
  coinName: string;
  network: string; // key in NETWORKS
  address: string;
  /** Token contract on that network, for tokens like USDT. */
  contract?: string;
  amount: number;
  pinned: boolean;
};

/** Value of 1 unit in USD (demo prices). */
export const COIN_USD: Record<string, number> = {
  BTC: 92000, ETH: 3400, USDT: 1, BNB: 640, SOL: 180, LTC: 95, TRX: 0.24,
};

/** Units of each fiat per 1 USD. */
export const FIAT_PER_USD: Record<string, number> = {
  USD: 1, SAR: 3.75, AED: 3.6725, KWD: 0.307, JOD: 0.709, EGP: 48.5, EUR: 0.92,
};

export const initialAddresses: CryptoAddress[] = [
  { id: "a1", coin: "BTC", coinName: "Bitcoin", network: "btc", address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", amount: 0.0842, pinned: true },
  { id: "a2", coin: "USDT", coinName: "Tether", network: "trx", address: "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE", contract: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t", amount: 1250, pinned: true },
  { id: "a3", coin: "ETH", coinName: "Ethereum", network: "eth", address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", amount: 1.37, pinned: false },
  { id: "a4", coin: "USDT", coinName: "Tether", network: "eth", address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", contract: "0xdAC17F958D2ee523a2206206994597C13D831ec7", amount: 400, pinned: false },
  { id: "a5", coin: "BNB", coinName: "BNB", network: "bsc", address: "0x8894E0a0c962CB723c1976a4421c95949bE2D4E3", amount: 2.4, pinned: false },
  { id: "a6", coin: "SOL", coinName: "Solana", network: "sol", address: "7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV", amount: 18.5, pinned: false },
  { id: "a7", coin: "LTC", coinName: "Litecoin", network: "ltc", address: "ltc1qg82n5x7l5z3q9w0qy7k2y8c4d0h9v6r3m2p5a", amount: 6.2, pinned: false },
];

/** Total holdings converted into a fiat currency. */
export function totalInFiat(addresses: CryptoAddress[], fiat: string): number {
  const usd = addresses.reduce((s, a) => s + a.amount * (COIN_USD[a.coin] ?? 0), 0);
  return usd * (FIAT_PER_USD[fiat] ?? 1);
}

export function valueInFiat(a: CryptoAddress, fiat: string): number {
  return a.amount * (COIN_USD[a.coin] ?? 0) * (FIAT_PER_USD[fiat] ?? 1);
}

/** Pinned first, otherwise original order. */
export function sortPinnedFirst(addresses: CryptoAddress[]): CryptoAddress[] {
  return [...addresses.filter((a) => a.pinned), ...addresses.filter((a) => !a.pinned)];
}

/**
 * Payment URI encoded in the QR so other wallets detect both address and network.
 * - EVM: EIP-681 with chain id (`ethereum:0x..@56`); tokens use `contract@chain/transfer?address=`.
 * - Others: BIP-21 style `<scheme>:<address>`, tokens add `?token=<contract>`.
 */
export function paymentUri(a: CryptoAddress): string {
  const n = NETWORKS[a.network];
  if (!n) return a.address;
  if (n.scheme === "ethereum") {
    return a.contract
      ? `ethereum:${a.contract}@${n.chainId}/transfer?address=${a.address}`
      : `ethereum:${a.address}@${n.chainId}`;
  }
  return a.contract ? `${n.scheme}:${a.address}?token=${a.contract}` : `${n.scheme}:${a.address}`;
}
