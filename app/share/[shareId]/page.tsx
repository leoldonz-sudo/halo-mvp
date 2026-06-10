"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type {
  MomentCard,
  RelationshipMemoryThread,
  ShareInvitation,
  SharedMemoryResponse,
} from "@/lib/halo/types";
import {
  addResponse,
  getCard,
  getInvitation,
  getThread,
  listResponses,
} from "@/lib/halo/store";
import { MomentCardView } from "@/components/halo/MomentCardView";

/**
 * Share page — what the recipient of a gentle invitation sees.
 * They read the Moment Card and the share question, then add their own version
 * of the memory. Their response weaves into a relationship memory thread shown
 * below the card.
 *
 * MVP note: persistence is localStorage, so in this demo the "recipient" is the
 * same browser. In production this route is opened by another person and the
 * thread links two accounts (see README "Current Limitations").
 */
export default function SharePage() {
  const params = useParams<{ shareId: string }>();
  const shareId = params?.shareId;

  const [mounted, setMounted] = useState(false);
  const [invitation, setInvitation] = useState<ShareInvitation | null>(null);
  const [card, setCard] = useState<MomentCard | null>(null);
  const [responses, setResponses] = useState<SharedMemoryResponse[]>([]);
  const [thread, setThread] = useState<RelationshipMemoryThread | null>(null);

  const [name, setName] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    if (typeof shareId === "string") {
      const inv = getInvitation(shareId);
      setInvitation(inv);
      if (inv) {
        setCard(getCard(inv.cardId));
        setResponses(listResponses(inv.id));
        setThread(getThread(inv.id));
      }
    }
    setMounted(true);
  }, [shareId]);

  function submit() {
    if (!invitation || !card || !text.trim()) return;
    const { thread: nextThread } = addResponse(invitation, card, text, name);
    setResponses(listResponses(invitation.id));
    setThread(nextThread);
    setText("");
  }

  if (mounted && (!invitation || !card)) {
    return (
      <main className="mx-auto flex min-h-[100dvh] max-w-[430px] flex-col items-center justify-center bg-cream px-6 text-center">
        <p className="font-display text-[22px] text-ink">This invitation isn’t here</p>
        <p className="mt-2 max-w-[18rem] font-serif text-[14px] text-ink2">
          Shared moments live in the browser that created them.
        </p>
        <Link href="/map" className="halo-cta halo-cta-primary mt-6 w-full max-w-[18rem]">
          Open Memory Map
        </Link>
      </main>
    );
  }

  const question = invitation?.question || card?.shareQuestion;

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-[430px] flex-col bg-cream px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]">
      <header className="flex items-center justify-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-rust">
          A memory, shared with you
        </span>
      </header>

      {!mounted || !card ? (
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
              disabled={!text.trim()}
              className="halo-cta halo-cta-primary mt-3 w-full"
            >
              Add my memory
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
                One moment, now held by two people{thread?.theme ? ` · ${thread.theme}` : ""}.
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
