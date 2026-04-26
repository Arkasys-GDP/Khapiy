import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createOrdersSlice, type OrdersSlice } from "./ordersSlice";
import { createConnectionSlice, type ConnectionSlice } from "./connectionSlice";
import { createSettingsSlice, type SettingsSlice } from "./settingsSlice";

export type KaphiyStore = OrdersSlice & ConnectionSlice & SettingsSlice;

export const useKaphiyStore = create<KaphiyStore>()(
  persist(
    (...args) => ({
      ...createOrdersSlice(...args),
      ...createConnectionSlice(...args),
      ...createSettingsSlice(...args),
    }),
    {
      name: "kaphiy-settings",
      partialize: (state) => ({
        muted: state.muted,
        semaphoreWarnSecs: state.semaphoreWarnSecs,
        semaphoreAlertSecs: state.semaphoreAlertSecs,
        theme: state.theme,
      }),
    },
  ),
);
