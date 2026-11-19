import { describe, expect, it } from "vitest";
import { paymentUri, sortPinnedFirst, totalInFiat, type CryptoAddress } from "./crypto-data";

const base: CryptoAddress = { id: "x", coin: "USDT", coinName: "Tether", network: "bsc", address: "0xabc", amount: 100, pinned: false };

describe("crypto rules", () => {
  it("converts total into the profile currency", () => {
    expect(totalInFiat([base], "SAR")).toBeCloseTo(375);
  });
  it("EVM token QR carries contract, chain id and address", () => {
    expect(paymentUri({ ...base, contract: "0xT" })).toBe("ethereum:0xT@56/transfer?address=0xabc");
  });
  it("bitcoin QR uses bitcoin scheme", () => {
    expect(paymentUri({ ...base, coin: "BTC", network: "btc", address: "bc1q" })).toBe("bitcoin:bc1q");
  });
  it("pinned addresses come first", () => {
    const r = sortPinnedFirst([{ ...base, id: "1" }, { ...base, id: "2", pinned: true }]);
    expect(r.map((a) => a.id)).toEqual(["2", "1"]);
  });
});
