import type { StateCreator } from "zustand";
import { DEFAULT_THRESHOLDS } from "../lib/semaphore";
import type { KaphiyStore } from "./index";

export interface SettingsSlice {
  muted: boolean;
  semaphoreWarnSecs: number;
  semaphoreAlertSecs: number;
  theme: "light" | "dark" | "system";
  toggleMute: () => void;
  setSemaphoreThresholds: (warn: number, alert: number) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
}

export const createSettingsSlice: StateCreator<KaphiyStore, [], [], SettingsSlice> = (set) => ({
  muted: false,
  semaphoreWarnSecs: DEFAULT_THRESHOLDS.warn,
  semaphoreAlertSecs: DEFAULT_THRESHOLDS.alert,
  theme: "dark",

  toggleMute: () => set((s) => ({ muted: !s.muted })),

  setSemaphoreThresholds: (warn, alert) =>
    set({ semaphoreWarnSecs: warn, semaphoreAlertSecs: alert }),

  setTheme: (theme) => set({ theme }),
});
