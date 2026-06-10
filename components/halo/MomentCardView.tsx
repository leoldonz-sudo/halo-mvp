"use client";

import type { MomentCard } from "@/lib/halo/types";

/**
 * Renders a canonical Moment Card in HALO's existing visual language
 * (warm paper, hairlines, rust accent, no shadows) while surfacing the three
 * product layers: Past Anchor → Present Meaning → Future Orientation.
 *
 * `compact` is the small preview used inside the Share page.
 */
export function MomentCardView({
  card,
  compact = false,
  id,
}: {
  card: MomentCard;
  compact?: boolean;
  id?: string;
}) {
  const tags = [card.emotionSignal, card.valueSignal].filter(
    (t): t is string => !!t && t.trim().length > 0 && t.trim() !== "—",
  );

  if (compact) {
    return (
      <article
        id={id}
        className="overflow-hidden rounded-[6px] border border-line bg-paper px-5 py-5"
        style={{ backgroundImage: "url('/assets/card-texture.png')", backgroundSize: "cover" }}
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.34em] text-faint">HALO</span>
          <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-faint">{card.theme}</span>
        </div>
        <h2 className="mt-2.5 font-display text-[18px] leading-tight text-ink2">{card.title}</h2>
        <blockquote className="mt-3 whitespace-pre-line font-display text-[22px] leading-[1.16] text-ink">
          “{card.originalQuote}”
        </blockquote>
        <p className="mt-3 font-serif text-[14px] italic leading-snug text-ink2">{card.haloLine}</p>
      </article>
    );
  }

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
          <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-faint">{card.theme}</span>
        </div>

        {/* Title */}
        <h2 className="mt-3 font-display text-[20px] leading-tight text-ink2">{card.title}</h2>

        {/* Original quote — emotional center */}
        <blockquote className="mt-4 whitespace-pre-line font-display text-[26px] leading-[1.13] text-ink">
          “{card.originalQuote}”
        </blockquote>

        {/* ── PAST ─────────────────────────────────────────────── */}
        <Layer label="Past · Anchor" className="mt-5">
          <p className="font-serif text-[14px] leading-snug text-ink">{card.concreteMemory}</p>
        </Layer>

        {/* ── PRESENT ──────────────────────────────────────────── */}
        <Layer label="Present · Meaning" className="mt-4">
          <p className="font-serif text-[14px] leading-snug text-ink">{card.presentMeaning}</p>
        </Layer>

        {/* HALO LINE */}
        <div className="mt-4 border-l-2 border-rust/40 pl-3.5">
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-rust">HALO LINE</p>
          <p className="mt-1.5 font-serif text-[15.5px] leading-snug text-ink">{card.haloLine}</p>
        </div>

        {/* ── FUTURE ───────────────────────────────────────────── */}
        <Layer label="Future · Becoming" className="mt-4">
          <p className="font-serif text-[14px] italic leading-snug text-ink2">{card.futureOrientation}</p>
        </Layer>

        {/* Hidden strength + reflection footer */}
        <div className="mt-5 flex flex-col gap-3 border-t border-line pt-4">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-faint">Hidden strength</p>
            <p className="mt-1 font-serif text-[13px] text-ink">{card.hiddenStrength}</p>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-faint">A question for you</p>
            <p className="mt-1 font-serif text-[13px] italic text-ink2">{card.reflectionQuestion}</p>
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line px-2.5 py-[3px] font-mono text-[9px] lowercase tracking-wide text-faint"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function Layer({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-faint">{label}</p>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
