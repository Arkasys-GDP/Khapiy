# ADR 0001 — Transporte Realtime

- **Estado:** Aceptado
- **Fecha:** 2026-04-21
- **Contexto:** KAPHIY Dashboard Cocina (RF-06). Backend NestJS. Tablets en wifi de cafetería (potencialmente inestable).

## Decisión

Usar `socket.io-client` v4 contra gateway `@nestjs/websockets` (adapter socket.io).

## Alternativas consideradas

| Opción | Pros | Contras |
|---|---|---|
| **socket.io** ✅ | Rooms, acks, auto-reconnect, fallback long-polling, soporte Nest nativo | Payload mayor vs WS puro |
| WebSocket nativo + PartySocket | Liviano, estándar | Sin rooms/acks → reinventar primitives |
| SSE + REST | Simple server-push | Unidireccional; acks de estado requieren canal extra |
| tRPC subscriptions | DX fuerte, tipos compartidos | Aún experimental para WS; menos maduro |

## Consecuencias

- Contrato de eventos versionado en `shared/api/socket/events.ts` (Zod schemas).
- Reconnect: backoff exponencial (500ms → 10s), `reconnectionAttempts: Infinity`.
- Auth: JWT vía `auth.token` del handshake.
- Acks obligatorios en transiciones de estado (`in_prep`, `ready`, `out_of_stock`) con timeout 3s y rollback optimista.
- Heartbeat server-side 25s; cliente detecta stall → forzar reconnect.
- En reconnect: emit `orders:resync` → snapshot completo del estado activo.
