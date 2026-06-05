"use client";

import type { MemorySignal } from "@/lib/types";

// ── Inline SVG icons ────────────────────────────────────────────────────────

function IconPlace() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1C5.24 1 3 3.24 3 6c0 3.9 5 9 5 9s5-5.1 5-9c0-2.76-2.24-5-5-5zm0 6.75A1.75 1.75 0 1 1 8 4.25a1.75 1.75 0 0 1 0 3.5z"/>
    </svg>
  );
}

function IconTime() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm.75 7.44V4.5a.75.75 0 0 0-1.5 0v4.25c0 .2.08.39.22.53l2.5 2.5a.75.75 0 1 0 1.06-1.06L8.75 8.44z"/>
    </svg>
  );
}

function IconFeeling() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 13.7S1.5 9.9 1.5 5.9C1.5 3.7 3.3 2 5.5 2c1.1 0 2.1.5 2.8 1.3C9 2.5 10 2 11.1 2c2.2 0 3.9 1.8 3.9 3.9 0 4-6.5 7.8-7 7.8z"/>
    </svg>
  );
}

function IconCue() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1l1.5 4.5H14l-3.7 2.7 1.4 4.3L8 9.8l-3.7 2.7 1.4-4.3L2 5.5h4.5z"/>
    </svg>
  );
}

const ICON_MAP: Record<string, React.ReactNode> = {
  place:   <IconPlace />,
  time:    <IconTime />,
  feeling: <IconFeeling />,
  cue:     <IconCue />,
};

const GRID_LABELS = ["place", "time", "feeling", "cue"];

export function MemorySignalsPanel({
  signals,
}: {
  signals: MemorySignal[];
  count?: number; // kept for compat, unused
}) {
  const grid = GRID_LABELS.map(
    (lbl) => signals.find((s) => s.label === lbl) ?? { label: lbl, value: "—" }
  );

  return (
    <div className="halo-noticing">
      <div className="halo-noticing__header">
        <span className="halo-noticing__rule" />
        <span className="halo-noticing__label">✦ HALO IS NOTICING ✦</span>
        <span className="halo-noticing__rule" />
      </div>
      <div className="halo-noticing__grid">
        {grid.map((s, i) => (
          <div
            key={s.label}
            className="halo-signal-card halo-rise"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="halo-signal-card__icon">{ICON_MAP[s.label]}</div>
            <div className="halo-signal-card__body">
              <span className="halo-signal-card__lbl">{s.label}</span>
              <span className="halo-signal-card__val">{s.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
