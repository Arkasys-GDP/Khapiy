"use client";

import { useState } from "react";
import { ChevronLeft, CheckCircle, CreditCard, Banknote, Minus, Plus, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

// ── Tipos ────────────────────────────────────────────────────
type BadgeType = "green" | "rose" | "muted";
type PaymentMethod = "qr" | "cash";

interface OrderItem {
  id: string;
  emoji: string;
  name: string;
  description: string;
  price: number;
  qty: number;
  badges: string[];
  badgeTypes: BadgeType[];
}

// ── Constantes ───────────────────────────────────────────────
const ORDER_ITEMS: OrderItem[] = [
  {
    id: "latte-avellana",
    emoji: "🫗",
    name: "Latte de Avellana",
    description: "Espresso doble · leche de avena · sirope",
    price: 3.80,
    qty: 1,
    badges: ["Oat Milk", "Sin azúcar"],
    badgeTypes: ["green", "muted"],
  },
  {
    id: "galleta-praline",
    emoji: "🍪",
    name: "Galleta Praliné",
    description: "Chocolate 70% · avellana caramelizada",
    price: 1.80,
    qty: 1,
    badges: ["Artesanal"],
    badgeTypes: ["muted"],
  },
];

const IVA_RATE = 0.12;

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; Icon: typeof CreditCard }[] = [
  { id: "qr",   label: "Transferencia / QR", Icon: CreditCard },
  { id: "cash", label: "Efectivo en caja",   Icon: Banknote   },
];

const AI_PREFERENCES = ["Sin azúcar", "Sin nuez", "Extra caliente"];

// ── QR Placeholder ───────────────────────────────────────────
function QRPlaceholder() {
  return (
    <div
      style={{
        width: 140,
        height: 140,
        background: "#fff",
        borderRadius: 12,
        padding: 10,
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: 2,
      }}
    >
      {Array.from({ length: 49 }).map((_, i) => {
        const filled =
          (i % 7 < 3 && i < 21) ||
          (i % 7 > 3 && i < 21) ||
          (i % 7 < 3 && i > 27) ||
          i === 24 ||
          (i % 3 === 0 && i > 20 && i < 28) ||
          (i % 5 === 0 && i > 21);
        return (
          <div
            key={i}
            style={{ borderRadius: 2, background: filled ? "#1a1a1a" : "transparent" }}
          />
        );
      })}
    </div>
  );
}

// ── Pantalla de confirmación ──────────────────────────────────
function ConfirmationScreen({ total, onBack }: { total: number; onBack: () => void }) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--color-praline-bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        gap: "1.5rem",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "4rem" }}>✅</div>
      <h1 className="section-title" style={{ fontSize: "1.8rem" }}>¡Pedido enviado!</h1>
      <p style={{ color: "var(--color-praline-muted)", lineHeight: 1.5, maxWidth: 280 }}>
        Tu pedido fue enviado a cocina. Te avisaremos cuando esté listo. ☕
      </p>
      <div className="praline-card" style={{ padding: "1rem 1.5rem" }}>
        <p style={{ fontSize: "0.8rem", color: "var(--color-praline-muted)" }}>
          Mesa <strong style={{ color: "var(--color-praline-primary-dark)" }}>04</strong> · Total{" "}
          <strong style={{ color: "var(--color-praline-primary-dark)" }}>${total.toFixed(2)}</strong>
        </p>
      </div>
      <button
        className="btn-secondary"
        style={{ width: "auto", padding: "0.75rem 2rem" }}
        onClick={onBack}
      >
        Volver al inicio
      </button>
    </div>
  );
}

