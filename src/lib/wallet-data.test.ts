import { describe, expect, it } from "vitest";
import { applyTrustAction, validatePasswordChange, initialDevices } from "./wallet-data";

describe("trust actions", () => {
  it("never blocks the current device", () => {
    const out = applyTrustAction(initialDevices, "d1", "block");
    expect(out.find((d) => d.id === "d1")?.status).toBe("verified");
  });
  it("blocks another device", () => {
    const out = applyTrustAction(initialDevices, "d3", "block");
    expect(out.find((d) => d.id === "d3")?.status).toBe("blocked");
  });
  it("verifies a device", () => {
    const out = applyTrustAction(initialDevices, "d3", "verify");
    expect(out.find((d) => d.id === "d3")?.status).toBe("verified");
  });
});

describe("vault password change", () => {
  const vault = { password: "123456" };
  it("rejects a wrong current password", () => {
    expect(validatePasswordChange(vault, "000000", "abcdef", "abcdef")).not.toBeNull();
  });
  it("rejects a password shorter than 6", () => {
    expect(validatePasswordChange(vault, "123456", "abc", "abc")).not.toBeNull();
  });
  it("rejects mismatched confirmation", () => {
    expect(validatePasswordChange(vault, "123456", "abcdef", "abcdeg")).not.toBeNull();
  });
  it("accepts a valid change", () => {
    expect(validatePasswordChange(vault, "123456", "abcdef", "abcdef")).toBeNull();
  });
});
