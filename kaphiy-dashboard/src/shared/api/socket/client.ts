import { io, type Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "./events";

export type KaphiySocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: KaphiySocket | null = null;

export function getSocket(url: string, token: string): KaphiySocket {
  if (socket?.connected) return socket;

  socket = io(url, {
    auth: { token },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,
    reconnectionDelayMax: 10_000,
    randomizationFactor: 0.4,
    timeout: 8_000,
    transports: ["websocket", "polling"],
    autoConnect: false,
  });

  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
