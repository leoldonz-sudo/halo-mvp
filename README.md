# HALO MVP

**HALO is an AI memory product that turns overlooked life moments into structured Moment Cards, personal Memory Maps, and gentle invitations for deeper connection.**

The world sees where you arrived.
HALO helps you remember the quiet moments that shaped who you became — and share them with someone who matters.

---

## One-line Summary

HALO helps users start from one small memory, talk it through with Xiaoman, generate a structured Moment Card, save it into a growing Memory Map, and share it as a gentle invitation for connection.

---

## Why HALO

Many people are seen through achievements, roles, and visible outcomes.

But the moments that shape someone are often quieter:

* a small decision no one noticed
* an object they kept
* a photo that still matters
* a private struggle behind a visible milestone
* a memory they never had language for
* a relationship moment that was never fully spoken about

HALO is designed for these unseen life moments.

Instead of asking users to write a full life story, HALO starts with one small fragment and helps turn it into a structured memory asset.

That memory asset can then become:

1. a Moment Card
2. a Memory Node
3. part of a Memory Map
4. a gentle invitation for someone else to respond

---

## Core User Flow

```text
Home
  ↓
Choose a memory entry
  ↓
Talk with Xiaoman
  ↓
Generate Moment Card
  ↓
Save to Memory Map
  ↓
Open Memory Map
  ↓
View card detail
  ↓
Share card or attach a gentle question
  ↓
Invite another person to respond with their own memory
```

---

## Core Product Loops

HALO MVP is built around three connected loops.

---

### Loop 1: Create a Moment Card

1. User starts from a memory, photo, object, or prompt.
2. Xiaoman asks restrained follow-up questions.
3. HALO extracts key memory signals.
4. HALO generates a structured Moment Card.
5. User saves the card into the Memory Map.

```text
Memory Fragment
  ↓
Xiaoman Conversation
  ↓
Memory Signal Extraction
  ↓
Moment Card
```

---

### Loop 2: Build a Memory Map

1. User opens the Memory Map.
2. Saved Moment Cards appear as Moment Nodes.
3. User opens a card detail page.
4. Over time, repeated cards can form themes, patterns, arcs, and relationship threads.

```text
Saved Moment Card
  ↓
Moment Node
  ↓
Memory Map
  ↓
Patterns / Themes / Arcs
```

---

### Loop 3: Connect Through a Moment Card

1. User selects a saved Moment Card.
2. User chooses to share the card directly or attach a gentle question.
3. The recipient can view the card and respond with their own version of the memory.
4. The shared response can become a relationship-linked memory thread.

```text
Moment Card
  ↓
Share / Ask a Gentle Question
  ↓
Recipient Response
  ↓
Relationship Memory Thread
```

This loop turns HALO from a private memory tool into a lightweight connection product.

HALO does not only help users remember themselves.
It helps one memory become an opening for another person to respond.

---

## Key Product Concepts

### Moment Card

A **Moment Card** is a structured memory asset generated from one life fragment.

Each Moment Card may include:

* original user words
* concrete memory details
* emotional signal
* value signal
* hidden strength
* restrained Halo Line
* related theme
* reflection question
* shareable question

The goal is not to over-beautify the memory.
The goal is to preserve what felt real.

---

### Memory Map

A **Memory Map** connects saved Moment Cards into a personal map of becoming.

Each saved card becomes a **Moment Node**.

Over time, repeated cards can reveal:

* quiet themes
* emotional patterns
* memory arcs
* relationship threads
* recurring values
* repeated ways the user has moved through life

The Memory Map helps users see not only what happened, but how they became who they are.

---

### Xiaoman

**Xiaoman** is HALO’s memory companion.

Xiaoman is not designed as a generic chatbot.
Its role is to guide the user through a restrained memory elicitation flow.

Xiaoman should:

