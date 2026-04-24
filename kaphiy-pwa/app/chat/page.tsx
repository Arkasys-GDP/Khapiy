"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

type MessageRole = "ai" | "user";

interface ProductSuggestion {
  id: string;
  name: string;
  description: string;
  price: string;
  emoji: string;
}

interface Message {
  id: string;
  role: MessageRole;
  text: string;
  time: string;
  suggestions?: ProductSuggestion[];
  orderSummary?: string[];
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "ai",
    text: "¡Hola! 👋 Soy el **Asistente KHAPIY** de Praliné Coffee House.\n\nEstoy aquí para ayudarte a encontrar la bebida o snack perfecto para este momento. ¿Qué te apetece hoy?",
    time: "22:48",
  },
  {
    id: "2",
    role: "user",
    text: "Hola! Quiero algo caliente con leche de avena",
    time: "22:49",
  },
  {
    id: "3",
    role: "ai",
    text: "¡Excelente elección! 🎯 Basándome en tu preferencia, te recomiendo estas dos opciones perfectas con oat milk:",
    time: "22:49",
    suggestions: [
      { id: "p1", name: "Latte de Avellana", description: "Espresso · oat milk", price: "$3.80", emoji: "☕" },
      { id: "p2", name: "Matcha Latte",      description: "Ceremonial · oat",    price: "$4.20", emoji: "🍵" },
    ],
  },
  {
    id: "4",
    role: "user",
    text: "Perfecto, quiero el Latte de Avellana y también una galleta",
    time: "22:50",
  },
  {
    id: "5",
    role: "ai",
    text: "Anotado ✅ He agregado a tu pedido:\n\n• **1 Latte de Avellana** con oat milk\n• **1 Galleta Praliné** de chocolate\n\n¿Deseas confirmar y enviar a cocina, o quieres añadir algo más?",
    time: "22:50",
    orderSummary: ["1 Latte de Avellana con oat milk", "1 Galleta Praliné de chocolate"],
  },
];

const QUICK_SUGGESTIONS = [
  "¿Qué me recomiendas?",
  "Ver opciones de Brunch",
  "¿Tienen sin gluten?",
  "Confirmar pedido",
];

function formatTime() {
  return new Date().toLocaleTimeString("es-EC", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function parseBold(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold">{part}</strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function AiBubble({ message }: { message: Message }) {
  return (
    <div className="chat-bubble-row chat-bubble-row--ai">
      {/* Avatar */}
      <div className="chat-ai-avatar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" fill="currentColor" />
        </svg>
      </div>

      {/* Bubble */}
      <div className="chat-bubble chat-bubble--ai">
        <p className="chat-bubble__text">
          {message.text.split("\n").map((line, i) => (
            <span key={i}>
              {parseBold(line)}
              {i < message.text.split("\n").length - 1 && <br />}
            </span>
          ))}
        </p>

        {/* Product cards */}
        {message.suggestions && (
          <div className="chat-suggestions">
            {message.suggestions.map((s) => (
              <button key={s.id} id={`suggestion-${s.id}`} className="chat-product-card">
                <span className="chat-product-card__emoji">{s.emoji}</span>
                <div className="chat-product-card__info">
                  <span className="chat-product-card__name">{s.name}</span>
                  <span className="chat-product-card__desc">{s.description} · {s.price}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        <span className="chat-bubble__time">{message.time} · IA Gemini</span>
      </div>
    </div>
  );
}

function UserBubble({ message }: { message: Message }) {
  return (
    <div className="chat-bubble-row chat-bubble-row--user">
      <div className="chat-bubble chat-bubble--user">
        <p className="chat-bubble__text">{message.text}</p>
        <span className="chat-bubble__time chat-bubble__time--user">{message.time}</span>
      </div>
    </div>
  );
}

function DateDivider({ label }: { label: string }) {
  return (
    <div className="chat-date-divider">
      <span>{label}</span>
    </div>
  );
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function handleSend(text?: string) {
    const msg = text ?? inputValue.trim();
    if (!msg) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: msg,
      time: formatTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: "¡Entendido! 🤖 Aquí iría la respuesta de Gemini AI en tiempo real. Por ahora esto es un mockup de la interfaz.",
        time: formatTime(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1400);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="chat-screen">
      {/* ── Header ── */}
      <header className="chat-header">
        <button
          id="chat-back-btn"
          className="chat-header__back"
          onClick={() => router.back()}
          aria-label="Volver"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="chat-header__avatar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" fill="currentColor" />
          </svg>
          <span className="chat-header__online-dot" />
        </div>

        <div className="chat-header__info">
          <p className="chat-header__name">Asistente Praliné</p>
          <p className="chat-header__status">
            ● En línea{" "}
            <span>· Mesa 04</span>
          </p>
        </div>

        <button id="chat-menu-btn" className="chat-header__menu" aria-label="Opciones">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5"  r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      </header>

      {/* ── Messages ── */}
      <div className="chat-messages" id="chat-messages-container">
        {/* Gemini badge */}
        <span className="gemini-badge">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" fill="currentColor" />
          </svg>
          Conversación con IA Gemini
        </span>

        <DateDivider label="HOY · 22:48" />

        {messages.map((msg) =>
          msg.role === "ai" ? (
            <AiBubble key={msg.id} message={msg} />
          ) : (
            <UserBubble key={msg.id} message={msg} />
          )
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="chat-typing">
            <div className="chat-ai-avatar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" fill="currentColor" />
              </svg>
            </div>
            <div className="chat-typing__bubble">
              <span className="chat-typing__dot" />
              <span className="chat-typing__dot" />
              <span className="chat-typing__dot" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Quick suggestions bar ── */}
      <div className="chat-quick-bar" id="chat-quick-bar">
        {QUICK_SUGGESTIONS.map((s) => (
          <button
            key={s}
            id={`quick-${s.replace(/\s+/g, "-").toLowerCase()}`}
            className="chat-quick-chip"
            onClick={() => handleSend(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* ── Input bar ── */}
      <div className="chat-input-bar">
        <div className="chat-input-wrap">
          <input
            ref={inputRef}
            id="chat-input"
            className="chat-input"
            type="text"
            placeholder="Escribe tu pedido..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          <button id="chat-mic-btn" className="chat-input-mic" aria-label="Voz">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="2" width="6" height="11" rx="3" />
              <path d="M5 10a7 7 0 0 0 14 0" />
              <line x1="12" y1="19" x2="12" y2="22" />
              <line x1="9"  y1="22" x2="15" y2="22" />
            </svg>
          </button>
        </div>

        <button
          id="chat-send-btn"
          className="chat-send-btn"
          onClick={() => handleSend()}
          disabled={!inputValue.trim() && !isTyping}
          aria-label="Enviar mensaje"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
