"use client";

import type { MomentCard as MomentCardType } from "@/lib/types";

/**
 * Moment Card — collectible memory artifact, not an AI report.
 * User's original quote is the emotional center.
 * THEN / NOW / EVIDENCE / PART OF removed.
 * Replaced with HALO LINE + simple THREAD / ARC footer + metadata tags.
 */
export function MomentCard({ card, id }: { card: MomentCardType; id?: string }) {
  const showObjectArea =
    card.entryLabel.toLowerCase().includes("photo") ||
    card.entryLabel.toLowerCase().includes("object") ||
    !!card.metadata.object;

  const tags = [
    card.metadata.place,
    card.metadata.stage,
    card.metadata.time,
    card.metadata.object,
  ].filter((t): t is string => !!t && t.length > 0);

  return (
    <article
      id={id}
      className="overflow-hidden rounded-[6px] border border-line bg-paper"
      style={{ backgroundImage: "url('/assets/card-texture.png')", backgroundSize: "cover" }}
    >
      <div className="px-5 pt-5 pb-6">

        {/* Top label row */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.34em] text-faint">HALO</span>
          <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-faint">{card.entryLabel}</span>
        </div>

        {/* Title */}
        <h2 className="mt-3 font-display text-[19px] leading-tight text-ink2">{card.title}</h2>

        {/* Object / photo placeholder — warm sepia-toned block */}
        {showObjectArea && (
          <div className="mt-3 flex items-center gap-3">
            <div
              className="h-[62px] w-[62px] flex-none overflow-hidden rounded-[6px] border border-line"
              style={{ background: "linear-gradient(145deg, #e8dfc8 0%, #cfc4aa 100%)" }}
              aria-hidden
            />
            {card.originalFragment && (
              <p className="font-mono text-[10px] leading-snug tracking-[0.12em] text-faint">
                {card.originalFragment}
              </p>
            )}
          </div>
        )}

        {/* Main quote — emotional center */}
        <blockquote className="mt-4 whitespace-pre-line font-display text-[26px] leading-[1.13] text-ink">
          "{card.originalQuote}"
        </blockquote>

        {/* Context line — only when no object area (avoids duplication) */}
        {!showObjectArea && card.originalFragment && (
          <p className="mt-2 font-mono text-[10px] tracking-[0.12em] text-faint">
            {card.originalFragment}
          </p>
        )}

        {/* HALO LINE */}
        <div className="mt-5 border-l-2 border-rust/40 pl-3.5">
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-rust">HALO LINE</p>
          <p className="mt-1.5 font-serif text-[15.5px] leading-snug text-ink">{card.haloLine}</p>
        </div>

        {/* THREAD · ARC footer */}
        <div className="mt-5 flex items-start justify-between gap-3 border-t border-line pt-4">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-faint">THREAD</p>
            <p className="mt-1 font-serif text-[13px] text-ink">{card.primaryTheme}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-faint">ARC</p>
            <p className="mt-1 font-serif text-[13px] italic text-ink2">{card.arcHint}</p>
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full border border-line px-2.5 py-[3px] font-mono text-[9px] lowercase tracking-wide text-faint">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
