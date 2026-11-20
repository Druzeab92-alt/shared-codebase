import { describe, it, expect } from "vitest";
import { financeTotals, goalProgress, RECIPIENT_NETWORKS } from "./finance-rules";
describe("personal finance and recipients", () => {
  it("keeps income and expenses separate in personal inventory", () => {
    expect(financeTotals([{ kind: "income", amount: 1000, currency: "SAR" }, { kind: "expense", amount: 100, currency: "SAR" }], "SAR")).toEqual({ income: 1000, expenses: 100, net: 900 });
  });
  it("tracks saved money towards a personal goal", () => { expect(goalProgress(250, 1000)).toBe(25); expect(goalProgress(1200, 1000)).toBe(100); });
  it("offers recipient networks for the selected coin", () => { expect(RECIPIENT_NETWORKS.BTC).toEqual(["btc"]); expect(RECIPIENT_NETWORKS.USDT).toEqual(["trx", "eth", "bsc"]); });
});