* start from small fragments
* avoid overwhelming life-story prompts
* ask one gentle question at a time
* preserve the user’s original words
* avoid forcing trauma disclosure
* guide memory into structure
* keep the experience emotionally safe
* help transform a memory into a card, map node, or shareable invitation

---

### Connect / Share

HALO’s sharing experience is designed around gentle invitation, not social broadcasting.

A user can share:

* a Moment Card only
* a Moment Card with a gentle question
* a question asking the other person for their version of the memory
* a question asking whether the other person has experienced something similar

Example share questions:

* What do you remember about that time?
* Did you ever experience something like this too?
* What was your version of this moment?
* What did you understand about me back then that I did not see?
* Is there a moment like this that shaped you too?

This makes memory social without turning it into social media.

---

## What HALO Is Not

HALO is not:

* a generic chatbot
* a therapy product
* a simple journaling app
* a memoir writing tool
* a social media template
* a photo storage app
* a productivity dashboard

HALO is a **memory elicitation, structuring, and connection product** built around:

* restraint
* original words
* emotional safety
* memory structure
* personal meaning
* relationship invitation
* human connection

---

## Technical Architecture

HALO MVP is a mobile-first web prototype built to demonstrate the core product journey from memory input to Moment Card, Memory Map, and shareable connection.

### Current Stack

> Please update this section if the actual codebase uses a different stack.

* **Frontend:** React / Next.js
* **Styling:** CSS / Tailwind CSS
* **Deployment:** Vercel
* **State Management:** React state
* **Storage:** local state / localStorage / mock data
* **AI Layer:** structured memory prompt logic, currently partially simulated in the MVP
* **Target Platform:** mobile-first H5 experience

---

## System Flow

```text
User memory input
  ↓
Xiaoman guided conversation
  ↓
Memory signal extraction
  ↓
Moment Card JSON generation
  ↓
Moment Card UI rendering
  ↓
Save as Memory Map node
  ↓
Memory Map visualization
  ↓
Share card / attach question
  ↓
Recipient memory response
  ↓
Relationship memory thread
```

---

## AI Memory Structuring Logic

HALO’s AI logic is designed around a structured memory-processing pipeline rather than open-ended chat.

### Pipeline

```text
Memory Cue
  ↓
Gentle Follow-up
  ↓
Signal Extraction
  ↓
Moment Card Generation
  ↓
Memory Map Connection
  ↓
Connection Prompt Generation
```

---

### 1. Memory Cue

The user starts with one small fragment:

* a sentence
* an old photo
* an object
* a moment no one saw
* a prompt from Xiaoman

---

### 2. Gentle Follow-up

Xiaoman asks restrained follow-up questions to help the user stay close to the original memory.

Example question types:

* What do you remember most clearly about that moment?
* What did that moment mean to you back then?
* Was there something you understood only later?
* What part of that moment still feels important?
* Who else was connected to this memory?

---

### 3. Signal Extraction

HALO identifies structured memory signals from the conversation.

Possible signals include:

* emotional tone
* concrete memory details
* repeated themes
* value signal
* hidden strength
* relationship context
* future-facing reflection
* possible connection question

---

### 4. Moment Card Generation

The extracted signals are converted into a Moment Card.

The Moment Card keeps the memory grounded in the user’s original words while adding structure, meaning, and a restrained reflective line.

---

### 5. Memory Map Connection

The saved card becomes a Moment Node in the Memory Map.

Future versions may connect cards through:

* themes
* emotions
* people
* time
* recurring patterns
* relationship arcs

---

### 6. Connection Prompt Generation

HALO can turn a saved Moment Card into a gentle question for someone else.

This allows a private memory to become a lightweight invitation for shared reflection.

Example output:

```json
{
  "shareMode": "ask_their_version",
  "question": "What was your version of this moment?"
}
```

---

## Moment Card Schema

The intended Moment Card structure is:

