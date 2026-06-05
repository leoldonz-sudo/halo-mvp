// lib/demoData.ts — frozen demo content (01-demo.md v4 §11).
// The whole demo runs from these seeds with no AI / API dependency.

import type { MemorySeed } from "./types";

// ----------------------------------------------------------------------------
// Seed 1 — Uncaptured moment (main demo / 90s recording path)
// ----------------------------------------------------------------------------
const SEED_UNCAPTURED: MemorySeed = {
  id: "seed-airport",
  entryType: "uncaptured",
  entryLabel: "A moment I never captured",
  openerQuestion: "Was there a time you were waiting somewhere alone?",
  userFragment:
    "My flight landed in Singapore at 4am. I was too tired to think, so I slept on the airport seats for a few hours before figuring out where to go next.",
  transcript: [
    { role: "halo", text: "Was there a time you were waiting somewhere alone?" },
    {
      role: "user",
      text: "My flight landed in Singapore at 4am. I was too tired to think, so I slept on the airport seats for a few hours before figuring out where to go next.",
    },
    {
      role: "halo",
      text: "I heard the airport seats, 4am, and the feeling of having nowhere to go yet. What do you remember most clearly from where you were sitting?",
    },
    {
      role: "user",
      text: "I remember trying not to panic. I just kept telling myself to wait until the city woke up.",
    },
    {
      role: "halo",
      text: "I think we have enough to preserve this as a Moment Card. I'll keep your words, and you can edit anything before saving.",
    },
  ],
  signals: [
    { label: "cue", value: "uncaptured moment" },
    { label: "place", value: "Singapore Airport" },
    { label: "time", value: "4am" },
    { label: "body", value: "tired, waiting" },
    { label: "feeling", value: "lost, alone, trying not to panic" },
    { label: "stage", value: "first arrival abroad" },
    { label: "theme", value: "Starting Over", key: true },
    {
      label: "quote",
      value: "“I was too tired to think. I just slept on the airport seats.”",
    },
    { label: "next", value: "preserve" },
    { label: "sensitivity", value: "private, low" },
  ],
  card: {
    id: "card-airport",
    title: "The First Morning in Singapore",
    entryLabel: "A moment I never captured",
    originalQuote: "I was too tired to think.\nI just slept on the airport seats.",
    originalFragment:
      "My flight landed in Singapore at 4am, and I slept at the airport before figuring out where to go next.",
    haloLine: "You stayed with yourself until the city woke up.",
    thenFelt: "Exhausted, lost, trying not to panic.",
    nowSee: "Looking back, I can see why that morning stayed with me.",
    evidence: "A 4am arrival, airport seats, and waiting for the city to wake up.",
    primaryTheme: "Starting Over",
    arcHint: "Learning to begin again",
    metadata: {
      place: "Singapore Airport",
      time: "4am",
      stage: "first arrival abroad",
      sensitivity: "low",
    },
  },
  map: {
    themeArea: "Starting Over",
    arcHint: "A quiet arc may be forming: learning to begin again.",
    momentNode: {
      title: "The First Morning in Singapore",
      haloLine: "You stayed with yourself until the city woke up.",
    },
    darkPrompts: [
      "A place I keep returning to",
      "A chat I still remember",
      "One object I carried with me",
    ],
  },
  shareQuestions: [
    "What was your first time away from home like?",
    "Is there a small moment from your first days away that you still remember?",
    "Was there a time you had to find your way on your own?",
  ],
  receiverPreview: {
    intro: "Iris shared a memory with you.",
    quote: "I was too tired to think. I just slept on the airport seats.",
    question: "What was your first time away from home like?",
    cta: "Add your version",
  },
};

