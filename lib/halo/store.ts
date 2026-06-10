// HALO client-side persistence — the simplest reliable storage for the MVP.
//
// Everything lives in localStorage under versioned keys. This is intentionally
// not a backend: the MVP goal is to prove the loop works end-to-end and is
// technically explainable. A production version would swap these functions for
// a real database + accounts (see README "Current Limitations").
//
// All functions are no-ops / empty on the server (guarded by isBrowser) so they
// are safe to import anywhere; call them from effects / handlers, not render.

import type {
  MemoryNode,
  MomentCard,
  RelationshipMemoryThread,
  ShareInvitation,
  SharedMemoryResponse,
} from "./types";
import { makeId } from "./mockCard";

const KEYS = {
  cards: "halo.cards.v1",
  nodes: "halo.nodes.v1",
  invitations: "halo.invitations.v1",
  responses: "halo.responses.v1",
  threads: "halo.threads.v1",
} as const;

function isBrowser(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

function read<T>(key: string): T[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full / disabled — fail soft, the demo continues in memory */
  }
}

// Deterministic position so a node sits in the same place on every render.
function positionFor(id: string): { x: number; y: number } {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) & 0xffffffff;
  }
  const a = Math.abs(hash);
  // Keep nodes inside a padded 0.12–0.88 box so labels never clip the edges.
  const x = 0.12 + ((a % 1000) / 1000) * 0.76;
  const y = 0.12 + (((a >> 10) % 1000) / 1000) * 0.76;
  return { x, y };
}

// ── Moment Cards ────────────────────────────────────────────────────────────

export function listCards(): MomentCard[] {
  // Newest first.
  return read<MomentCard>(KEYS.cards).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export function getCard(id: string): MomentCard | null {
  return read<MomentCard>(KEYS.cards).find((c) => c.id === id) ?? null;
}

/**
 * Persist a card and create its Memory Map node in one step. Idempotent on id.
 * Returns the stored card (with its node guaranteed to exist).
 */
export function saveCard(card: MomentCard): MomentCard {
  const cards = read<MomentCard>(KEYS.cards).filter((c) => c.id !== card.id);
  write(KEYS.cards, [...cards, card]);

  const nodes = read<MemoryNode>(KEYS.nodes);
  if (!nodes.some((n) => n.cardId === card.id)) {
    const pos = positionFor(card.id);
    const node: MemoryNode = {
      id: makeId("node"),
      cardId: card.id,
      title: card.title,
      theme: card.theme,
      x: pos.x,
      y: pos.y,
      createdAt: card.createdAt,
    };
    write(KEYS.nodes, [...nodes, node]);
  }
  return card;
}

// ── Memory Map nodes ────────────────────────────────────────────────────────

export function listNodes(): MemoryNode[] {
  return read<MemoryNode>(KEYS.nodes).sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt),
  );
}

// ── Share invitations ───────────────────────────────────────────────────────

export function createInvitation(
  input: Omit<ShareInvitation, "id" | "createdAt">,
): ShareInvitation {
  const invitation: ShareInvitation = {
    ...input,
    id: makeId("inv"),
    createdAt: new Date().toISOString(),
  };
  const all = read<ShareInvitation>(KEYS.invitations);
  write(KEYS.invitations, [...all, invitation]);
  return invitation;
}

export function getInvitation(id: string): ShareInvitation | null {
  return read<ShareInvitation>(KEYS.invitations).find((i) => i.id === id) ?? null;
}

// ── Recipient responses + relationship threads ──────────────────────────────

export function listResponses(invitationId: string): SharedMemoryResponse[] {
  return read<SharedMemoryResponse>(KEYS.responses)
    .filter((r) => r.invitationId === invitationId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function getThread(invitationId: string): RelationshipMemoryThread | null {
  return (
    read<RelationshipMemoryThread>(KEYS.threads).find(
      (t) => t.invitationId === invitationId,
    ) ?? null
  );
}

/**
 * Add a recipient's response and weave it into the relationship memory thread.
 * Creates the thread on the first response, then appends to it after that.
 * Returns the response plus the (now updated) thread.
 */
export function addResponse(
  invitation: ShareInvitation,
  card: MomentCard,
  responseText: string,
  responderName?: string,
): { response: SharedMemoryResponse; thread: RelationshipMemoryThread } {
  const response: SharedMemoryResponse = {
    id: makeId("res"),
    invitationId: invitation.id,
    responseText: responseText.trim(),
    relatedCardId: card.id,
    responderName: responderName?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };
  write(KEYS.responses, [...read<SharedMemoryResponse>(KEYS.responses), response]);

  const threads = read<RelationshipMemoryThread>(KEYS.threads);
  const existing = threads.find((t) => t.invitationId === invitation.id);
  let thread: RelationshipMemoryThread;
  if (existing) {
    thread = { ...existing, responseIds: [...existing.responseIds, response.id] };
    write(
      KEYS.threads,
      threads.map((t) => (t.id === existing.id ? thread : t)),
    );
  } else {
    thread = {
      id: makeId("thread"),
      invitationId: invitation.id,
      participantIds: ["self", responderName?.trim() || "recipient"],
      cardIds: [card.id],
      responseIds: [response.id],
      theme: card.theme,
      createdAt: new Date().toISOString(),
    };
    write(KEYS.threads, [...threads, thread]);
  }
  return { response, thread };
}
