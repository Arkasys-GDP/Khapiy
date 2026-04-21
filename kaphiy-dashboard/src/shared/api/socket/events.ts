/**
 * Socket.IO event contracts between kaphiy-dashboard and kaphiy-backend.
 * Backend may not yet implement all events — structure left open for extension.
 * Update this file when backend contract is finalized.
 */

import type { Order, OrderStats } from "@/src/features/orders/types";
import type { OrderStatus } from "@/src/features/orders/lib/statusMachine";

// ── Events: server → client ──────────────────────────────
export interface ServerToClientEvents {
  /** Full snapshot on connect/reconnect */
  "orders:snapshot": (payload: { orders: Order[]; stats: OrderStats }) => void;

  /** New order received from AI agent */
  "orders:new": (order: Order) => void;

  /** Addition to an existing open table (pre-cuenta) */
  "orders:item-added": (payload: { orderId: string; items: Order["items"] }) => void;

  /** Status changed (ack from action or external update) */
  "orders:status-changed": (payload: { orderId: string; status: OrderStatus }) => void;

  /** Stats refreshed */
  "orders:stats": (stats: OrderStats) => void;
}

// ── Events: client → server ──────────────────────────────
export interface ClientToServerEvents {
  /** Transition order to IN_PREP */
  "order:start": (
    payload: { orderId: string },
    ack: (res: AckResponse) => void,
  ) => void;

  /** Transition IN_PREP → READY */
  "order:ready": (
    payload: { orderId: string },
    ack: (res: AckResponse) => void,
  ) => void;

  /** Mark item as out of stock → triggers client reversal */
  "order:out-of-stock": (
    payload: { orderId: string; itemId: string },
    ack: (res: AckResponse) => void,
  ) => void;

  /** Request reprint (backend bridges to ESC/POS) */
  "order:print": (
    payload: { orderId: string },
    ack: (res: AckResponse) => void,
  ) => void;

  /** Request full snapshot (called on reconnect) */
  "orders:resync": (
    _: null,
    ack: (res: { orders: Order[]; stats: OrderStats }) => void,
  ) => void;
}

export interface AckResponse {
  ok: boolean;
  error?: string;
}
