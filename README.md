# HALO MVP

**HALO is an AI memory product that turns overlooked life moments into structured Moment Cards, a personal Memory Map, and gentle invitations for connection.**

The world sees where you arrived.
HALO helps you remember the quiet moments that shaped who you became — and share them with someone who matters.

- **Brand line:** Every unseen moment carries its own halo.
- **CTA:** Map the Moments That Made Me

This document reflects what is *actually implemented* in this repository. The product source of truth lives in the Obsidian vault (`01HALO/0610HALO最新真理.md`).

---

## What this MVP does

It runs one complete, working product loop:

```
Memory  →  Xiaoman  →  Moment Card  →  Memory Map  →  Share  →  Recipient Response  →  Thread
```

A user starts from one small memory, talks it through with Xiaoman, generates a structured **Moment Card**, saves it to a **Memory Map**, opens it, shares it as a gentle question, and a recipient adds *their* version — weaving a **relationship memory thread**.

### Product philosophy in the data

Every Moment Card is *anchored in the past, grounded in the present, oriented toward becoming*. The card schema makes those three layers first-class fields:

1. **Past Anchor** — the concrete memory (`pastAnchor`, `originalQuote`, `concreteMemory`)
2. **Present Meaning** — what it means now (`presentMeaning`, `emotionSignal`, `valueSignal`, `hiddenStrength`)
3. **Future Orientation** — a gentle direction for becoming (`futureOrientation`, `reflectionQuestion`)

---

## Current stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 14.2 (App Router, React Server + Client Components) |
| Language | TypeScript (strict) |
| UI | React 18, Tailwind CSS 3.4, CSS custom properties (warm paper design system) |
| AI | OpenAI Chat Completions (`gpt-4o-mini` by default), server-side only |
| Persistence | `localStorage` (browser) — no database in this MVP |
| Target | Mobile-first H5 (390×844 / 375×812) |
| Deploy | Vercel |

There is **no backend database and no auth**. Persistence is deliberately the simplest reliable option (`localStorage`) so the full loop is demonstrable and technically explainable without infra.

---

## Architecture

```
app/
  page.tsx                 # marketing landing (image-led 5 panels)
  demo/page.tsx            # /demo → re-exports the landing
  demo/start/page.tsx      # interactive flow: home → entry → conversation → result
  map/page.tsx             # Memory Map (saved cards as nodes)
  card/[id]/page.tsx       # Moment Card detail + Share action
  share/[shareId]/page.tsx # recipient view: card + question + response + thread
  api/
    generate-card/route.ts # memory → canonical Moment Card (OpenAI or mock)
    halo/chat/route.ts     # one Xiaoman conversation turn (OpenAI)
    halo/extract/route.ts  # transcript → demo card/signals (OpenAI)
components/
  flow/                    # conversation, result, demo MomentCard
  halo/MomentCardView.tsx  # canonical 3-layer card (Past / Present / Future)
  home/, entry/, site/     # landing + entry surfaces, Xiaoman avatar
lib/
  types.ts                 # in-memory demo "seed" schema (existing demo)
  demoData.ts              # frozen demo seeds + scripted fallback transcripts
  haloPrompt.ts            # Xiaoman chat + extract system prompts
  halo/                    # the real persisted loop:
    types.ts               #   canonical data models
    mockCard.ts            #   deterministic, isomorphic card builder
    cardPrompt.ts          #   generate-card system prompt
    store.ts               #   localStorage CRUD (cards/nodes/invitations/responses/threads)
```

**Data flow when a card is created** (`app/demo/start/page.tsx → persistCanonicalCard`):

```
transcript → POST /api/generate-card → MomentCard JSON → store.saveCard()
          → localStorage (card + auto-created MemoryNode)
          → /card/[id], /map, /share/[shareId] read it back
```

---

## API route: `/api/generate-card`

```
POST /api/generate-card
Content-Type: application/json

{
  "memoryText": "I waited alone at the hospital at 2am while my father was in surgery...",
  "followUpAnswers": ["I stared at the vending machine light and told myself to hold on."],
  "entryLabel": "A moment I never captured"      // optional
}
```

**Response:**

```json
{
  "card": {
    "id": "card_...",
    "title": "Waiting Alone at the Hospital",
    "pastAnchor": "...", "originalQuote": "...", "concreteMemory": "...",
    "presentMeaning": "...", "emotionSignal": "...", "valueSignal": "...", "hiddenStrength": "...",
    "futureOrientation": "...", "reflectionQuestion": "...",
    "haloLine": "You found a way to stay present in the silence.",
    "theme": "solitude, resilience",
    "shareQuestion": "What was your experience like during a similar wait?",
    "createdAt": "2026-06-10T04:18:15.400Z"
  },
  "source": "openai"          // "openai" | "mock" | "mock-fallback"
}
```

