"use client";

import { useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { getSocket, disconnectSocket } from "@/src/shared/api/socket/client";
import { useKaphiyStore } from "../store";
import type { KaphiySocket } from "@/src/shared/api/socket/client";
import type { OrderStatus } from "../lib/statusMachine";
import { canTransition } from "../lib/statusMachine";
import { useSound } from "@/src/features/notifications/useSound";

const ACK_TIMEOUT_MS = 3_000;

export function useOrdersSocket(socketUrl: string, token: string | null) {
  const socketRef = useRef<KaphiySocket | null>(null);
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
    socketRef.current = sock;

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

  const startOrder = useCallback(
    (orderId: string) =>
      emitWithAck(socketRef.current, "order:start", { orderId }),
    [],
  );

  const markReady = useCallback(
    (orderId: string) =>
      emitWithAck(socketRef.current, "order:ready", { orderId }),
    [],
  );

  const markOutOfStock = useCallback(
    (orderId: string, itemId: string) =>
      emitWithAck(socketRef.current, "order:out-of-stock", { orderId, itemId }),
    [],
  );

  return { startOrder, markReady, markOutOfStock };
}

function emitWithAck(
  sock: KaphiySocket | null,
  event: "order:start" | "order:ready" | "order:out-of-stock",
  payload: Record<string, string>,
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

    // @ts-expect-error — overloaded emit signatures
    sock.emit(event, payload, (res) => {
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
