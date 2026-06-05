"use client";

import { useEffect, useState } from "react";
import { useRef } from "react";
import type { ChatTurn, EntryType, MemorySeed } from "@/lib/types";
import { SEEDS, OBJECT_SEEDS, GUIDE_OPENERS, type ObjectSeedKey } from "@/lib/demoData";
import { HomeHero } from "@/components/home/HomeHero";
import { XiaomanAvatar } from "@/components/XiaomanAvatar";
import { MomentEntry, PhotoObjectEntry, GuideEntry } from "@/components/entry/Entries";
import { HALOConversation } from "@/components/flow/HALOConversation";
import { MemorySignalsPanel } from "@/components/flow/MemorySignalsPanel";
import { deriveSignals } from "@/lib/deriveSignals";
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
  // External input state for the pinned bottom input bar
  const [convInput, setConvInput] = useState("");
  const [convBusy, setConvBusy] = useState(false);
  const sendRef = useRef<(text: string) => void>(() => {});

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
    // Use HALO's specific opener for this prompt, falling back to the question itself
    const opener = GUIDE_OPENERS[question] ?? question;
    setCustomSeed({
      ...base,
      openerQuestion: opener,
      transcript: [
        { role: "halo", text: opener },
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
    const liveSignals = deriveSignals(liveMessages);
    const userTurns = liveMessages.filter((m) => m.role === "user").length;
    const showSignals = userTurns > 0;

    function handleConvSend() {
      const t = convInput.trim();
      if (!t || convBusy) return;
      sendRef.current(t);
      setConvInput("");
    }

    function handleConvKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleConvSend(); }
    }

    return (
      <div className="halo-conv-shell">
        {/* ── Header ── */}
        <header className="halo-conv-header">
          <button
            type="button"
            onClick={() => setStep("entry")}
            aria-label="Back"
            className="halo-conv-back"
          >←</button>
          <span className="halo-conv-title">H A L O</span>
          <XiaomanAvatar size={34} mood={convBusy ? "thinking" : "idle"} />
        </header>

        {/* ── Scrollable chat + signals ── */}
        <div className="halo-conv-body">
          <HALOConversation
            seed={seed}
            preset={presetTalk}
            renderInput={false}
            showHeader={false}
            onTurnsShown={setTurns}
            onComplete={() => setTalkDone(true)}
            onMessages={setLiveMessages}
            onGenerateCard={goToResult}
            onRegisterSend={(fn) => { sendRef.current = fn; }}
            onBusyChange={setConvBusy}
          />

          {showSignals && (
            <div className="halo-conv-signals">
              <MemorySignalsPanel signals={liveSignals} />
            </div>
          )}
        </div>

        {/* ── Pinned footer: input + draft CTA ── */}
        <div className="halo-conv-footer">
          <div className="halo-conv-input-row">
            <textarea
              className="halo-input halo-conv-textarea"
              rows={1}
              placeholder="Tell HALO what you remember..."
              value={convInput}
              onChange={(e) => setConvInput(e.target.value)}
              onKeyDown={handleConvKey}
              disabled={convBusy}
            />
            <button
              type="button"
              className="halo-conv-send"
              onClick={handleConvSend}
              disabled={convBusy || !convInput.trim()}
            >Send</button>
          </div>

          <div className="halo-conv-draft">
            <span className="halo-conv-draft__spark">✦</span>
            <div className="halo-conv-draft__text">
              <p className="halo-conv-draft__title">A Moment Card is forming</p>
              <p className="halo-conv-draft__sub">Keep going, or create a draft now.</p>
            </div>
            <button
              type="button"
              className="halo-conv-draft__btn"
              onClick={goToResult}
              disabled={extracting}
            >
              {extracting ? "Preserving…" : "Create draft card"}
            </button>
          </div>

          {extractError && (
            <p className="text-center font-mono text-[10px] uppercase tracking-[0.22em] text-faint">
              Using offline card · {extractError}
            </p>
          )}
        </div>
      </div>
    );
  }

  return <ResultPage seed={resultSeed ?? seed} onRestart={reset} />;
}
