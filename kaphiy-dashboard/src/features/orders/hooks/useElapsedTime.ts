"use client";

import { useState, useEffect } from "react";

/** Returns elapsed seconds since `startIso`, updated every second via rAF. */
export function useElapsedTime(startIso: string): number {
  const [elapsed, setElapsed] = useState(() =>
    Math.floor((Date.now() - new Date(startIso).getTime()) / 1000),
  );

  useEffect(() => {
    let rafId: number;
    let lastTick = performance.now();

    function tick(now: number) {
      if (now - lastTick >= 1000) {
        lastTick = now;
        setElapsed(Math.floor((Date.now() - new Date(startIso).getTime()) / 1000));
      }
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [startIso]);

  return elapsed;
}

/** Format elapsed seconds as MM:SS */
export function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