// ----------------------------------------------------------------------------
// Seed 2A — Photo / object (wooden box). The "Grandma's wooden box" preset.
// ----------------------------------------------------------------------------
const SEED_OBJECT: MemorySeed = {
  id: "seed-box",
  entryType: "photo-object",
  entryLabel: "A photo or object I kept",
  openerQuestion: "What do you usually say if someone asks what's inside?",
  userFragment: "",
  imageAsset: "/assets/object-box.png",
  imageObservation:
    "I see a small locked wooden box, kept carefully. It looks like something that may carry more than it shows.",
  transcript: [
    {
      role: "halo",
      text: "I see a small locked wooden box, kept carefully. It looks like something that may carry more than it shows. What do you usually say if someone asks what's inside?",
    },
    {
      role: "user",
      text: "I always said I didn't know. My grandmother kept it on her shelf and told us there was nothing inside.",
    },
    {
      role: "halo",
      text: "She told you there was nothing inside. When did you last take it out, or really look at it?",
    },
    {
      role: "user",
      text: "After she passed. I finally opened it and found old letters and a photo I had never seen.",
    },
    {
      role: "halo",
      text: "Old letters, and a photo you had never seen. I think we have enough to preserve this as a Moment Card. I'll keep your words, and you can edit anything before saving.",
    },
  ],
  signals: [
    { label: "cue", value: "kept object" },
    { label: "object", value: "wooden box" },
    { label: "person", value: "grandmother" },
    { label: "place", value: "her shelf" },
    { label: "feeling", value: "tender, curious" },
    { label: "theme", value: "Things I Carried", key: true },
    {
      label: "quote",
      value: "“She always said there was nothing inside.”",
    },
    { label: "next", value: "preserve" },
    { label: "sensitivity", value: "private, medium" },
  ],
  card: {
    id: "card-box",
    title: "Grandma's Locked Wooden Box",
    entryLabel: "A photo or object I kept",
    originalQuote: "She always said\nthere was nothing inside.",
    originalFragment:
      "A small locked box my grandmother kept on her shelf, that I only opened after she was gone.",
    haloLine:
      "The box kept more than objects. It kept the parts of her you were still trying to know.",
    thenFelt: "Curious, a little shut out, never quite sure.",
    nowSee: "Now I think the box was how she kept herself.",
    evidence: "The first time I saw my grandmother as a person, not just a role.",
    primaryTheme: "Things I Carried",
    arcHint: "Seeing the person behind the role",
    metadata: {
      object: "wooden box",
      person: "grandmother",
      sensitivity: "medium",
    },
  },
  map: {
    themeArea: "Things I Carried",
    arcHint: "A quiet arc may be forming: seeing the person behind the role.",
    momentNode: {
      title: "Grandma's Locked Wooden Box",
      haloLine: "It kept the parts of her you were still trying to know.",
    },
    darkPrompts: [
      "A photo I would never delete",
      "Something I kept but can't explain",
      "A person I'm still getting to know",
    ],
  },
  shareQuestions: [
    "What did your grandparents never say out loud?",
    "Is there an object of theirs you still keep?",
    "Who in your family are you still getting to know?",
  ],
  receiverPreview: {
    intro: "Iris shared a memory with you.",
    quote: "She always said there was nothing inside.",
    question: "Is there an object of theirs you still keep?",
    cta: "Add your version",
  },
};

// ----------------------------------------------------------------------------
// Seed 2B — Photo / object (brass key). The "An old key" preset.
// ----------------------------------------------------------------------------
const SEED_KEY: MemorySeed = {
  id: "seed-key",
  entryType: "photo-object",
  entryLabel: "A photo or object I kept",
  openerQuestion: "What did this key open?",
  userFragment: "",
  imageAsset: "/assets/object-key.png",
  imageObservation:
    "I see a small brass key, worn from being held. It looks like it once unlocked something you still remember.",
  transcript: [
    {
      role: "halo",
      text: "I see a small brass key, worn from being held. It looks like it once unlocked something you still remember. What did it open?",
    },
    {
      role: "user",
      text: "The back door of my grandparents' old house. We sold it three years ago, but I kept the key.",
    },
    {
      role: "halo",
      text: "You kept the key after the house was gone. What part of that house do you still remember most?",
    },
    {
      role: "user",
      text: "The kitchen, in winter. The radiator made a clicking sound I haven't heard since.",
    },
    {
      role: "halo",
      text: "The kitchen, the radiator, the winter. I think we have enough to preserve this as a Moment Card. I'll keep your words, and you can edit anything before saving.",
    },
  ],
  signals: [
    { label: "cue", value: "kept object" },
    { label: "object", value: "brass key" },
    { label: "place", value: "grandparents' house" },
    { label: "time", value: "winter, evenings" },
    { label: "feeling", value: "tender, holding on" },
    { label: "theme", value: "Places I Carried", key: true },
    {
      label: "quote",
      value: "“We sold it three years ago. I kept the key.”",
    },
    { label: "next", value: "preserve" },
    { label: "sensitivity", value: "private, low" },
  ],
  card: {
    id: "card-key",
    title: "The Key to the House",
    entryLabel: "A photo or object I kept",
    originalQuote: "We sold it three years ago.\nI kept the key.",
    originalFragment:
      "A brass key from my grandparents' back door, kept years after the house was sold.",
    haloLine: "Some things stay in your hand even when the door is gone.",
    thenFelt: "Like I had to keep something to make the place real.",
    nowSee: "Now I see I was holding on to a sound, not a building.",
    evidence: "A back door, a winter kitchen, a sound I haven't heard since.",
    primaryTheme: "Places I Carried",
    arcHint: "Holding a place after it's gone",
    metadata: {
      object: "brass key",
      place: "grandparents' house",
      sensitivity: "low",
    },
  },
  map: {
    themeArea: "Places I Carried",
    arcHint: "A quiet arc may be forming: holding a place after it's gone.",
    momentNode: {
      title: "The Key to the House",
      haloLine: "Some things stay in your hand even when the door is gone.",
    },
    darkPrompts: [
      "A house I still walk through in my head",
      "A sound I haven't heard in years",
      "Something I kept after a goodbye",
    ],
  },
  shareQuestions: [
    "Is there a house you still walk through in your memory?",
    "Did your grandparents leave you something small?",
    "What's a sound from somewhere you can't go back to?",
  ],
  receiverPreview: {
    intro: "Iris shared a memory with you.",
    quote: "We sold it three years ago. I kept the key.",
    question: "Is there a house you still walk through in your memory?",
    cta: "Add your version",
  },
};

