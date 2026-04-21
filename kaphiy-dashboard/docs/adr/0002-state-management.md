# ADR 0002 — Gestión de Estado

- **Estado:** Aceptado
- **Fecha:** 2026-04-21

## Decisión

- **Client state** (comandas activas, UI, settings, mute, tema): **Zustand** (obligatorio por spec, slices por feature).
- **Server state** (catálogo, histórico, auth, configuración admin): **TanStack Query v5**.
- **Realtime ingest:** Socket events → mutan Zustand (source of truth para comandas activas).
- **Bridge:** Query puede invalidar/hidratar store al primer load; posterior actualización vía socket.

## Racional

Separación limpia: Zustand no debe hacer fetching; Query no debe estar en hot-path de WS. Evita `useEffect` en cascada y bugs de stale-while-revalidate.

## Convenciones Zustand

- Un store root con slices: `createOrdersSlice`, `createConnectionSlice`, `createSettingsSlice`.
- Selectores memoizados con `useShallow` / selector atómico por tarjeta → evita re-render global.
- Máquina de estados (`PENDING → IN_PREP → READY → DELIVERED | OUT_OF_STOCK`) en `lib/statusMachine.ts` — pura, testeable.
- Persist: solo `settings` (mute, thresholds, tema) en `localStorage`. Comandas NUNCA persisten (source = server).
