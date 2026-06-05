"use client";

import type { EntryType } from "@/lib/types";
import { HOME_PREVIEW } from "@/lib/demoData";

type Entry = {
  type: EntryType;
  title: string;
  sub: string;
  tone: "solid" | "ghost";
};

const ENTRIES: Entry[] = [
  {
    type: "uncaptured",
    title: "A moment I never captured",
    sub: "For a memory that stayed, even without a photo.",
    tone: "solid",
  },
  {
    type: "photo-object",
    title: "A photo or object I kept",
    sub: "For something you kept, even if others may not understand why.",
    tone: "solid",
  },
  {
    type: "guided",
    title: "Let HALO guide me",
    sub: "For when you don't know where to start.",
    tone: "ghost",
  },
];

/**
 * Screen 1 — Home. Three doors, not three input boxes. The hero line creates the
 * feeling of being seen before any feature is explained. A warm cinematic image
 * sits behind the top, code renders all text on top of it.
 */
export function HomeHero({ onPick }: { onPick: (type: EntryType) => void }) {
  return (
    <main className="relative z-10 flex min-h-[100dvh] flex-col px-6 pb-[max(2.25rem,env(safe-area-inset-bottom))] pt-[max(3rem,env(safe-area-inset-top))]">
      {/* warm cinematic atmosphere behind the headline */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[44%] bg-cover bg-center opacity-90"
        style={{
          backgroundImage: "url('/assets/hero-bg.png')",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0) 100%)",
        }}
      />

      <p className="font-mono text-[11px] uppercase tracking-[0.38em] text-faint">
        HALO
      </p>

      <h1 className="mt-8 font-display text-[clamp(34px,9.4vw,46px)] font-medium leading-[1.03] tracking-[-0.01em] text-ink">
        Hello.
        <br />
        I see your halo.
      </h1>

      <p className="mt-4 font-display text-[22px] leading-snug text-ink2">
        Map the moments that made you.
      </p>

      <p className="mt-3 max-w-[34ch] font-sans text-[13px] leading-relaxed text-ink2">
        Start with something you kept, something you never captured, or a gentle
        question from HALO.
      </p>

      <div className="mt-7 flex flex-col gap-2.5">
        {ENTRIES.map((e) => (
          <button
            key={e.type}
            type="button"
            onClick={() => onPick(e.type)}
            className={`w-full rounded-[3px] border border-line text-left transition active:scale-[0.99] ${
              e.tone === "ghost" ? "bg-transparent" : "bg-paper/90 backdrop-blur-[1px]"
            }`}
          >
            <div className="px-5 py-3.5">
              <div className="flex items-baseline justify-between gap-3">
                <span
                  className={`font-display text-[19px] ${
                    e.tone === "ghost" ? "text-ink2" : "text-ink"
                  }`}
                >
                  {e.title}
                </span>
                <span className="font-mono text-[13px] text-faint">→</span>
              </div>
              <p className="mt-1 font-sans text-[12px] leading-relaxed text-ink2">
                {e.sub}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* light map preview — not the full atlas */}
      <section className="mt-7 border-t border-line pt-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-faint">
          Your map can begin with one kept moment
        </p>
        <div className="mt-3 flex items-center gap-3">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-green/60" />
          <span className="font-serif text-[15px] text-ink2">
            {HOME_PREVIEW.recentCard}
          </span>
          <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-faint">
            Example
          </span>
        </div>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.26em] text-faint">
          Moments you could keep next
        </p>
        <ul className="mt-2 flex flex-col gap-2 opacity-55">
          {HOME_PREVIEW.nextPrompts.map((p) => (
            <li key={p} className="flex items-center gap-3">
              <span className="inline-block h-2 w-2 rounded-full border border-line" />
              <span className="font-serif text-[14px] text-ink2">{p}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-auto" />
    </main>
  );
}