// ----------------------------------------------------------------------------
// Seed 2C — Photo / object (paper ticket). The "A ticket" preset.
// ----------------------------------------------------------------------------
const SEED_TICKET: MemorySeed = {
  id: "seed-ticket",
  entryType: "photo-object",
  entryLabel: "A photo or object I kept",
  openerQuestion: "Where did this ticket take you?",
  userFragment: "",
  imageAsset: "/assets/object-ticket.png",
  imageObservation:
    "I see a paper ticket, kept long after the trip was over. The crease shows it stayed in a wallet, or a drawer.",
  transcript: [
    {
      role: "halo",
      text: "I see a paper ticket, kept long after the trip was over. The crease shows it stayed in a wallet, or a drawer. Where did this ticket take you?",
    },
    {
      role: "user",
      text: "It's from a Coldplay concert in 2019. I went with my best friend, the night before she moved to Berlin.",
    },
    {
      role: "halo",
      text: "You kept it from the night before she moved. What do you remember about being there together?",
    },
    {
      role: "user",
      text: "We didn't really talk about the move. We just sang every song, holding hands the whole time.",
    },
    {
      role: "halo",
      text: "Singing every song, holding hands. I think we have enough to preserve this as a Moment Card. I'll keep your words, and you can edit anything before saving.",
    },
  ],
  signals: [
    { label: "cue", value: "kept object" },
    { label: "object", value: "concert ticket" },
    { label: "person", value: "best friend" },
    { label: "time", value: "2019, the night before" },
    { label: "feeling", value: "tender, unspoken" },
    { label: "theme", value: "People Who Moved", key: true },
    {
      label: "quote",
      value: "“We didn't talk about it. We just sang every song.”",
    },
    { label: "next", value: "preserve" },
    { label: "sensitivity", value: "private, low" },
  ],
  card: {
    id: "card-ticket",
    title: "The Night Before She Moved",
    entryLabel: "A photo or object I kept",
    originalQuote: "We didn't talk about it.\nWe just sang every song.",
    originalFragment:
      "A Coldplay ticket from the night before my best friend moved to Berlin.",
    haloLine:
      "The ticket kept the version of you that didn't have to say goodbye yet.",
    thenFelt: "Pretending the night could last.",
    nowSee: "Now I see the ticket was the goodbye, even if neither of us said it.",
    evidence: "Two people, a stadium, every song.",
    primaryTheme: "People Who Moved",
    arcHint: "Goodbyes that wore another costume",
    metadata: {
      object: "concert ticket",
      person: "best friend",
      time: "2019",
      sensitivity: "low",
    },
  },
  map: {
    themeArea: "People Who Moved",
    arcHint: "A quiet arc may be forming: goodbyes that wore another costume.",
    momentNode: {
      title: "The Night Before She Moved",
      haloLine:
        "The ticket kept the version of you that didn't have to say goodbye yet.",
    },
    darkPrompts: [
      "A trip I kept the stub from",
      "A friend I miss on a Tuesday",
      "A song I can't hear neutrally",
    ],
  },
  shareQuestions: [
    "What's a ticket you kept long after it ended?",
    "Was there a night you knew was the last one before something changed?",
    "What song belongs to a person you don't see anymore?",
  ],
  receiverPreview: {
    intro: "Iris shared a memory with you.",
    quote: "We didn't talk about it. We just sang every song.",
    question: "Was there a night you knew was the last one before something changed?",
    cta: "Add your version",
  },
};

