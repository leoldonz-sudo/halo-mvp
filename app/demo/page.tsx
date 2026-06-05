"use client";

import { useEffect, useState } from "react";
import type { ChatTurn, EntryType, MemorySeed } from "@/lib/types";
import { SEEDS, OBJECT_SEEDS, type ObjectSeedKey } from "@/lib/demoData";
import { HomeHero } from "@/components/home/HomeHero";
import { MomentEntry, PhotoObjectEntry, GuideEntry } from "@/components/entry/Entries";
import { HALOConversation } from "@/components/flow/HALOConversation";
import { MemorySignalsPanel } from "@/components/flow/MemorySignalsPanel";
import { ResultPage } from "@/components/flow/ResultPage";

type Step = "home" | "entry" | "conversation" | "result";

export default function Page() {
  const [step, setStep] = useState<Step>("home");
  const [entryType, setEntryType] = useState<EntryType>("uncaptured");
  const [turns, setTurns] = useState(0);
  const [talkDone, setTalkDone] = useState(false);
  const [presetTalk, setPresetTalk] = useState(false);
  // Object-entry preset / guide-entry question can each replace the default
  // seed so the picked option drives the actual conversation (v4 §15).
  const [customSeed, setCustomSeed] = useState<MemorySeed | null>(null);
  // Live LLM: captured transcript + extracted (signals/card/map/...) seed.
  const [liveMessages, setLiveMessages] = useState<ChatTurn[]>([]);
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [resultSeed, setResultSeed] = useState<MemorySeed | null>(null);

  const seed = customSeed ?? SEEDS[entryType];

  // Portal screenshot presets (?shot=home|talk|card-map) — capture-only.
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("shot");
    if (s === "talk") {
      setEntryType("uncaptured");
      setPresetTalk(true);
      setTurns(SEEDS.uncaptured.transcript.length);
      setTalkDone(true);
      setStep("conversation");
    } else if (s === "card-map") {
      setEntryType("uncaptured");
      setStep("result");
    } else if (s === "home") {
      setStep("home");
    }
  }, []);

  function pick(type: EntryType) {
    setEntryType(type);
    setCustomSeed(null);
    setStep("entry");
  }

  function pickObjectSeed(key: ObjectSeedKey) {
    setCustomSeed(OBJECT_SEEDS[key]);
  }

  function pickGuideQuestion(question: string) {
    const base = SEEDS.guided;
    setCustomSeed({
      ...base,
      openerQuestion: question,
      transcript: [
        { role: "halo", text: question },
        ...base.transcript.slice(1),
      ],
    });
    startTalk();
  }

  function startTalk() {
    setTurns(0);
    setTalkDone(false);
    setPresetTalk(false);
    setStep("conversation");
  }

  function reset() {
    setTurns(0);
    setTalkDone(false);
    setCustomSeed(null);
    setLiveMessages([]);
    setResultSeed(null);
    setExtractError(null);
    setStep("home");
  }

  // Called when the user clicks "Create my Moment Card". Sends the live
  // transcript to /api/halo/extract; on success, the returned JSON replaces
  // the result-page seed. On failure, we silently fall back to the frozen
  // seed so the demo continues.
  async function goToResult() {
    // Preset / shot=card-map paths skip extract.
    if (presetTalk || liveMessages.length < 2) {
      setResultSeed(null);
      setStep("result");
      return;
    }
    setExtracting(true);
    setExtractError(null);
    try {
      const r = await fetch("/api/halo/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: liveMessages,
          seed: { entryLabel: seed.entryLabel },
        }),
      });
      if (!r.ok) throw new Error(`extract ${r.status}`);
      const data = (await r.json()) as Partial<MemorySeed> & {
        error?: string;
      };
      if (data.error) throw new Error(data.error);
      // Merge extracted pieces onto the base seed so screens stay typed.
      const merged: MemorySeed = {
        ...seed,
        transcript: liveMessages,
        signals: data.signals ?? seed.signals,
        card: data.card ?? seed.card,
        map: data.map ?? seed.map,
        shareQuestions: data.shareQuestions ?? seed.shareQuestions,
        receiverPreview: data.receiverPreview ?? seed.receiverPreview,
      };
      setResultSeed(merged);
    } catch (e) {
      setExtractError(e instanceof Error ? e.message : "extract failed");
      setResultSeed(null);
    } finally {
      setExtracting(false);
      setStep("result");
    }
  }

  if (step === "home") return <HomeHero onPick={pick} />;

  if (step === "entry") {
    if (entryType === "uncaptured")
      return (
        <MomentEntry seed={seed} onBack={() => setStep("home")} onSubmit={startTalk} />
      );
    if (entryType === "photo-object")
      return (
        <PhotoObjectEntry
          seed={seed}
          onBack={() => setStep("home")}
          onSubmit={startTalk}
          onPickSeed={pickObjectSeed}
        />
      );
    return (
      <GuideEntry
        onBack={() => setStep("home")}
        onSelect={pickGuideQuestion}
      />
    );
  }

  if (step === "conversation") {
    const total = seed.transcript.length;
    const sigTotal = seed.signals.length;
    const signalCount =
      turns === 0
        ? 1
        : Math.min(sigTotal, 1 + Math.round((turns / total) * (sigTotal - 1)));

    return (
      <main className="relative z-10 flex min-h-[100dvh] flex-col px-6 pt-[max(2.25rem,env(safe-area-inset-top))] pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={() => setStep("entry")}
          aria-label="Back"
          className="-ml-1 mb-5 inline-flex h-9 w-9 items-center justify-center text-[22px] text-ink2"
        >
          ←
        </button>

        <HALOConversation
          seed={seed}
          preset={presetTalk}
          onTurnsShown={setTurns}
          onComplete={() => setTalkDone(true)}
          onMessages={setLiveMessages}
          onGenerateCard={goToResult}
        />

        <div className="mt-7">
          <MemorySignalsPanel signals={seed.signals} count={signalCount} />
        </div>

        <div className="mt-auto pt-7">
          <button
            type="button"
            onClick={goToResult}
            disabled={(liveMessages.filter((m) => m.role === "user").length < 2 && !talkDone) || extracting}
            className="halo-cta halo-cta-primary w-full"
          >
            {extracting ? "Preserving your words..." : "Create my Moment Card"}
          </button>
          {extractError && (
            <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-faint">
              Using offline card · {extractError}
            </p>
          )}
        </div>
      </main>
    );
  }

  return <ResultPage seed={resultSeed ?? seed} onRestart={reset} />;
}