- If `OPENAI_API_KEY` is set, the route calls the model with a structured prompt (`lib/halo/cardPrompt.ts`) and coerces the result into a complete card.
- If the key is missing **or** the call fails, it falls back to a **deterministic mock** (`lib/halo/mockCard.ts`) built from the user's own words, so the demo always returns a real, saveable card.

The two existing routes `/api/halo/chat` and `/api/halo/extract` power the live Xiaoman conversation and require a key; the client falls back to a scripted seed transcript when they are unavailable.

---

## Data models (`lib/halo/types.ts`)

`MomentCard`, `MemoryNode`, `MemoryEdge`, `ShareInvitation`, `SharedMemoryResponse`, `RelationshipMemoryThread`.

```ts
type MomentCard = {
  id: string; title: string;
  pastAnchor: string; originalQuote: string; concreteMemory: string;       // Past
  presentMeaning: string; emotionSignal: string;                           // Present
  valueSignal: string; hiddenStrength: string;
  futureOrientation: string; reflectionQuestion: string;                   // Future
  haloLine: string; theme: string; shareQuestion?: string; createdAt: string;
};

type MemoryNode = { id; cardId; title; theme; x; y; createdAt };           // x/y: 0–1 map position
type ShareInvitation = { id; cardId; shareMode; question?; ...; createdAt };
type SharedMemoryResponse = { id; invitationId; responseText; relatedCardId; responderName?; createdAt };
type RelationshipMemoryThread = { id; invitationId; participantIds[]; cardIds[]; responseIds[]; theme?; createdAt };
```

`MemoryEdge` is defined for future graph work but not yet generated.

---

## Implemented features

| Feature | Status | Notes |
| --- | --- | --- |
| Mobile-first landing + demo entry | ✅ Implemented | `/`, `/demo`, `/demo/start` |
| Xiaoman guided conversation | ✅ Implemented | live OpenAI (`/api/halo/chat`); scripted seed fallback without a key |
| Moment Card generation | ✅ Implemented | real route `/api/generate-card`, OpenAI **or** deterministic mock |
| Save Moment Card | ✅ Implemented | `localStorage` via `lib/halo/store.ts` |
| Memory Map | ✅ Implemented | `/map` — saved cards as nodes; node → detail |
| Card detail (Past/Present/Future) | ✅ Implemented | `/card/[id]` |
| Share / gentle question | ✅ Implemented | `/share/[shareId]` from a `ShareInvitation` |
| Recipient response | ✅ Implemented | response form on the share page |
| Relationship memory thread | ✅ Implemented | original memory + responses shown together |
| MemoryEdge / graph clustering | ⏳ Planned | type defined; no edges generated |
| Accounts / real cross-user sharing | ⏳ Planned | requires a backend |

---

## Current limitations

- **`localStorage` only.** Saved cards, invitations, responses, and threads live in **one browser on one device**. In the demo, the "recipient" of a share is the same browser; in production this route would be opened by another person against a shared backend.
- **No accounts, no auth, no server persistence.**
- **The Memory Map is positional, not a real graph** — nodes are placed deterministically; there is no edge/clustering logic yet.
- **Without `OPENAI_API_KEY`,** Xiaoman uses scripted seed transcripts and cards come from the deterministic mock (still a complete, real loop — just not model-generated).
- This is an early-stage MVP focused on a clear, working core loop, not production infrastructure.

---

## Run locally

```bash
npm install

# Optional — enables live OpenAI Moment Cards + Xiaoman:
cp .env.example .env.local
# then add your key to .env.local

npm run dev          # http://localhost:3000
```

Production build (used to verify this MVP):

```bash
npm run build
npm start            # serves the optimized build on :3000
```

### Local mobile testing

```bash
ipconfig getifaddr en0          # then open http://<local-ip>:3000 on your phone
```

---

## Environment variables

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `OPENAI_API_KEY` | No | — | Enables live Moment Card generation + Xiaoman. Without it, deterministic mock + scripted fallback are used. Server-side only. |
| `OPENAI_MODEL` | No | `gpt-4o-mini` | Model used by the API routes. |
| `OPENAI_BASE_URL` | No | OpenAI default | Override for OpenAI-compatible gateways. |

The key never reaches the browser — it is read only inside `app/api/**` route handlers.

---

## Demo path (≈90 seconds)

1. Open `/demo/start`.
2. Pick an entry (e.g. *A moment I never captured*).
3. Tell Xiaoman one memory; answer the gentle follow-up.
4. Tap **Create draft card** → a Moment Card is generated and saved.
5. Tap **Keep this memory** → **Open this card** (`/card/[id]`).
6. See the Past / Present / Future structure; tap **Share this moment**.
7. On the share page (`/share/[shareId]`), add a recipient response.
8. The **relationship memory thread** shows the original memory and the new response together.
9. Open **/map** at any time to see every kept moment as a node.

---

## Project status

Early-stage MVP for product validation and demo. It proves the core thesis end-to-end:

> one unseen moment → one Moment Card → one Memory Node → one Memory Map → one gentle invitation → one shared thread