```ts
type MomentCard = {
  id: string;
  title: string;
  originalQuote: string;
  concreteMemory: string;
  emotionSignal: string;
  valueSignal: string;
  hiddenStrength: string;
  haloLine: string;
  theme: string;
  reflectionQuestion: string;
  shareQuestion?: string;
  createdAt: string;
};
```

Example output:

```json
{
  "id": "card_001",
  "title": "The Night I Kept Going",
  "originalQuote": "No one saw how hard I was trying.",
  "concreteMemory": "A quiet late-night study moment before an important turning point.",
  "emotionSignal": "loneliness, persistence, quiet pressure",
  "valueSignal": "growth, responsibility, self-trust",
  "hiddenStrength": "The user kept moving even without external recognition.",
  "haloLine": "Some steps were invisible, but they still carried you forward.",
  "theme": "quiet perseverance",
  "reflectionQuestion": "Where else in your life have you kept going before anyone noticed?",
  "shareQuestion": "Was there a time when you saw me trying before I could see it myself?",
  "createdAt": "2026-06-10T00:00:00.000Z"
}
```

---

## Memory Map Data Model

Each saved Moment Card can become a node in the Memory Map.

```ts
type MemoryNode = {
  id: string;
  cardId: string;
  title: string;
  theme: string;
  x: number;
  y: number;
  createdAt: string;
};
```

Future versions may add edges between nodes:

```ts
type MemoryEdge = {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationType: "theme" | "emotion" | "person" | "time" | "pattern";
};
```

---

## Connect / Share Data Model

A saved Moment Card can become a shareable relationship invitation.

```ts
type ShareInvitation = {
  id: string;
  cardId: string;
  senderId?: string;
  recipientName?: string;
  shareMode:
    | "card_only"
    | "with_question"
    | "ask_their_version"
    | "similar_experience";
  question?: string;
  createdAt: string;
};
```

The recipient can respond with their own memory.

```ts
type SharedMemoryResponse = {
  id: string;
  invitationId: string;
  responseText: string;
  relatedCardId: string;
  createdAt: string;
};
```

Future versions may connect these responses into relationship memory threads.

```ts
type RelationshipMemoryThread = {
  id: string;
  invitationId: string;
  participantIds: string[];
  cardIds: string[];
  responseIds: string[];
  theme?: string;
  createdAt: string;
};
```

---

## Current Implementation Status

| Feature                    | Status                          | Notes                                                                 |
| -------------------------- | ------------------------------- | --------------------------------------------------------------------- |
| Mobile-first homepage      | Implemented                     | Designed for H5/mobile viewing                                        |
| Demo entry flow            | Implemented                     | Users can enter the core demo path                                    |
| Xiaoman conversation       | Partially implemented           | Current MVP may use scripted or constrained prompts                   |
| Moment Card UI             | Implemented                     | Shows the intended memory card output                                 |
| Moment Card generation     | Partially implemented           | Structured output exists; AI generation layer is still being improved |
| Memory Map preview         | Implemented                     | Visual prototype of saved memory nodes                                |
| Card detail page           | Implemented                     | Users can view saved card details                                     |
| Save card flow             | Partially implemented           | Current version may rely on local state, mock data, or localStorage   |
| Share Moment Card          | Partially implemented / Planned | Allows a card to become a lightweight connection asset                |
| Gentle question sharing    | Planned                         | User can attach a question when sharing a card                        |
| Recipient memory response  | Planned                         | Recipient can add their own version of the memory                     |
| Relationship memory thread | Planned                         | Links two people’s memories around one shared moment                  |
| Long-term memory graph     | Planned                         | Future backend and graph logic required                               |
| Privacy-first storage      | Planned                         | Requires production-level backend and security design                 |

---

## Current MVP Scope

This MVP focuses on demonstrating:

* the core product concept
* the emotional user experience
* the memory-to-card interaction loop
* the Memory Map direction
* the Connect / Share direction
* the visual and narrative identity of HALO

