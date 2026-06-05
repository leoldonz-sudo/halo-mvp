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

/** After this many user turns the "Generate Moment Card" button auto-enables. */
const MAX_FOLLOWUPS = 2;

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
}: {
  seed: MemorySeed;
  preset?: boolean;
  onTurnsShown: (n: number) => void;
  onComplete: () => void;
  onMessages?: (messages: ChatTurn[]) => void;
  /** Called when intent words are detected — triggers immediate card generation. */
  onGenerateCard?: () => void;
}) {
  if (preset) {
    return (
      <PresetTranscript
        seed={seed}
        onTurnsShown={onTurnsShown}
        onComplete={onComplete}
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
}: {
  seed: MemorySeed;
  onTurnsShown: (n: number) => void;
  onComplete: () => void;
  onMessages?: (messages: ChatTurn[]) => void;
  onGenerateCard?: () => void;
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

  async function send() {
    const text = input.trim();
    if (!text || busy || done) return;

    // ── Intent shortcut: user wants the card now ──────────────────────────
    if (hasCardIntent(text)) {
      const next: ChatTurn[] = [...messages, { role: "user", text }];
      setMessages(next);
      setInput("");
      setDone(true);
      onComplete();
      onGenerateCard?.();
      return;
    }

    const next: ChatTurn[] = [...messages, { role: "user", text }];
    setMessages(next);
    setInput("");
    setBusy(true);
    setSoftError(null);

    // Count user turns AFTER appending this message.
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
      const data = (await r.json()) as {
        reply?: string;
        done?: boolean;
        error?: string;
      };
      let reply = (data.reply ?? "").trim();
      if (!reply) throw new Error("empty reply");

      // Dedup: if the reply is identical to the last HALO message, pull the
      // next frozen fallback instead to avoid repeating the same line.
      const lastHalo = [...next].reverse().find((m) => m.role === "halo")?.text;
      if (reply === lastHalo) {
        const idx = userTurns * 2;
        reply = seed.transcript[idx]?.text ?? reply;
      }

      const final: ChatTurn[] = [...next, { role: "halo", text: reply }];
      setMessages(final);

      if (data.done || isClosure(reply) || userTurns >= MAX_FOLLOWUPS) {
        setDone(true);
        onComplete();
      }
    } catch (e) {
      // Fallback: pull the matching position from the frozen transcript so
      // the demo never strands the user when the API hiccups.
      const idx = userTurns * 2; // halo opener at 0, halo replies at 2, 4 …
      const fallback = seed.transcript[idx];
      if (fallback) {
        const final: ChatTurn[] = [...next, fallback];
        setMessages(final);
        if (isClosure(fallback.text) || userTurns >= MAX_FOLLOWUPS) {
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

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Enter sends, Shift+Enter inserts a newline.
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3">
        <XiaomanAvatar size={46} mood={busy ? "thinking" : "idle"} priority />
        <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-faint">
          HALO
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-3">
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

      {!done && (
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
}: {
  seed: MemorySeed;
  onTurnsShown: (n: number) => void;
  onComplete: () => void;
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
      <div className="flex items-center gap-3">
        <XiaomanAvatar size={46} mood="idle" priority />
        <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-faint">
          HALO
        </span>
      </div>
      <div className="mt-5 flex flex-col gap-3">
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
