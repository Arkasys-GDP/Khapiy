# ADR 0003 — Styling y Design Tokens

- **Estado:** Aceptado
- **Fecha:** 2026-04-21

## Decisión

- **Tailwind CSS v4** con `@theme inline` en `app/globals.css` (single source of truth).
- **Tokens** importados desde el DS HTML (`kaphiy-pwa/docs/tokens.css`) como referencia; copiamos valores a `globals.css` bajo esquema OKLCH para consistencia perceptual.
- **Dirección estética:** *Barista Brutalism* (ver ADR 0010 / design-direction.md).
- **Fuentes:** `Fraunces` (display serif, variable), `IBM Plex Sans` (UI), `JetBrains Mono` (timers/IDs). Servidas vía `next/font/google` con `variable: "--font-*"`.
- **shadcn** se usa como **primitives** (accesibilidad), no como identidad visual — reescribimos variants con los tokens propios.
- **No** CSS-in-JS. No Emotion. No styled-components.

## Tokens — contrato

| Token | Rol |
|---|---|
| `--color-paper` | Fondo base (light) |
| `--color-ink` | Texto principal (light) |
| `--color-espresso` | Fondo base (dark) / accent oscuro (light) |
| `--color-praline` | Accent primary — rojo tostado marca |
| `--color-crema` | Tinte neutro cálido |
| `--semaphore-ok/warn/alert` | Estados de cronómetro |
| `--font-display/sans/mono` | Ritmo tipográfico |
| `--space-*` | Escala 4px base |
| `--radius-ticket` | Border-radius específico tarjeta-comanda |

## Consecuencias

- Cualquier cambio visual mayor pasa por tokens → PR único.
- Si el DS oficial se actualiza, sync vía script `scripts/sync-tokens.ts` (Fase 1).
