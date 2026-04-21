# ADR 0004 — Impresión Térmica (RF-11)

- **Estado:** Diferido (Fase 2)
- **Fecha:** 2026-04-21

## Decisión

Lógica ESC/POS vive en **backend NestJS** (bridge). Dashboard emite `POST /orders/:id/print` o evento socket `order:print`. Dashboard no habla directamente con hardware.

## Racional

- WebUSB/WebSerial requiere HTTPS + permiso explícito + Chromium → frágil en kiosco.
- Bridge backend permite centralizar plantillas ESC/POS, retries, colas.
- Alineado con arquitectura KAPHIY (backend como punto de integración).

## Fase posterior

Cliente expone botón "reimprimir" que emite evento. Fallback: endpoint REST.
