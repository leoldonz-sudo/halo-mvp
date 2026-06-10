"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { MomentCard, SharedMemoryResponse } from "@/lib/halo/types";
import { addResponse, getCard, getInvitation, listResponses } from "@/lib/halo/store";
import { MomentCardView } from "@/components/halo/MomentCardView";

/**
 * Share page — what the recipient of a gentle invitation sees.
 *
 * Data source is resolved at load time:
 *  - Supabase (via /api/share/[shareId]) when configured → works across browsers
 *    and devices; responses persist server-side.
 *  - localStorage fallback (same browser) when Supabase is not configured, or
 *    for legacy localStorage share links.
 *
 * The UI is identical for both sources.
 */

type Status = "loading" | "ready" | "notfound";
type Source = "supabase" | "local";

export default function SharePage() {
  const params = useParams<{ shareId: string }>();
  const shareId = params?.shareId;

  const [status, setStatus] = useState<Status>("loading");
  const [source, setSource] = useState<Source>("local");
  const [card, setCard] = useState<MomentCard | null>(null);
  const [question, setQuestion] = useState<string | null>(null);
  const [responses, setResponses] = useState<SharedMemoryResponse[]>([]);

  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (typeof shareId !== "string") {
        setStatus("notfound");
        return;
      }
      // 1) Try the Supabase-backed API (cross-browser).
      try {
        const r = await fetch(`/api/share/${shareId}`);
        if (r.ok) {
          const d = (await r.json()) as {
            invitation?: { card?: MomentCard; question?: string | null };
            responses?: SharedMemoryResponse[];
          };
          if (!cancelled && d.invitation?.card) {
            setCard(d.invitation.card);
            setQuestion(d.invitation.question ?? d.invitation.card.shareQuestion ?? null);
            setResponses(d.responses ?? []);
            setSource("supabase");
            setStatus("ready");
            return;
          }
        }
        // 404 / 503 → fall through to localStorage.
      } catch {
        // network error → fall through to localStorage.
      }
      if (cancelled) return;
      // 2) localStorage fallback (legacy link / Supabase off).
      const inv = getInvitation(shareId);
      const c = inv ? getCard(inv.cardId) : null;
      if (inv && c) {
        setCard(c);
        setQuestion(inv.question ?? c.shareQuestion ?? null);
        setResponses(listResponses(inv.id));
        setSource("local");
        setStatus("ready");
      } else {
        setStatus("notfound");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [shareId]);

  async function submit() {
    if (!card || !text.trim() || submitting || typeof shareId !== "string") return;
    setSubmitting(true);
    try {
      if (source === "supabase") {
        const r = await fetch(`/api/share/${shareId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ responseText: text, responderName: name }),
        });
        if (r.ok) {
          const d = (await r.json()) as { responses?: SharedMemoryResponse[] };
          setResponses(d.responses ?? []);
          setText("");
        }
        return;
      }
      // localStorage source
      const inv = getInvitation(shareId);
      if (inv) {
        addResponse(inv, card, text, name);
        setResponses(listResponses(inv.id));
        setText("");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "notfound") {
    return (
      <main className="mx-auto flex min-h-[100dvh] max-w-[430px] flex-col items-center justify-center bg-cream px-6 text-center">
        <p className="font-display text-[22px] text-ink">This invitation isn’t here</p>
        <p className="mt-2 max-w-[18rem] font-serif text-[14px] text-ink2">
          The link may be incomplete, or the moment is no longer shared.
        </p>
        <Link href="/map" className="halo-cta halo-cta-primary mt-6 w-full max-w-[18rem]">
          Open Memory Map
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-[430px] flex-col bg-cream px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]">
      <header className="flex items-center justify-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-rust">
          A memory, shared with you
        </span>
      </header>

      {status === "loading" || !card ? (
        <div className="mt-10 text-center font-mono text-[11px] uppercase tracking-[0.24em] text-faint">
          Opening…
        </div>
      ) : (
        <>
          <p className="mt-6 font-serif text-[14px] italic leading-snug text-ink2">
            Someone shared this moment with you, and left a gentle question.
          </p>

          <div className="mt-4">
            <MomentCardView card={card} compact />
          </div>

          {question && (
            <div className="mt-5 border-l-2 border-rust/40 pl-3.5">
              <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-rust">They ask</p>
              <p className="mt-1.5 font-serif text-[16px] leading-snug text-ink">{question}</p>
            </div>
          )}

          {/* Response form */}
          <div className="mt-6">
            <label className="font-mono text-[9.5px] uppercase tracking-[0.24em] text-faint">
              Your version of this moment
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What do you remember? You don’t need many words."
              rows={4}
              className="halo-input mt-2 resize-none text-[14.5px] leading-relaxed"
            />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="halo-input mt-2 text-[14px]"
            />
            <button
              type="button"
              onClick={submit}
              disabled={!text.trim() || submitting}
              className="halo-cta halo-cta-primary mt-3 w-full"
            >
              {submitting ? "Adding…" : "Add my memory"}
            </button>
          </div>

          {/* Relationship memory thread */}
          {responses.length > 0 && (
            <section className="mt-8">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.24em] text-green">
                  Relationship memory thread
                </span>
                <span className="h-px flex-1 bg-line" />
              </div>
              <p className="mt-2 font-serif text-[13px] italic leading-snug text-ink2">
                One moment, now held by two people{card.theme ? ` · ${card.theme}` : ""}.
              </p>

              <ol className="mt-4 flex flex-col gap-3">
                {/* The original memory */}
                <li className="rounded-[6px] border border-line bg-paper px-4 py-3">
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-faint">
                    The original moment
                  </p>
                  <p className="mt-1.5 whitespace-pre-line font-display text-[16px] leading-snug text-ink">
                    “{card.originalQuote}”
                  </p>
                </li>

                {/* Each response */}
                {responses.map((r) => (
                  <li
                    key={r.id}
                    className="rounded-[6px] border border-line bg-mist/50 px-4 py-3"
                  >
                    <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-rust">
                      {r.responderName ? `${r.responderName}’s version` : "Their version"}
                    </p>
                    <p className="mt-1.5 whitespace-pre-line font-serif text-[14.5px] leading-snug text-ink">
                      {r.responseText}
                    </p>
                  </li>
                ))}
              </ol>

              <p className="mt-5 text-center font-mono text-[9.5px] uppercase tracking-[0.2em] text-faint">
                This is how one memory becomes a shared one.
              </p>
            </section>
          )}
        </>
      )}
    </main>
  );
}
