"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/features/auth/store/authSlice";
import { useSound } from "@/src/features/notifications/useSound";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const { unlock } = useSound();

  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pin) return;
    setLoading(true);
    setError("");

    try {
      // Placeholder — replace with real POST /auth/login when backend ready
      await new Promise((r) => setTimeout(r, 600));
      const mockToken = `mock-jwt-${Date.now()}`;
      unlock(); // allow audio after user gesture
      login(mockToken);
      router.replace("/orders");
    } catch {
      setError("PIN incorrecto. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-6">
      {/* Brand */}
      <h1 className="font-display mb-2 text-4xl font-semibold tracking-widest text-[var(--praline)]">
        PRALIN<em className="not-italic text-[var(--crema)]">É</em>
      </h1>
      <p className="mb-10 text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
        Panel de Cocina
      </p>

      <form
        onSubmit={handleSubmit}
        aria-label="Formulario de ingreso"
        className="ticket-card w-full max-w-sm px-8 py-10"
      >
        <h2 className="mb-6 text-lg font-bold text-[var(--foreground)]">
          Acceso de Barista
        </h2>

        <label htmlFor="pin" className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
          PIN de turno
        </label>
        <div className="relative mb-6">
          <input
            id="pin"
            type={showPin ? "text" : "password"}
            inputMode="numeric"
            autoComplete="current-password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="••••••"
            maxLength={8}
            required
            aria-invalid={!!error}
            aria-describedby={error ? "pin-error" : undefined}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--input)] px-4 py-3 pr-12 font-mono text-lg tracking-widest text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--praline)] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPin((v) => !v)}
            aria-label={showPin ? "Ocultar PIN" : "Mostrar PIN"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            {showPin ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
          </button>
        </div>

        {error && (
          <p id="pin-error" role="alert" className="mb-4 text-xs font-medium text-[var(--sem-alert)]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !pin}
          aria-busy={loading}
          className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-[18px] bg-[var(--praline)] px-4 py-4 text-sm font-bold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 active:translate-y-0.5"
        >
          <LogIn className="size-4" aria-hidden />
          {loading ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