// ----------------------------------------------------------------------------
// Seed 2D — Photo / object (user upload). Generic, honest fallback — never
// pretends to know what the user uploaded. Real LLM path will replace this.
// ----------------------------------------------------------------------------
const SEED_UPLOAD: MemorySeed = {
  id: "seed-upload",
  entryType: "photo-object",
  entryLabel: "A photo or object I kept",
  openerQuestion: "Can you tell me what it is, and where it's been kept?",
  userFragment: "",
  imageAsset: undefined,
  imageObservation:
    "I can see this is something you chose to keep. I don't fully know what it is yet.",
  transcript: [
    {
      role: "halo",
      text: "I can see this is something you chose to keep. I don't fully know what it is yet. Can you tell me what it is, and where it's been kept?",
    },
    {
      role: "user",
      text: "It's something I've had for a long time. I've kept it close even when I moved.",
    },
    {
      role: "halo",
      text: "Even when you moved, you brought it with you. What does it remind you of?",
    },
    {
      role: "user",
      text: "Of someone I don't see anymore. I look at it when I want to feel them close.",
    },
    {
      role: "halo",
      text: "Something you keep to feel them close. I think we have enough to preserve this as a Moment Card. I'll keep your words, and you can edit anything before saving.",
    },
  ],
  signals: [
    { label: "cue", value: "kept object" },
    { label: "object", value: "something you brought everywhere" },
    { label: "person", value: "someone you don't see anymore" },
    { label: "feeling", value: "tender, holding close" },
    { label: "theme", value: "People I Carried", key: true },
    {
      label: "quote",
      value: "“I look at it when I want to feel them close.”",
    },
    { label: "next", value: "preserve" },
    { label: "sensitivity", value: "private, medium" },
  ],
  card: {
    id: "card-upload",
    title: "Something I Kept Close",
    entryLabel: "A photo or object I kept",
    originalQuote: "I look at it when I want\nto feel them close.",
    originalFragment:
      "An object I've kept for a long time, that connects me to someone I no longer see.",
    haloLine:
      "What stays in your hand often stays for someone you couldn't keep.",
    thenFelt: "Not ready to let go.",
    nowSee: "Now I see I was keeping a connection, not an object.",
    evidence: "An object kept through every move.",
    primaryTheme: "People I Carried",
    arcHint: "Carrying someone through what stays",
    metadata: {
      object: "a kept thing",
      sensitivity: "medium",
    },
  },
  map: {
    themeArea: "People I Carried",
    arcHint: "A quiet arc may be forming: carrying someone through what stays.",
    momentNode: {
      title: "Something I Kept Close",
      haloLine:
        "What stays in your hand often stays for someone you couldn't keep.",
    },
    darkPrompts: [
      "A photo I would never delete",
      "Something I take everywhere",
      "A person I never told",
    ],
  },
  shareQuestions: [
    "Is there something small you've taken with you everywhere?",
    "Who do you keep close through an object?",
    "What's in your drawer that no one else would understand?",
  ],
  receiverPreview: {
    intro: "Iris shared a memory with you.",
    quote: "I look at it when I want to feel them close.",
    question: "Who do you keep close through an object?",
    cta: "Add your version",
  },
};

