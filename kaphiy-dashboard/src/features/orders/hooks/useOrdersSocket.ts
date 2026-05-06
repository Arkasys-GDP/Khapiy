"use client";

import { useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  getSocket,
  getCurrentSocket,
  disconnectSocket,
} from "@/src/shared/api/socket/client";
import { useKaphiyStore } from "../store";
import type { KaphiySocket } from "@/src/shared/api/socket/client";
import type { OrderStatus } from "../lib/statusMachine";
import { canTransition } from "../lib/statusMachine";
import { useSound } from "@/src/features/notifications/useSound";

const ACK_TIMEOUT_MS = 3_000;

/**
 * Lifecycle hook — owns the socket connection: connect on mount, listeners,
 * disconnect on unmount. Render this exactly ONCE in the dashboard layout
 * so the connection persists across route navigations.
 */
export function useOrdersSocketLifecycle(socketUrl: string, token: string | null) {
  const { playNewOrder } = useSound();

  const setConnectionStatus = useKaphiyStore((s) => s.setConnectionStatus);
  const setOrders = useKaphiyStore((s) => s.setOrders);
  const addOrder = useKaphiyStore((s) => s.addOrder);
  const appendItems = useKaphiyStore((s) => s.appendItems);
  const updateOrderStatus = useKaphiyStore((s) => s.updateOrderStatus);
  const setStats = useKaphiyStore((s) => s.setStats);

  useEffect(() => {
    if (!token) return;

    const sock = getSocket(socketUrl, token);

    setConnectionStatus("connecting");
    sock.connect();

    sock.on("connect", () => {
      setConnectionStatus("connected");
      sock.emit("orders:resync", null, (res) => {
        setOrders(res.orders);
        setStats(res.stats);
      });
    });

    sock.on("disconnect", () => setConnectionStatus("disconnected"));
    sock.io.on("reconnect_attempt", () => setConnectionStatus("reconnecting"));
    sock.io.on("reconnect", () => setConnectionStatus("connected"));
    sock.io.on("error", (err) =>
      toast.error(`Error de conexión: ${err.message}`, { id: "socket-error" }),
    );

    sock.on("orders:snapshot", ({ orders, stats }) => {
      setOrders(orders);
      setStats(stats);
    });

    sock.on("orders:new", (order) => {
      addOrder(order);
      playNewOrder();
      toast.success(`Nuevo pedido — Mesa ${order.tableNumber}`, {
        id: `order-new-${order.id}`,
        duration: 4_000,
      });
    });

    sock.on("orders:item-added", ({ orderId, items }) => {
      appendItems(orderId, items);
    });

    sock.on("orders:status-changed", ({ orderId, status }) => {
      updateOrderStatus(orderId, status);
    });

    sock.on("orders:stats", (stats) => setStats(stats));

    return () => {
      sock.removeAllListeners();
      disconnectSocket();
      setConnectionStatus("disconnected");
    };
  }, [token, socketUrl]); // eslint-disable-line react-hooks/exhaustive-deps
}

/**
 * Remote action emitters — read the singleton socket from `getCurrentSocket()`.
 * Safe to use in any component; if the lifecycle hook hasn't connected yet,
 * `emitWithAck` will toast "Sin conexión" and resolve false.
 */
export function useOrderRemoteActions() {
  const startOrder = useCallback(
    (orderId: string) =>
      emitWithAck(getCurrentSocket(), "order:start", { orderId }),
    [],
  );

  const markReady = useCallback(
    (orderId: string) =>
      emitWithAck(getCurrentSocket(), "order:ready", { orderId }),
    [],
  );

  const markDelivered = useCallback(
    (orderId: string) =>
      emitWithAck(getCurrentSocket(), "order:deliver", { orderId }),
    [],
  );

  const markOutOfStock = useCallback(
    (orderId: string, itemId: string) =>
      emitWithAck(getCurrentSocket(), "order:out-of-stock", { orderId, itemId }),
    [],
  );

  return { startOrder, markReady, markDelivered, markOutOfStock };
}

type AckEvent =
  | "order:start"
  | "order:ready"
  | "order:deliver"
  | "order:out-of-stock";

interface AckPayloadMap {
  "order:start": { orderId: string };
  "order:ready": { orderId: string };
  "order:deliver": { orderId: string };
  "order:out-of-stock": { orderId: string; itemId: string };
}

function emitWithAck<E extends AckEvent>(
  sock: KaphiySocket | null,
  event: E,
  payload: AckPayloadMap[E],
): Promise<boolean> {
  if (!sock?.connected) {
    toast.error("Sin conexión — reintentando…");
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      toast.error("Sin respuesta del servidor");
      resolve(false);
    }, ACK_TIMEOUT_MS);

    type EmitWithAck = (
      event: E,
      payload: AckPayloadMap[E],
      ack: (res: { ok: boolean; error?: string }) => void,
    ) => unknown;
    (sock.emit as unknown as EmitWithAck)(event, payload, (res) => {
      clearTimeout(timeout);
      if (!res.ok) toast.error(res.error ?? "Error desconocido");
      resolve(res.ok);
    });
  });
}

// Optimistic helper — used by UI to pre-update before ack
export function useOrderActions() {
  const updateOrderStatus = useKaphiyStore((s) => s.updateOrderStatus);

  const optimisticTransition = useCallback(
    (
      orderId: string,
      from: OrderStatus,
      to: OrderStatus,
      emit: () => Promise<boolean>,
    ) => {
      if (!canTransition(from, to)) return;
      updateOrderStatus(orderId, to);
      emit().then((ok) => {
        if (!ok) updateOrderStatus(orderId, from); // rollback
      });
    },
    [updateOrderStatus],
  );

  return { optimisticTransition };
}
