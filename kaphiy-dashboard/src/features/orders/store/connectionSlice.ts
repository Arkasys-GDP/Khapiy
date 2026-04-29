import type { StateCreator } from "zustand";
import type { KaphiyStore } from "./index";

export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "reconnecting";

export interface ConnectionSlice {
  connectionStatus: ConnectionStatus;
  setConnectionStatus: (status: ConnectionStatus) => void;
}

export const createConnectionSlice: StateCreator<
  KaphiyStore,
  [],
  [],
  ConnectionSlice
> = (set) => ({
  connectionStatus: "disconnected",
  setConnectionStatus: (status) => set({ connectionStatus: status }),
});
