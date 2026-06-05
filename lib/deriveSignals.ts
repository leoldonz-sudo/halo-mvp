/**
 * Derives Memory Signals from the actual live conversation.
 * Shows "—" for any field that cannot be confidently extracted.
 * Never fabricates details.
 */

import type { ChatTurn, MemorySignal } from "./types";

const EMPTY: MemorySignal[] = [
  { label: "cue",     value: "—" },
  { label: "place",   value: "—" },
  { label: "time",    value: "—" },
  { label: "feeling", value: "—" },
  { label: "theme",   value: "—", key: true },
  { label: "quote",   value: "—" },
];

const FEELING_WORDS = [
  "happy", "sad", "anxious", "scared", "excited", "nervous", "proud",
  "lonely", "hopeful", "lost", "confused", "angry", "grateful", "relieved",
  "overwhelmed", "peaceful", "afraid", "worried", "joyful", "tired",
  "frustrated", "calm", "heartbroken", "content", "empty", "numb",
  "surprised", "moved", "guilty", "ashamed", "helpless", "powerless",
];

const CUE_VERBS = [
  "waiting", "watching", "sitting", "standing", "holding", "looking",
  "thinking", "hearing", "walking", "running", "leaving", "arriving",
  "crying", "laughing", "starting", "ending", "missing", "losing",
  "finding", "remembering", "wondering", "hoping", "trying", "working",
];

export function deriveSignals(messages: ChatTurn[]): MemorySignal[] {
  const userMsgs = messages
    .filter((m) => m.role === "user")
    .map((m) => m.text.trim())
    .filter(Boolean);

  if (userMsgs.length === 0) return EMPTY;

  const fullText = userMsgs.join(" ");

  // ── quote: longest user message, taken verbatim ─────────────────────────
  const longest = userMsgs.reduce((a, b) => (b.length > a.length ? b : a), "");
  const raw = longest.replace(/^["']|["']$/g, "").trim();
  const quote = raw.length > 0
    ? `"${raw.slice(0, 90)}${raw.length > 90 ? "…" : ""}"`
    : "—";

  // ── cue: first gerund/action word the user mentions ──────────────────────
  const cueRx = new RegExp(`\\b(${CUE_VERBS.join("|")})\\b`, "i");
  const cueMatch = fullText.match(cueRx);
  const cue = cueMatch ? cueMatch[1].toLowerCase() : "—";

  // ── place: capitalized noun after at / in / near / from ─────────────────
  const placeMatch = fullText.match(
    /\b(?:at|in|near|from|inside|outside)\s+(?:the\s+)?([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)/
  );
  const place = placeMatch ? placeMatch[1] : "—";

  // ── time: recognisable time expressions ─────────────────────────────────
  const timeMatch = fullText.match(
    /\b(\d{1,2}\s*(?:am|pm)|(?:last|this|next)\s+(?:year|month|week|summer|winter|spring|autumn|fall)|yesterday|tonight|(?:\d+\s+)?years?\s+ago|when\s+I\s+was\s+\d+|(?:early|late)\s+(?:morning|afternoon|evening|night))\b/i
  );
  const time = timeMatch ? timeMatch[1] : "—";

  // ── feeling: first emotion word found ───────────────────────────────────
  const lower = fullText.toLowerCase();
  const feelingWord = FEELING_WORDS.find((f) => lower.includes(f));
  const feeling = feelingWord ?? "—";

  return [
    { label: "cue",     value: cue },
    { label: "place",   value: place },
    { label: "time",    value: time },
    { label: "feeling", value: feeling },
    { label: "theme",   value: "—", key: true },
    { label: "quote",   value: quote },
  ];
}
