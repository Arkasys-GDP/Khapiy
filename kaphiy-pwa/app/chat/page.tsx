"use client";

import { useChat } from "@/hooks/useChat";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { AiBubble, UserBubble } from "@/components/chat/ChatBubble";
import { DateDivider } from "@/components/chat/DateDivider";

export default function ChatPage() {
  const {
    messages,
    inputValue,
    setInputValue,
    isTyping,
    isRecording,
    isOnline,
    handleSend,
    toggleRecording,
    messagesEndRef,
    inputRef
  } = useChat();

  return (
    <div className="chat-screen">
      <ChatHeader isOnline={isOnline} />

      {/* ── Messages ── */}
      <div className="chat-messages" id="chat-messages-container">
        {/* Gemini badge */}
        <span className="gemini-badge">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" fill="currentColor" />
          </svg>
          Conversación con IA Gemini
        </span>

        <DateDivider label="HOY" />

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

      <ChatInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        isTyping={isTyping}
        isRecording={isRecording}
        handleSend={handleSend}
        toggleRecording={toggleRecording}
        inputRef={inputRef}
      />
    </div>
  );
}
