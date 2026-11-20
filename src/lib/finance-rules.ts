import { FIAT_PER_USD } from "./crypto-data";
export const RECIPIENT_NETWORKS: Record<string, string[]> = { BTC: ["btc"], ETH: ["eth"], USDT: ["trx", "eth", "bsc"], BNB: ["bsc"], SOL: ["sol"], LTC: ["ltc"], TRX: ["trx"] };
export function financeTotals(entries: { kind: string; amount: number; currency: string }[], currency: string) {
  let income = 0; let expenses = 0;
  for (const entry of entries) {
    const value = Number(entry.amount) / (FIAT_PER_USD[entry.currency] ?? 1) * (FIAT_PER_USD[currency] ?? 1);
    if (entry.kind === "income") income += value; else expenses += value;
  }
  return { income, expenses, net: income - expenses };
}
export const goalProgress = (saved: number, target: number) => target > 0 ? Math.min(100, Math.max(0, saved / target * 100)) : 0;