This version is **not yet a full production product**.

The main goal is to prove that one small memory fragment can become:

1. a Moment Card
2. a Memory Node
3. part of a Memory Map
4. a shareable connection invitation
5. the beginning of a relationship memory thread

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd halo-mvp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run locally

```bash
npm run dev
```

### 4. Open in browser

```text
http://localhost:3000
```

---

## Environment Variables

If the project uses an external AI API, create a `.env.local` file:

```bash
OPENAI_API_KEY=your_api_key_here
```

If the current demo version uses scripted prompts or mock data, no external AI API is required.

---

## Repository Structure

> Please update this section based on the actual repository structure.

```text
halo-mvp/
  app/
    page.tsx
    demo/
    map/
    card/
    share/
  components/
    XiaomanChat.tsx
    MomentCard.tsx
    MemoryMap.tsx
    MemoryNode.tsx
    ShareCard.tsx
    ShareQuestion.tsx
  lib/
    memorySchema.ts
    shareSchema.ts
    promptTemplates.ts
    mockData.ts
  public/
    images/
  README.md
  package.json
```

---

## Suggested Demo Script

1. Open the HALO homepage.
2. Click the main CTA.
3. Start from one small memory.
4. Talk with Xiaoman.
5. Generate a Moment Card.
6. Save the card into the Memory Map.
7. Open the Memory Map.
8. Show how the card becomes a node.
9. Open the card detail page.
10. Explain how the card can be shared directly or sent with a gentle question.
11. Show how future versions can let another person respond with their own memory.

---

## Design Principles

HALO should feel:

* warm
* restrained
* human
* quiet
* emotionally safe
* premium but not cold
* intimate but not invasive

HALO should not feel like:

* a SaaS dashboard
* a productivity app
* a therapy form
* a generic chatbot
* a social media template
* a sentimental poster
* a public posting platform

---

## Product Positioning

### One-line Summary

HALO turns unseen life moments into Moment Cards, Memory Maps, and gentle invitations for connection.

### Brand Line

Every unseen moment carries its own halo.

### Hero Line

The world sees where you arrived.
HALO remembers every step that brought you here.

### CTA

Map the Moments That Made Me

---

## Current Limitations

This MVP is intentionally scoped as an early-stage product prototype.

Current limitations include:

* Some AI behaviors may be scripted, simulated, or constrained.
* The current Memory Map is a visual prototype rather than a full graph system.
* Moment Card generation still needs a stronger backend pipeline.
* Connect / Share is represented as product logic and may not be fully implemented in the current demo.
* Recipient-side memory response is planned but not yet production-ready.
* Long-term personal memory storage requires stronger privacy and security design.
* Relationship memory threads require account, permission, and data-linking infrastructure.
* The current version prioritizes product clarity and demo experience over production-level infrastructure.

These limitations define the next development priorities.

---

## Future Roadmap

Next versions may include:

* real AI-powered Moment Card generation
* stronger structured prompt engine
* memory signal extraction from text and images
* persistent user accounts
* privacy-first personal memory storage
* shareable Moment Cards
* gentle question invitations
* recipient-side memory responses
* shared Memory Maps between two people
* family memory threads
* relationship-based memory arcs
* memory pattern detection
* exportable keepsake cards or memory books

---

## Why This Matters

HALO explores a different use case for AI.

Instead of optimizing productivity, speed, or output, HALO uses AI to help people preserve and understand lived experience.

The long-term vision is to build a memory system that helps people see where they have been, understand the quiet moments that shaped them, and open deeper conversations with the people who matter.

---

## Project Status

HALO is an early-stage MVP built for product validation, demo presentation, and future technical development.

The current version demonstrates the first step:

> one unseen moment → one Moment Card → one Memory Node → one Memory Map → one gentle connection invitation

HALO begins with one small memory, then helps people remember the quiet steps behind who they became — and share them with someone who may hold another piece of the story.
