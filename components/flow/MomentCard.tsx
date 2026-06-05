"use client";

import type { MomentCard as MomentCardType } from "@/lib/types";

/**
 * Moment Card — memory evidence, not an AI postcard. The original quote is the
 * visual center; the Halo Line is the second voice. Warm paper texture, hairline
 * rules, no box-shadow. Presentational only — actions live in ResultPage.
 */
export function MomentCard({
  card,
  id,
}: {
  card: MomentCardType;
  id?: string;
}) {
  return (
    <article
      id={id}
      className="overflow-hidden rounded-[4px] border border-line bg-paper"
      style={{
        backgroundImage: "url('/assets/card-texture.png')",
        backgroundSize: "cover",
      }}
    >
      <div className="px-5 py-6">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.34em] text-faint">
            HALO
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
            {card.entryLabel}
          </span>
        </div>

        <h2 className="mt-4 font-display text-[20px] leading-tight text-ink2">
          {card.title}
        </h2>

        <blockquote className="mt-3 whitespace-pre-line font-display text-[28px] leading-[1.14] text-ink">
          “{card.originalQuote}”
        </blockquote>

        <div className="mt-5 border-l-2 border-rust/50 pl-4">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.28em] text-rust">
            Halo line
          </p>
          <p className="mt-1.5 font-serif text-[16.5px] leading-snug text-ink">
            {card.haloLine}
          </p>
        </div>

        <dl className="mt-6 flex flex-col gap-3 border-t border-line pt-5">
          <Row k="THEN" v={card.thenFelt} />
          <Row k="NOW" v={card.nowSee} />
          <Row k="EVIDENCE" v={card.evidence} rust />
        </dl>

        <div className="mt-6 flex items-end justify-between border-t border-line pt-4">
          <div>
            <p className="font-mono text-[9.5px] uppercase tracking-[0.24em] text-faint">
              Part of
            </p>
            <p className="mt-1 font-serif text-[14px] text-ink">
              {card.primaryTheme}
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.24em] text-faint">
              Arc forming
            </p>
            <p className="mt-1 font-serif text-[14px] italic text-ink2">
              {card.arcHint}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

function Row({ k, v, rust }: { k: string; v: string; rust?: boolean }) {
  return (
    <div className="flex gap-3">
      <dt
        className={`w-[76px] shrink-0 font-mono text-[10.5px] uppercase tracking-wider ${
          rust ? "text-rust" : "text-faint"
        }`}
      >
        {k}
      </dt>
      <dd
        className={`font-serif text-[14px] leading-snug ${
          rust ? "text-rust" : "text-ink"
        }`}
      >
        {v}
      </dd>
    </div>
  );
}
