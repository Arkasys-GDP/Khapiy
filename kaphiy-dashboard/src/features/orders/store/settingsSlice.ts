import type { StateCreator } from "zustand";
import { DEFAULT_THRESHOLDS } from "../lib/semaphore";
import type { KaphiyStore } from "./index";

/**
 * Settings persisted in Zustand. Theme is intentionally NOT here —
 * it's owned by `next-themes` (see `useTheme()` hook), which manages
 * the `.dark` class on <html> + persistence in localStorage.
 */
export interface SettingsSlice {
  muted: boolean;
  semaphoreWarnSecs: number;
  semaphoreAlertSecs: number;
  toggleMute: () => void;
  setSemaphoreThresholds: (warn: number, alert: number) => void;
}

export const createSettingsSlice: StateCreator<KaphiyStore, [], [], SettingsSlice> = (set) => ({
  muted: false,
  semaphoreWarnSecs: DEFAULT_THRESHOLDS.warn,
  semaphoreAlertSecs: DEFAULT_THRESHOLDS.alert,

  toggleMute: () => set((s) => ({ muted: !s.muted })),

  setSemaphoreThresholds: (warn, alert) =>
    set({ semaphoreWarnSecs: warn, semaphoreAlertSecs: alert }),
});
