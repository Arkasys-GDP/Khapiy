export const ORDER_STATUS = [
  "PENDING",
  "IN_PREP",
  "READY",
  "DELIVERED",
  "OUT_OF_STOCK",
] as const;

export type OrderStatus = (typeof ORDER_STATUS)[number];

const TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  PENDING: ["IN_PREP", "OUT_OF_STOCK"],
  IN_PREP: ["READY", "OUT_OF_STOCK"],
  READY: ["DELIVERED"],
  DELIVERED: [],
  OUT_OF_STOCK: ["PENDING"],
};

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return TRANSITIONS[from].includes(to);
}

export function nextStatuses(from: OrderStatus): readonly OrderStatus[] {
  return TRANSITIONS[from];
}
