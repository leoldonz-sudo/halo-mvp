// HALO canonical data models — the durable, persisted product schema.
//
// These types follow the HALO Source of Truth §10. They are intentionally
// separate from lib/types.ts (which is the in-memory *demo seed* schema used by
// the marketing demo). This module powers the real, saved loop:
//   Memory → Moment Card → Memory Map → Share → Recipient Response → Thread
//
// Product philosophy (Source of Truth §"Past, Present, Future"): a Moment Card
// is anchored in the past, grounded in the present, and oriented toward
// becoming. The three layers below are first-class fields.

/** Input the user (and Xiaoman conversation) provides to the card generator. */
export type MemoryFragmentInput = {
  /** The one memory fragment the user started from. */
  memoryText: string;
  /** Answers the user gave to Xiaoman's 1–2 gentle follow-up questions. */
  followUpAnswers: string[];
  /** Optional label echoing which entry the user picked (demo continuity). */
  entryLabel?: string;
};

/**
 * A Moment Card — a structured memory asset generated from one life fragment.
 * Three layers: Past Anchor, Present Meaning, Future Orientation.
 */
export type MomentCard = {
  id: string;
  title: string;

  // ── Past: the anchor ──────────────────────────────────────────────
  /** The concrete memory fragment the card is anchored to. */
  pastAnchor: string;
  /** The user's own words, preserved verbatim. The emotional center. */
  originalQuote: string;
  /** One factual sentence describing what happened. No interpretation. */
  concreteMemory: string;

  // ── Present: meaning-making ground ────────────────────────────────
  /** What the user understands or feels about this now. */
  presentMeaning: string;
  /** Emotional tone, grounded in what was actually said. */
  emotionSignal: string;
  /** The value this moment reveals (growth, loyalty, self-trust…). */
  valueSignal: string;
  /** A quiet strength the user showed without naming it. */
  hiddenStrength: string;

  // ── Future: chosen direction (agency, never prediction) ───────────
  /** A gentle question or direction for becoming. Never forced goal-setting. */
  futureOrientation: string;
  /** A reflective question pointing the user inward. */
  reflectionQuestion: string;

  // ── Card surface ──────────────────────────────────────────────────
  /** One restrained observation. ≤ ~12 words. Never praise, never a lesson. */
  haloLine: string;
  /** 2–3 word theme used to cluster cards on the Memory Map. */
  theme: string;
  /** A gentle question to send when sharing the card. */
  shareQuestion?: string;
  createdAt: string;
};

/** A saved Moment Card placed onto the Memory Map. */
export type MemoryNode = {
  id: string;
  cardId: string;
  title: string;
  theme: string;
  /** Normalised position on the map canvas (0–1). Stable per node. */
  x: number;
  y: number;
  createdAt: string;
};

/** A future-facing connection between two nodes. Defined, not yet generated. */
export type MemoryEdge = {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationType: "theme" | "emotion" | "person" | "time" | "pattern";
};

export type ShareMode =
  | "card_only"
  | "with_question"
  | "ask_their_version"
  | "similar_experience";

/** A gentle invitation built from a saved Moment Card. */
export type ShareInvitation = {
  id: string;
  cardId: string;
  senderId?: string;
  recipientName?: string;
  shareMode: ShareMode;
  question?: string;
  createdAt: string;
};

/** The recipient's own memory, added in response to an invitation. */
export type SharedMemoryResponse = {
  id: string;
  invitationId: string;
  responseText: string;
  relatedCardId: string;
  responderName?: string;
  createdAt: string;
};

/** Links the original memory and the responses into one relationship thread. */
export type RelationshipMemoryThread = {
  id: string;
  invitationId: string;
  participantIds: string[];
  cardIds: string[];
  responseIds: string[];
  theme?: string;
  createdAt: string;
};