// ----------------------------------------------------------------------------
// Seed 3 — Guided question (walk home alone)
// ----------------------------------------------------------------------------
const SEED_GUIDED: MemorySeed = {
  id: "seed-walk",
  entryType: "guided",
  entryLabel: "Let HALO guide me",
  openerQuestion: "Let's start there. What is the first scene that comes to mind?",
  userFragment: "",
  transcript: [
    {
      role: "halo",
      text: "Let's start there. What is the first scene that comes to mind?",
    },
    {
      role: "user",
      text: "Walking home alone at night after a hard day, not wanting to talk to anyone.",
    },
    {
      role: "halo",
      text: "Walking home alone, not wanting to talk to anyone. What did you notice around you as you walked?",
    },
    {
      role: "user",
      text: "It was quiet. I did not call anyone. I just kept walking until I felt okay.",
    },
    {
      role: "halo",
      text: "You just kept walking until you felt okay. I think we have enough to preserve this as a Moment Card. I'll keep your words, and you can edit anything before saving.",
    },
  ],
  signals: [
    { label: "cue", value: "guided start" },
    { label: "place", value: "the walk home" },
    { label: "time", value: "night" },
    { label: "body", value: "tired, walking" },
    { label: "feeling", value: "quiet, self-contained" },
    { label: "theme", value: "Belonging", key: true },
    {
      label: "quote",
      value: "“I just kept walking until I felt okay.”",
    },
    { label: "next", value: "preserve" },
    { label: "sensitivity", value: "private, low" },
  ],
  card: {
    id: "card-walk",
    title: "The Walk Home Alone",
    entryLabel: "Let HALO guide me",
    originalQuote: "I did not call anyone.\nI just kept walking until I felt okay.",
    originalFragment:
      "Walking home alone after a hard night, keeping myself company until it passed.",
    haloLine: "You learned that quiet did not always mean empty.",
    thenFelt: "Drained, closed off, not wanting to explain.",
    nowSee: "Now I see I was learning to keep myself company.",
    evidence: "One of the times I found steadiness on my own.",
    primaryTheme: "Belonging",
    arcHint: "Finding a place inside yourself",
    metadata: {
      place: "the walk home",
      time: "night",
      sensitivity: "low",
    },
  },
  map: {
    themeArea: "Belonging",
    arcHint: "A quiet arc may be forming: finding a place inside yourself.",
    momentNode: {
      title: "The Walk Home Alone",
      haloLine: "You learned that quiet did not always mean empty.",
    },
    darkPrompts: [
      "A place I keep thinking about",
      "A time I waited alone",
      "A chat I still remember",
    ],
  },
  shareQuestions: [
    "What do you do on a hard night?",
    "Is there a walk you still remember?",
    "When did you last keep yourself company?",
  ],
  receiverPreview: {
    intro: "Iris shared a memory with you.",
    quote: "I did not call anyone. I just kept walking until I felt okay.",
    question: "Is there a walk you still remember?",
    cta: "Add your version",
  },
};

export const SEEDS: Record<MemorySeed["entryType"], MemorySeed> = {
  uncaptured: SEED_UNCAPTURED,
  "photo-object": SEED_OBJECT,
  guided: SEED_GUIDED,
};

// Object-entry seeds keyed by preset id (v4 §15 — no preset shares a seed).
export type ObjectSeedKey = "box" | "key" | "ticket" | "upload";

export const OBJECT_SEEDS: Record<ObjectSeedKey, MemorySeed> = {
  box: SEED_OBJECT,
  key: SEED_KEY,
  ticket: SEED_TICKET,
  upload: SEED_UPLOAD,
};

// Home screen light map preview (v4 §2).
export const HOME_PREVIEW = {
  recentCard: "The First Morning in Singapore",
  nextPrompts: [
    "A place I keep returning to",
    "A chat I still remember",
    "One object I carried with me",
  ],
};

// Entry 1 — prompt chips (v4 §2A).
export const MOMENT_CHIPS = [
  "A first morning somewhere new",
  "A moment I got through quietly",
  "Something I usually call “nothing special”",
  "Use the Singapore airport memory",
];

// Entry 2 — object presets (v4 §2B). Each preset routes to its own seed.
export const OBJECT_PRESETS: ReadonlyArray<{
  id: ObjectSeedKey;
  label: string;
  asset: string;
}> = [
  { id: "box", label: "Grandma's wooden box", asset: "/assets/object-box.png" },
  { id: "key", label: "An old key", asset: "/assets/object-key.png" },
  { id: "ticket", label: "A ticket", asset: "/assets/object-ticket.png" },
];

// Entry 3 — 8 gentle questions (v4 §2C).
export const GUIDE_QUESTIONS = [
  "A time I waited alone",
  "A first morning somewhere new",
  "Something I kept but can't explain",
  "A photo I would never delete",
  "A chat I still remember",
  "A place I keep thinking about",
  "A moment I got through quietly",
  "A memory I usually skip over",
];

/** HALO's immediate opening line for each guided prompt.
 *  Observation first, question second. Max 2 sentences. */
export const GUIDE_OPENERS: Record<string, string> = {
  "A time I waited alone":
    "You remembered the waiting. What comes back first — the place, or what you were waiting for?",
  "A first morning somewhere new":
    "First mornings are strange. What did the light look like?",
  "Something I kept but can't explain":
    "Most things get thrown away. This one didn't. What is it?",
  "A photo I would never delete":
    "You don't need to show me the photo. What happens when you look at it?",
  "A chat I still remember":
    "Something in that exchange stayed. What did the other person say?",
  "A place I keep thinking about":
    "You don't have to explain why yet. Which place came to mind?",
  "A moment I got through quietly":
    "You got through it. Was anyone else there?",
  "A memory I usually skip over":
    "You usually skip it. What's in it?",
};
