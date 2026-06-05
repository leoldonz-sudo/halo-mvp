"use client";

import type { MemorySignal } from "@/lib/types";

/**
 * Memory Signals. Reads like margin notes in a journal, not an observability
 * log. Grows in step with the conversation; the theme line gets the rust accent.
 */
export function MemorySignalsPanel({
  signals,
  count,
}: {
  signals: MemorySignal[];
  count: number;
}) {
  const shown = signals.slice(0, Math.max(0, count));

  return (
    <aside className="border-t border-line pt-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-faint">
        Memory signals
      </p>
      <ul className="mt-3 flex flex-col gap-2.5">
        {shown.map((s, i) => (
          <li
            key={s.label}
            className="halo-rise flex gap-3"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <span className="w-20 shrink-0 font-mono text-[11px] lowercase tracking-wide text-ink2">
              {s.label}
            </span>
            <span
              className={`font-serif text-[14px] leading-snug ${
                s.key ? "text-rust" : "text-ink"
              }`}
            >
              {s.value}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
