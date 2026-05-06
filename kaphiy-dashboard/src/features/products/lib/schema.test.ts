import { describe, it, expect } from "vitest";
import { productSchema } from "./schema";

const valid = {
  name: "Latte",
  categoryId: 1,
  price: 5.5,
  isAvailable: true,
  ingredients: [],
};

describe("productSchema", () => {
  it("accepts valid input", () => {
    const r = productSchema.safeParse(valid);
    expect(r.success).toBe(true);
  });

  it("rejects negative price", () => {
    const r = productSchema.safeParse({ ...valid, price: -1 });
    expect(r.success).toBe(false);
  });

  it("rejects zero price", () => {
    const r = productSchema.safeParse({ ...valid, price: 0 });
    expect(r.success).toBe(false);
  });

  it("rejects categoryId 0 (no selection)", () => {
    const r = productSchema.safeParse({ ...valid, categoryId: 0 });
    expect(r.success).toBe(false);
  });

  it("accepts ingredients array", () => {
    const r = productSchema.safeParse({
      ...valid,
      ingredients: [{ ingredientId: 1, isOptional: true }],
    });
    expect(r.success).toBe(true);
  });

  it("rejects negative ingredientId", () => {
    const r = productSchema.safeParse({
      ...valid,
      ingredients: [{ ingredientId: -1, isOptional: false }],
    });
    expect(r.success).toBe(false);
  });

  it("allows empty aiDescription", () => {
    const r = productSchema.safeParse({ ...valid, aiDescription: "" });
    expect(r.success).toBe(true);
  });
});
