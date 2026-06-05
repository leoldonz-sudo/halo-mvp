"use client";

import { useEffect, useRef, useState } from "react";
import { XiaomanAvatar } from "@/components/XiaomanAvatar";
import type { ChatTurn, MemorySeed } from "@/lib/types";
import { isClosure } from "@/lib/haloPrompt";

/** Intent words that skip further AI turns and go straight to card generation. */
const CARD_INTENT_WORDS = ["结束", "我要卡片", "生成卡片", "保存", "done", "card please", "get card"];
function hasCardIntent(text: string): boolean {
  const t = text.trim().toLowerCase();
  return CARD_INTENT_WORDS.some((w) => t.includes(w));
}

// Conversation never auto-ends — user decides when to create card

/**
 * HALO guided recall.
 *
 * Live mode (default): real LLM. HALO opens with seed.transcript[0]. The user
 * types their own answer in a textarea. /api/halo/chat returns the next HALO
 * line. When HALO emits the closure sentence, the input hides and the page's
 * "Create my Moment Card" CTA enables.
 *
 * If the API errors at any turn we silently fall back to the frozen seed
 * transcript at the matching position so the demo never strands the user.
 *
 * Preset mode (?shot=talk): plays the frozen seed.transcript for screenshots.
 *
 * onMessages bubbles the running transcript up so the page can later send it
 * to /api/halo/extract.
 */
export function HALOConversation({
  seed,
  preset = false,
  onTurnsShown,
  onComplete,
  onMessages,
  onGenerateCard,
  renderInput = true,
  showHeader = true,
  onRegisterSend,
  onBusyChange,
}: {
  seed: MemorySeed;
  preset?: boolean;
  onTurnsShown: (n: number) => void;
  onComplete: () => void;
  onMessages?: (messages: ChatTurn[]) => void;
  onGenerateCard?: () => void;
  renderInput?: boolean;
  showHeader?: boolean;
  onRegisterSend?: (fn: (text: string) => void) => void;
  onBusyChange?: (busy: boolean) => void;
}) {
  if (preset) {
    return (
      <PresetTranscript
        seed={seed}
        onTurnsShown={onTurnsShown}
        onComplete={onComplete}
        showHeader={showHeader}
      />
    );
  }
  return (
    <LiveConversation
      seed={seed}
      onTurnsShown={onTurnsShown}
      onComplete={onComplete}
      onMessages={onMessages}
      onGenerateCard={onGenerateCard}
      renderInput={renderInput}
      showHeader={showHeader}
      onRegisterSend={onRegisterSend}
      onBusyChange={onBusyChange}
    />
  );
}

