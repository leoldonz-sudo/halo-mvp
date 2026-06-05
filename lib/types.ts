// HALO interactive demo — data schema (01-demo.md v4 §10).
// One shape serves all three entries so the engine never branches per-entry.

export type EntryType = "uncaptured" | "photo-object" | "guided";

export type ChatTurn = {
  role: "halo" | "user";
  text: string;
};

export type MemorySignal = {
  label: string;
  value: string;
  key?: boolean; // theme line — given the rust accent
};

export type Sensitivity = "low" | "medium" | "high";

export type MomentCard = {
  id: string;
  title: string;
  entryLabel: string;
  originalQuote: string; // largest text on the card
  originalFragment: string;
  haloLine: string; // second key line
  thenFelt: string;
  nowSee: string;
  evidence: string;
  primaryTheme: string;
  arcHint: string;
  metadata: {
    place?: string;
    time?: string;
    object?: string;
    person?: string;
    stage?: string;
    sensitivity: Sensitivity;
  };
};

export type MemoryMapSeed = {
  themeArea: string;
  arcHint: string;
  momentNode: {
    title: string;
    haloLine: string;
  };
  darkPrompts: string[];
};

export type ReceiverPreview = {
  intro: string;
  quote: string;
  question: string;
  cta: string;
};

export type MemorySeed = {
  id: string;
  entryType: EntryType;
  entryLabel: string;
  openerQuestion: string;
  userFragment: string;
  imageAsset?: string;
  imageObservation?: string;
  transcript: ChatTurn[]; // full chat, opener + fragment included
  signals: MemorySignal[];
  card: MomentCard;
  map: MemoryMapSeed;
  shareQuestions: string[];
  receiverPreview: ReceiverPreview;
};
