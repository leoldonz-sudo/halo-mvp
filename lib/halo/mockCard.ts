// Deterministic Moment Card generator — the fallback that lets HALO work with
// NO API key. It is isomorphic (pure TS, no server/browser APIs) so the API
// route and the client can both call it.
//
// Design rules (Source of Truth §9.3–9.4, §17.3):
//   - Preserve the user's original words. Do not rewrite them.
//   - Stay grounded in what was actually said. Invent no dramatic meaning.
//   - Keep it short, restrained, emotionally accurate — never cheesy.
// When OPENAI_API_KEY exists the API route produces a richer card; this is the
// honest floor that keeps the whole loop demonstrable offline.

import type { MomentCard } from "./types";

const FEELING_WORDS = [
  "happy", "sad", "anxious", "scared", "excited", "nervous", "proud",
  "lonely", "hopeful", "lost", "confused", "angry", "grateful", "relieved",
  "overwhelmed", "peaceful", "afraid", "worried", "joyful", "tired",
  "frustrated", "calm", "heartbroken", "content", "empty", "numb",
  "surprised", "moved", "guilty", "ashamed", "helpless", "quiet", "still",
];

// Theme buckets: a keyword → a 2–3 word theme + the value it tends to reveal.
const THEME_RULES: ReadonlyArray<{
  rx: RegExp;
  theme: string;
  value: string;
}> = [
  { rx: /\b(wait|waited|waiting|alone|by myself|on my own)\b/i, theme: "Quiet Perseverance", value: "self-trust" },
  { rx: /\b(left|leaving|moved|move|goodbye|gone|miss|missing)\b/i, theme: "What Stayed After Goodbye", value: "loyalty" },
  { rx: /\b(kept|keep|box|letter|photo|drawer|ticket|key)\b/i, theme: "Things I Carried", value: "remembrance" },
  { rx: /\b(grandm|mother|father|mom|dad|family|friend|sister|brother)\b/i, theme: "People Who Shaped Me", value: "connection" },
  { rx: /\b(first|new|start|started|began|beginning|arrived)\b/i, theme: "Starting Over", value: "courage" },
  { rx: /\b(home|house|room|kitchen|city|town|street)\b/i, theme: "Places I Carried", value: "belonging" },
];

function clean(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function firstSentence(text: string): string {
  const t = clean(text);
  const m = t.match(/^.*?[.!?。！？](\s|$)/);
  return (m ? m[0] : t).trim();
}

function titleCase(words: string[]): string {
  return words
    .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "but", "or", "so", "to", "of", "in", "on", "at",
  "for", "with", "i", "my", "me", "we", "it", "was", "were", "is", "am",
  "had", "have", "that", "this", "just", "really", "very", "too", "then",
  "when", "while", "about", "into", "out", "up", "down", "as", "if",
]);

function deriveTitle(memoryText: string): string {
  const words = clean(memoryText)
    .replace(/["'""'']/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w.toLowerCase()));
  if (words.length === 0) return "A Moment I Kept";
  const picked = words.slice(0, 4);
  return titleCase(picked.map((w) => w.replace(/[^\p{L}\p{N}'-]/gu, "")));
}

function pickQuote(candidates: string[]): string {
  const cleaned = candidates.map(clean).filter(Boolean);
  if (cleaned.length === 0) return "—";
  const longest = cleaned.reduce((a, b) => (b.length > a.length ? b : a), "");
  const stripped = longest.replace(/^["'""'']+|["'""'']+$/g, "").trim();
  return stripped.length > 160 ? stripped.slice(0, 157).trimEnd() + "…" : stripped;
}

function detectFeeling(all: string): string {
  const lower = all.toLowerCase();
  const found = FEELING_WORDS.filter((f) => lower.includes(f));
  if (found.length === 0) return "quiet, hard to name yet";
  return Array.from(new Set(found)).slice(0, 3).join(", ");
}

function detectTheme(all: string): { theme: string; value: string } {
  for (const rule of THEME_RULES) {
    if (rule.rx.test(all)) return { theme: rule.theme, value: rule.value };
  }
  return { theme: "A Quiet Arc", value: "self-knowledge" };
}

export function makeId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}${rand}`;
}

/**
 * Build a complete, restrained Moment Card from the user's words alone.
 * Every field traces back to something the user actually said.
 */
export function buildMockCard(
  memoryText: string,
  followUpAnswers: string[] = [],
  opts: { id?: string; createdAt?: string; entryLabel?: string } = {},
): MomentCard {
  const memory = clean(memoryText);
  const answers = followUpAnswers.map(clean).filter(Boolean);
  const all = [memory, ...answers].join(" ");

  const { theme, value } = detectTheme(all);
  const feeling = detectFeeling(all);
  const quote = pickQuote([memory, ...answers]);
  const lastReflection = answers.length > 0 ? answers[answers.length - 1] : "";

  const concreteMemory = memory ? firstSentence(memory) : quote;

  const presentMeaning = lastReflection
    ? `Looking back, ${lastReflection.charAt(0).toLowerCase()}${lastReflection.slice(1)}`
    : "Now it reads as a small moment that stayed with you longer than it seemed to at the time.";

  return {
    id: opts.id ?? makeId("card"),
    title: deriveTitle(memory || quote),

    pastAnchor: concreteMemory || "—",
    originalQuote: quote,
    concreteMemory: concreteMemory || "—",

    presentMeaning: clean(presentMeaning),
    emotionSignal: feeling,
    valueSignal: value,
    hiddenStrength: "You stayed with it, even without anyone watching.",

    futureOrientation:
      "What would it look like to carry this forward, on your own terms?",
    reflectionQuestion: `Where else in your life have you moved through ${theme.toLowerCase()}?`,

    haloLine: "You kept this longer than you needed to.",
    theme,
    shareQuestion: "What was your version of this moment?",
    createdAt: opts.createdAt ?? new Date().toISOString(),
  };
}

/**
 * Coerce a possibly-partial parsed AI object into a complete MomentCard,
 * filling any missing/blank field from the deterministic mock. Guarantees the
 * API never returns a partial card.
 */
export function coerceCard(
  parsed: Record<string, unknown>,
  memoryText: string,
  followUpAnswers: string[],
  opts: { id: string; createdAt: string; entryLabel?: string },
): MomentCard {
  const fallback = buildMockCard(memoryText, followUpAnswers, opts);
  const str = (key: keyof MomentCard): string => {
    const v = parsed[key];
    return typeof v === "string" && v.trim().length > 0
      ? v.trim()
      : (fallback[key] as string);
  };
  return {
    id: opts.id,
    title: str("title"),
    pastAnchor: str("pastAnchor"),
    originalQuote: str("originalQuote"),
    concreteMemory: str("concreteMemory"),
    presentMeaning: str("presentMeaning"),
    emotionSignal: str("emotionSignal"),
    valueSignal: str("valueSignal"),
    hiddenStrength: str("hiddenStrength"),
    futureOrientation: str("futureOrientation"),
    reflectionQuestion: str("reflectionQuestion"),
    haloLine: str("haloLine"),
    theme: str("theme"),
    shareQuestion:
      typeof parsed.shareQuestion === "string" && parsed.shareQuestion.trim()
        ? parsed.shareQuestion.trim()
        : fallback.shareQuestion,
    createdAt: opts.createdAt,
  };
}
