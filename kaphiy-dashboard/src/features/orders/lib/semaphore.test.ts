import { describe, it, expect } from "vitest";
import { semaphoreOf, DEFAULT_THRESHOLDS } from "./semaphore";

describe("semaphore", () => {
  it("ok at 0s", () => {
    expect(semaphoreOf(0)).toBe("ok");
  });
  it("warn at 300s", () => {
    expect(semaphoreOf(300)).toBe("warn");
  });
  it("alert at 600s", () => {
    expect(semaphoreOf(600)).toBe("alert");
  });
  it("respects custom thresholds", () => {
    expect(semaphoreOf(60, { warn: 30, alert: 90 })).toBe("warn");
  });
  it("default thresholds match contract", () => {
    expect(DEFAULT_THRESHOLDS).toEqual({ warn: 300, alert: 600 });
  });
});
