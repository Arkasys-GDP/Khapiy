import { describe, it, expect } from "vitest";
import { canTransition, nextStatuses } from "./statusMachine";

describe("statusMachine", () => {
  it("allows PENDING → IN_PREP", () => {
    expect(canTransition("PENDING", "IN_PREP")).toBe(true);
  });

  it("forbids PENDING → DELIVERED", () => {
    expect(canTransition("PENDING", "DELIVERED")).toBe(false);
  });

  it("DELIVERED is terminal", () => {
    expect(nextStatuses("DELIVERED")).toEqual([]);
  });

  it("OUT_OF_STOCK can be reverted to PENDING", () => {
    expect(canTransition("OUT_OF_STOCK", "PENDING")).toBe(true);
  });
});