// ── Página principal ─────────────────────────────────────────
export default function PedidoPage() {
  const router = useRouter();
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(ORDER_ITEMS.map((item) => [item.id, item.qty]))
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("qr");
  const [confirmed, setConfirmed] = useState(false);

  const updateQty = (id: string, delta: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, (prev[id] ?? 1) + delta) }));
  };

  const subtotal = ORDER_ITEMS.reduce((sum, item) => sum + item.price * (quantities[item.id] ?? 1), 0);
  const iva      = subtotal * IVA_RATE;
  const total    = subtotal + iva;

  if (confirmed) {
    return <ConfirmationScreen total={total} onBack={() => router.push("/inicio")} />;
  }

  return (
    <div style={{ minHeight: "100dvh", background: "var(--color-praline-bg)", paddingBottom: "7rem" }}>

      {/* ── Header ── */}
      <div
        style={{
          background: "var(--color-praline-surface)",
          padding: "1rem 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--color-praline-border)",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            color: "var(--color-praline-brown)",
            fontSize: "0.875rem",
            padding: 0,
          }}
        >
          <ChevronLeft size={20} /> Confirmar Pedido
        </button>
        <span className="badge badge-muted">Paso 3/3</span>
      </div>

      <div style={{ padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>

        {/* ── Banner IA ── */}
        <div
          style={{
            background: "rgba(169,181,162,0.2)",
            border: "1px solid rgba(169,181,162,0.4)",
            borderRadius: 20,
            padding: "0.875rem 1rem",
          }}
        >
          <span style={{ color: "#4a5e44", fontSize: "0.7rem", fontWeight: 700 }}>
            ✦ KHAPIY ENTENDIÓ:
          </span>
          <p style={{ fontSize: "0.85rem", color: "var(--color-praline-primary-dark)", lineHeight: 1.5, marginTop: "0.35rem", fontStyle: "italic" }}>
            &ldquo;Te anoté para ti: 1{" "}
            <strong>Latte de Avellana con leche de avena</strong> y 1{" "}
            <strong>Galleta de Praliné al chocolate</strong> 🍪&rdquo;
          </p>
        </div>

        {/* ── Tu pedido ── */}
        <div>
          <p className="section-label">TU PEDIDO</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {ORDER_ITEMS.map((item) => (
              <div key={item.id} className="praline-card" style={{ padding: "0.875rem" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                  {/* Emoji */}
                  <div
                    style={{
                      width: 44, height: 44, borderRadius: 14,
                      background: "#f0e8de", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontSize: "1.3rem", flexShrink: 0,
                    }}
                  >
                    {item.emoji}
                  </div>

                  <div style={{ flex: 1 }}>
                    {/* Nombre + precio */}
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--color-praline-primary-dark)" }}>
                        {item.name}
                      </span>
                      <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--color-praline-primary-dark)" }}>
                        ${(item.price * (quantities[item.id] ?? 1)).toFixed(2)}
                      </span>
                    </div>

                    {/* Descripción */}
                    <p style={{ fontSize: "0.72rem", color: "var(--color-praline-muted)", margin: "0.15rem 0 0.4rem" }}>
                      {item.description}
                    </p>

                    {/* Badges + Stepper */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                        {item.badges.map((badge, i) => (
                          <span key={badge} className={`badge badge-${item.badgeTypes[i]}`}>
                            {badge}
                          </span>
                        ))}
                      </div>

                      {/* Qty stepper */}
                      <div
                        style={{
                          display: "flex", alignItems: "center", gap: "0.5rem",
                          background: "var(--color-praline-bg-alt)",
                          borderRadius: 9999, padding: "0.25rem 0.5rem",
                          border: "1px solid var(--color-praline-border)",
                        }}
                      >
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          style={{
                            width: 22, height: 22, borderRadius: 9999,
                            background: "var(--color-praline-primary-dark)",
                            border: "none", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                        >
                          <Minus size={11} color="#fff9f4" />
                        </button>
                        <span style={{ fontWeight: 700, fontSize: "0.8rem", color: "var(--color-praline-primary-dark)", minWidth: 16, textAlign: "center" }}>
                          {quantities[item.id] ?? 1}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          style={{
                            width: 22, height: 22, borderRadius: 9999,
                            background: "var(--color-praline-primary-dark)",
                            border: "none", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                        >
                          <Plus size={11} color="#fff9f4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Notas IA ── */}
        <div className="praline-card" style={{ padding: "0.875rem" }}>
          <p className="section-label">NOTAS DE LA IA</p>
          <p style={{ fontSize: "0.72rem", color: "var(--color-praline-muted)", marginBottom: "0.4rem" }}>
            ✦ KHAPIY detectó estas preferencias:
          </p>
          <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", marginBottom: "0.4rem" }}>
            {AI_PREFERENCES.map((pref) => (
              <span key={pref} className="badge badge-muted">{pref}</span>
            ))}
          </div>
          <p style={{ fontSize: "0.67rem", color: "var(--color-praline-muted)", fontStyle: "italic" }}>
            Basado en tu conversación en el chat.
          </p>
        </div>

        {/* ── Resumen ── */}
        <div className="praline-card" style={{ padding: "0.875rem" }}>
          <p className="section-label">RESUMEN</p>
          {[
            { label: "Subtotal",  value: subtotal },
            { label: "IVA 12%",   value: iva      },
            { label: "Servicio",  value: 0        },
          ].map((row) => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <span style={{ fontSize: "0.82rem", color: "var(--color-praline-muted)" }}>{row.label}</span>
              <span style={{ fontSize: "0.82rem", color: "var(--color-praline-brown)" }}>${row.value.toFixed(2)}</span>
            </div>
          ))}
          <div style={{ height: 1, background: "var(--color-praline-border)", margin: "0.6rem 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-praline-primary-dark)" }}>Total</span>
            <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--color-praline-primary-dark)" }}>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* ── Método de pago ── */}
        <div>
          <p className="section-label">MÉTODO DE PAGO</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {PAYMENT_OPTIONS.map(({ id, label, Icon }) => {
              const isSelected = paymentMethod === id;
              return (
                <button
                  key={id}
                  onClick={() => setPaymentMethod(id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "var(--color-praline-surface)",
                    border: `1.5px solid ${isSelected ? "var(--color-praline-dark)" : "var(--color-praline-border)"}`,
                    borderRadius: 20,
                    padding: "0.875rem 1rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    {/* Radio circle */}
                    <div
                      style={{
                        width: 18, height: 18, borderRadius: 9999,
                        border: `2px solid ${isSelected ? "var(--color-praline-dark)" : "var(--color-praline-border)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      {isSelected && (
                        <div style={{ width: 8, height: 8, borderRadius: 9999, background: "var(--color-praline-dark)" }} />
                      )}
                    </div>
                    <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-praline-primary-dark)" }}>
                      {label}
                    </span>
                  </div>
                  <span style={{ color: "var(--color-praline-muted)" }}>
                    <Icon size={16} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── QR Code ── */}
        {paymentMethod === "qr" && (
          <div className="praline-card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--color-praline-primary-dark)", letterSpacing: "0.08em" }}>
              ESCANEA PARA PAGAR ${total.toFixed(2)}
            </p>
            <QRPlaceholder />
            <p style={{ fontSize: "0.7rem", color: "var(--color-praline-muted)", lineHeight: 1.6, textAlign: "center" }}>
              Banco Pichincha · Cta Corriente 28181<br />
              Praline Coffee House CI: 1792828282001
            </p>
          </div>
        )}

        {/* ── Privacidad ── */}
        <div
          style={{
            display: "flex", gap: "0.5rem",
            background: "rgba(162,117,114,0.08)",
            borderRadius: 16, padding: "0.75rem",
            border: "1px solid rgba(162,117,114,0.15)",
          }}
        >
          <Lock size={14} color="var(--color-praline-rose)" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: "0.68rem", color: "var(--color-praline-muted)", lineHeight: 1.5 }}>
            <strong style={{ color: "var(--color-praline-rose)" }}>Privacidad protegida.</strong> Tus datos son
            tratados bajo la <strong>LOPDP Ecuador</strong> (Ley Orgánica de Protección de Datos Personales).
            Solo procesamos tu pedido.
          </p>
        </div>
      </div>

      {/* ── Botón confirmar (fixed) ── */}
      <div
        style={{
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: 430, padding: "1rem 1.25rem 1.5rem",
          background: "linear-gradient(to top, var(--color-praline-bg) 60%, transparent)",
          zIndex: 50,
        }}
      >
        <button className="btn-primary" onClick={() => setConfirmed(true)} style={{ gap: "0.5rem" }}>
          <CheckCircle size={17} />
          Confirmar y enviar a cocina
        </button>
      </div>
    </div>
  );
}
