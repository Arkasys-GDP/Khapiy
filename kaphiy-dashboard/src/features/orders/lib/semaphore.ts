export type Semaphore = "ok" | "warn" | "alert";

export interface SemaphoreThresholds {
  /** seconds < warn → ok */
  warn: number;
  /** seconds >= alert → alert */
  alert: number;
}

export const DEFAULT_THRESHOLDS: SemaphoreThresholds = {
  warn: 300,
  alert: 600,
};

export function semaphoreOf(
  elapsedSeconds: number,
  thresholds: SemaphoreThresholds = DEFAULT_THRESHOLDS,
): Semaphore {
  if (elapsedSeconds >= thresholds.alert) return "alert";
  if (elapsedSeconds >= thresholds.warn) return "warn";
  return "ok";
}
