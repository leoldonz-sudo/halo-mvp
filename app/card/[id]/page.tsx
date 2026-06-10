"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { MomentCard } from "@/lib/halo/types";
import { getCard, createInvitation } from "@/lib/halo/store";
import { MomentCardView } from "@/components/halo/MomentCardView";

/** Card detail — view a saved Moment Card and share it as a gentle invitation. */
export default function CardDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [mounted, setMounted] = useState(false);
  const [card, setCard] = useState<MomentCard | null>(null);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    if (typeof id === "string") setCard(getCard(id));
    setMounted(true);
  }, [id]);

  // Create a share invitation. Prefer the Supabase-backed API (works across
  // browsers); if Supabase isn't configured or the call fails, fall back to the
  // localStorage invitation (same-browser only).
  async function share() {
    if (!card || sharing) return;
    setSharing(true);
    try {
      const r = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          card,
          question: card.shareQuestion,
          shareMode: "ask_their_version",
        }),
      });
      if (r.ok) {
        const data = (await r.json()) as { id?: string };
        if (data.id) {
          router.push(`/share/${data.id}`);
          return;
        }
      }
      throw new Error("share api unavailable");
    } catch {
      const invitation = createInvitation({
        cardId: card.id,
        shareMode: "ask_their_version",
        question: card.shareQuestion,
      });
      router.push(`/share/${invitation.id}`);
    } finally {
      setSharing(false);
    }
  }

  if (mounted && !card) {
    return (
      <main className="mx-auto flex min-h-[100dvh] max-w-[430px] flex-col items-center justify-center bg-cream px-6 text-center">
        <p className="font-display text-[22px] text-ink">This moment isn’t here</p>
        <p className="mt-2 max-w-[18rem] font-serif text-[14px] text-ink2">
          It may have been kept on another device. Saved moments live in this browser.
        </p>
        <Link href="/map" className="halo-cta halo-cta-primary mt-6 w-full max-w-[18rem]">
          Open Memory Map
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-[430px] flex-col bg-cream px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]">
      <header className="flex items-center justify-between">
        <Link href="/map" aria-label="Back to Memory Map" className="font-mono text-[18px] leading-none text-ink2">
          ←
        </Link>
        <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-rust">Moment Card</span>
        <span className="w-4" />
      </header>

      {!mounted || !card ? (
        <div className="mt-10 text-center font-mono text-[11px] uppercase tracking-[0.24em] text-faint">
          Opening…
        </div>
      ) : (
        <>
          <div className="mt-5">
            <MomentCardView card={card} />
          </div>

          {/* Share question preview */}
          {card.shareQuestion && (
            <div className="mt-6 rounded-[6px] border border-line bg-paper/80 px-4 py-4">
              <p className="font-mono text-[9.5px] uppercase tracking-[0.24em] text-rust">
                Share as a gentle question
              </p>
              <p className="mt-1.5 font-serif text-[15px] leading-snug text-ink">
                {card.shareQuestion}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={share}
              disabled={sharing}
              className="halo-cta halo-cta-primary w-full"
            >
              {sharing ? "Preparing…" : "Share this moment"}
            </button>
            <Link href="/map" className="halo-cta halo-cta-secondary w-full">
              Open Memory Map
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