// ----------------------------------------------------------------------------
// Live LLM conversation
// ----------------------------------------------------------------------------
function LiveConversation({
  seed,
  onTurnsShown,
  onComplete,
  onMessages,
  onGenerateCard,
  renderInput = true,
  showHeader = true,
  onRegisterSend,
  onBusyChange,
}: {
  seed: MemorySeed;
  onTurnsShown: (n: number) => void;
  onComplete: () => void;
  onMessages?: (messages: ChatTurn[]) => void;
  onGenerateCard?: () => void;
  renderInput?: boolean;
  showHeader?: boolean;
  onRegisterSend?: (fn: (text: string) => void) => void;
  onBusyChange?: (busy: boolean) => void;
}) {
  const opener =
    seed.transcript[0] ?? { role: "halo" as const, text: seed.openerQuestion };

  const [messages, setMessages] = useState<ChatTurn[]>([opener]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [softError, setSoftError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Reset whenever the seed changes (user backed out and picked another).
  useEffect(() => {
    setMessages([opener]);
    setInput("");
    setBusy(false);
    setDone(false);
    setSoftError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed.id]);

  useEffect(() => {
    onTurnsShown(messages.length);
    onMessages?.(messages);
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages, onTurnsShown, onMessages]);

  // Notify parent when busy changes (so external input can be disabled).
  useEffect(() => {
    onBusyChange?.(busy);
  }, [busy, onBusyChange]);

  // Core send logic — accepts text as a param so it can be called externally.
  async function sendText(text: string) {
    const t = text.trim();
    if (!t || busy || done) return;

    if (hasCardIntent(t)) {
      const next: ChatTurn[] = [...messages, { role: "user", text: t }];
      setMessages(next);
      setDone(true);
      onComplete();
      onGenerateCard?.();
      return;
    }

    const next: ChatTurn[] = [...messages, { role: "user", text: t }];
    setMessages(next);
    setBusy(true);
    setSoftError(null);

    const userTurns = next.filter((m) => m.role === "user").length;

    try {
      const r = await fetch("/api/halo/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next,
          seed: {
            entryLabel: seed.entryLabel,
            openerQuestion: seed.openerQuestion,
            imageObservation: seed.imageObservation,
          },
        }),
      });
      if (!r.ok) throw new Error(`chat ${r.status}`);
      const data = (await r.json()) as { reply?: string; done?: boolean; error?: string };
      let reply = (data.reply ?? "").trim();
      if (!reply) throw new Error("empty reply");

      const lastHalo = [...next].reverse().find((m) => m.role === "halo")?.text;
      if (reply === lastHalo) {
        const idx = userTurns * 2;
        reply = seed.transcript[idx]?.text ?? reply;
      }

      const final: ChatTurn[] = [...next, { role: "halo", text: reply }];
      setMessages(final);

      if (data.done || isClosure(reply)) {
        setDone(true);
        onComplete();
      }
    } catch (e) {
      const idx = userTurns * 2;
      const fallback = seed.transcript[idx];
      if (fallback) {
        const final: ChatTurn[] = [...next, fallback];
        setMessages(final);
        if (isClosure(fallback.text)) {
          setDone(true);
          onComplete();
        }
        setSoftError("Network slow — using offline reply.");
      } else {
        setSoftError(e instanceof Error ? e.message : "Network error.");
      }
    } finally {
      setBusy(false);
    }
  }

  // Keep a stable ref to sendText so onRegisterSend captures the latest version.
  const sendTextRef = useRef(sendText);
  useEffect(() => { sendTextRef.current = sendText; });

  // Register send fn with parent (once on mount).
  useEffect(() => {
    onRegisterSend?.((text) => sendTextRef.current(text));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Internal send — used when renderInput=true (own textarea).
  async function send() {
    await sendText(input.trim());
    setInput("");
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="flex flex-col">
      {showHeader && (
        <div className="flex items-center gap-3">
          <XiaomanAvatar size={46} mood={busy ? "thinking" : "idle"} priority />
          <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-faint">
            HALO
          </span>
        </div>
      )}

      <div className={`flex flex-col gap-3 ${showHeader ? "mt-5" : ""}`}>
        {messages.map((t, idx) => (
          <div
            key={idx}
            className={`flex ${t.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`halo-bubble halo-rise ${
                t.role === "user" ? "halo-bubble-user" : "halo-bubble-xiaoman"
              }`}
            >
              {t.text}
            </div>
          </div>
        ))}

        {busy && (
          <div className="flex justify-start">
            <div className="halo-bubble halo-bubble-xiaoman inline-flex items-center gap-1.5">
              <span className="dot-breathe" />
              <span className="dot-breathe d2" />
              <span className="dot-breathe d3" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {renderInput && (
        <div className="mt-5 flex flex-col gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Tell HALO what you remember..."
            rows={3}
            disabled={busy}
            className="halo-input resize-none text-[14.5px] leading-relaxed"
          />
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-faint">
              {softError ?? "Enter to send · Shift+Enter for newline"}
            </span>
            <button
              type="button"
              onClick={send}
              disabled={busy || input.trim().length === 0}
              className="halo-cta halo-cta-secondary px-5 py-2 text-[13px]"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------------
// Preset transcript — used by ?shot=talk for screenshots.
// ----------------------------------------------------------------------------
function PresetTranscript({
  seed,
  onTurnsShown,
  onComplete,
  showHeader = true,
}: {
  seed: MemorySeed;
  onTurnsShown: (n: number) => void;
  onComplete: () => void;
  showHeader?: boolean;
}) {
  const transcript = seed.transcript;
  const cb = useRef({ onTurnsShown, onComplete });
  cb.current = { onTurnsShown, onComplete };

  useEffect(() => {
    cb.current.onTurnsShown(transcript.length);
    cb.current.onComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed.id]);

  return (
    <div className="flex flex-col">
      {showHeader && (
        <div className="flex items-center gap-3">
          <XiaomanAvatar size={46} mood="idle" priority />
          <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-faint">
            HALO
          </span>
        </div>
      )}
      <div className={`flex flex-col gap-3 ${showHeader ? "mt-5" : ""}`}>
        {transcript.map((t, idx) => (
          <div
            key={idx}
            className={`flex ${t.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`halo-bubble ${
                t.role === "user" ? "halo-bubble-user" : "halo-bubble-xiaoman"
              }`}
            >
              {t.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
