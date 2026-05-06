import type { OrderStatus } from "./lib/statusMachine";

export type PaymentStatus = "PENDING" | "PAID" | "CANCELLED";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  modifiers: string[];
  dietaryFlags: string[];
  status: "pending" | "ready";
  isNew?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  tableId: string;
  tableNumber: number | string;
  paxCount: number;
  status: OrderStatus;
  /** Read-only — payment is owned by the customer PWA / cashier flow. */
  paymentStatus: PaymentStatus;
  /** Order total — informational for kitchen view. */
  total: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface OrderStats {
  inPrep: number;
  alerts: number;
  completedToday: number;
  avgTimeMinutes: number;
}
