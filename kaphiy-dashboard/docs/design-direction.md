# Design Direction — "Barista Brutalism"

## Thesis

Editorial serif rigor + industrial kitchen utility. Cada comanda es un **ticket impreso** — perforación CSS, borde doble punteado, número de orden gigante tipo press-print. El panel completo respira como una mesa de trabajo: alto contraste, sin decoración vacía, densidad calibrada.

## DFII

| Dim | Score |
|---|---|
| Aesthetic Impact | 4 |
| Context Fit | 5 |
| Feasibility | 5 |
| Performance | 5 |
| Consistency Risk | 2 |
| **Total** | **17 → cap 15 (Execute fully)** |

## Differentiation Anchor

Tarjeta-comanda-ticket: perforación lateral (dots via `radial-gradient`), número de orden gigantesco en display serif, separador punteado doble, sello "NUEVO" editorial cuando entra. Sin logo → aún reconocible.

## Tipografía

| Rol | Fuente | Justificación |
|---|---|---|
| Display | **Fraunces** (variable, opsz, SOFT) | Serif expresiva, optical sizing, alternativa superior a Playfair. Evita default. |
| UI/Body | **IBM Plex Sans** | Carácter técnico sin caer en Inter/Roboto. Buen soporte multi-peso. |
| Mono | **JetBrains Mono** | Tabular-nums nativo, ideal cronómetros + IDs. |

> Si stakeholders exigen el DS original (Playfair + Inter): reemplazar Fraunces→Playfair Display, IBM Plex→**swapear Inter por Geist** (regla anti-default del skill).

## Paleta — OKLCH

```
--paper:     oklch(0.968 0.013 75)    /* #F5EFE6 base light */
--ink:       oklch(0.17 0.018 30)     /* #1C1613 tinta */
--espresso:  oklch(0.24 0.033 35)     /* #2B1810 dark bg */
--praline:   oklch(0.548 0.141 38)    /* #B8532E accent marca */
--crema:     oklch(0.79 0.082 75)     /* #D4A574 neutro cálido */
--muted:     oklch(0.56 0.024 55)     /* #7A6B5D */

--sem-ok:    oklch(0.60 0.10 130)     /* verde tostado */
--sem-warn:  oklch(0.73 0.14 70)      /* ámbar */
--sem-alert: oklch(0.56 0.18 28)      /* rojo-coral alerta */
```

## Ritmo espacial

Base 4px. Escala: 4 · 8 · 12 · 16 · 24 · 40 · 64 · 96. Grid activo: sidebar 280px fijo + canvas con `repeat(auto-fill, minmax(min(100%, 340px), 1fr))` y gap 24px. Tarjeta: padding-y 24px, padding-x 20px.

## Motion

- Entrance tarjeta: `translate-y-3 → 0` + `opacity 0 → 1`, 220ms `cubic-bezier(0.32, 0.72, 0, 1)`.
- Hover tarjeta: `translate-y: -2px`, shadow sutil.
- Nuevo pedido: 2 pulsos de borde `--praline` (800ms total) luego quieto.
- Timer tick: sin animación (solo number update).
- Estado "alerta": borde izquierdo engrosa 4→6px.

## Texturas / depth

- Grain SVG (`public/grain.svg`, opacity 0.025) en `body::before` con `position: fixed; pointer-events: none`.
- Sombra narrativa en tarjeta: `0 1px 0 rgba(0,0,0,0.04), 0 8px 24px -12px rgba(28,22,19,0.18)`.
- "Perforación" lateral tarjeta: `radial-gradient` como mask → bordes dentados.

## Differentiation callout

**Esto evita UI genérica** haciendo tarjetas-ticket perforadas con tipografía editorial (Fraunces display + JetBrains Mono cronómetro) **en vez de** shadcn cards uniformes con Inter y sombras default.
