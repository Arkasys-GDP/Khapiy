"use client";

import { useCallback, useRef } from "react";
import { useKaphiyStore } from "@/src/features/orders/store";

export function useSound() {
  const muted = useKaphiyStore((s) => s.muted);
  const unlockedRef = useRef(false);

  const unlock = useCallback(() => {
    unlockedRef.current = true;
  }, []);

  const play = useCallback(
    (src: string) => {
      if (muted || !unlockedRef.current) return;
      try {
        const audio = new Audio(src);
        audio.volume = 0.5;
        void audio.play();
      } catch {
        // Silently ignore — browser may block autoplay
      }
    },
    [muted],
  );

  const playNewOrder = useCallback(
    () => play("/sounds/new-order.ogg"),
    [play],
  );

  return { playNewOrder, unlock };
}
