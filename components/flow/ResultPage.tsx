"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { MemorySeed } from "@/lib/types";
import { MomentCard } from "./MomentCard";

type SaveState = "preview" | "saving" | "kept";
type ShareMode = "closed" | "choice" | "card" | "question";

function useComingToast(): [boolean, () => void] {
  const [coming, setComing] = useState(false);
  const timer = useRef<number | null>(null);
  function show() {
    if (timer.current) window.clearTimeout(timer.current);
    setComing(true);
    timer.current = window.setTimeout(() => setComing(false), 1500);
  }
  return [coming, show];
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Result page — Moment Card on top, Memory Map preview below, on one screen.
 * Clicking Keep or Share first animates the card shrinking into the map and
 * lights the node (v4 §7), then either rests on "Find another moment" or opens
 * the Share sheet.
 */
export function ResultPage({
  seed,
  onRestart,
}: {
  seed: MemorySeed;
  onRestart: () => void;
}) {
  const [saveState, setSaveState] = useState<SaveState>("preview");
  const [toast, setToast] = useState(false);
  const [share, setShare] = useState<ShareMode>("closed");
  const trigger = useRef<"keep" | "share">("keep");
  const ghostRef = useRef<HTMLDivElement>(null);
  const [coming, showComing] = useComingToast();

  useLayoutEffect(() => {
    if (saveState !== "saving") return;
    const map = document.getElementById("memory-map");
    const node = document.getElementById("moment-node");
    const ghost = ghostRef.current;
    if (map) map.scrollIntoView({ block: "end" });
    if (!ghost || !node) return;
    const gRect = ghost.getBoundingClientRect();
    const nRect = node.getBoundingClientRect();
    const distance =
      nRect.top + nRect.height / 2 - (gRect.top + gRect.height / 2);
    ghost.style.setProperty("--save-travel-y", `${Math.max(0, distance)}px`);
  }, [saveState]);

  function runSave(action: "keep" | "share") {
    if (saveState !== "preview") return;
    trigger.current = action;

    if (prefersReducedMotion()) {
      setSaveState("kept");
      setToast(true);
      window.setTimeout(() => {
        setToast(false);
        if (action === "share") setShare("choice");
      }, 600);
      return;
    }

    setSaveState("saving");
    window.setTimeout(() => setSaveState("kept"), 1000);
    window.setTimeout(() => setToast(true), 1100);
    window.setTimeout(() => {
      setToast(false);
      if (action === "share") setShare("choice");
    }, 1300);
  }

  return (
    <main className="relative z-10 flex min-h-[100dvh] flex-col px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[max(2.25rem,env(safe-area-inset-top))]">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-faint">
        A memory card
      </p>

      {/* card + travelling ghost */}
      <div className="relative mt-4">
        <div className={saveState === "saving" ? "card-pulse" : ""}>
          <MomentCard card={seed.card} id="moment-card" />
        </div>
        {saveState === "saving" && (
          <div aria-hidden ref={ghostRef} className="save-ghost">
            <div className="rounded-[4px] border border-line bg-paper px-4 py-3">
              <p className="whitespace-pre-line font-display text-[15px] leading-tight text-ink">
                “{seed.card.originalQuote}”
              </p>
            </div>
          </div>
        )}
      </div>

      {/* action buttons — hidden once kept (keep path) */}
      {saveState !== "kept" && (
        <div className="mt-5 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => runSave("keep")}
            disabled={saveState === "saving"}
            className="halo-cta halo-cta-primary w-full"
          >
            Keep this one
          </button>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => runSave("share")}
              disabled={saveState === "saving"}
              className="halo-cta halo-cta-secondary flex-1"
            >
              Share
            </button>
            <button
              type="button"
              onClick={showComing}
              className="halo-cta halo-cta-ghost flex-1"
            >
              Edit
            </button>
          </div>
        </div>
      )}

      {/* memory map preview */}
      <div className="mt-7">
        <MemoryMapPreview seed={seed} kept={saveState === "kept"} />
      </div>

      {saveState === "kept" && (
        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onRestart}
            className="halo-cta halo-cta-primary w-full"
          >
            Find another moment
          </button>
          {share === "closed" && (
            <button
              type="button"
              onClick={() => setShare("choice")}
              className="halo-cta halo-cta-secondary w-full"
            >
              Share with a question
            </button>
          )}
        </div>
      )}

      <div className="mt-auto" />

      {toast && (
        <div className="halo-toast" role="status">
          This moment has been kept.
        </div>
      )}

      {share !== "closed" && (
        <ShareSheet
          seed={seed}
          mode={share}
          setMode={setShare}
          onClose={() => setShare("closed")}
          onComing={showComing}
        />
      )}

      {coming && (
        <div className="halo-toast" role="status">
          Coming after demo
        </div>
      )}
    </main>
  );
}

/* ----------------------------------------------------------------------------
 * Memory Map preview — warm paper constellation, NOT a knowledge graph.
 * One Moment Node (hollow → lit), the theme area, an arc hint, dark prompts.
 * -------------------------------------------------------------------------- */
function MemoryMapPreview({ seed, kept }: { seed: MemorySeed; kept: boolean }) {
  const m = seed.map;
  return (
    <section
      id="memory-map"
      className="relative overflow-hidden rounded-[4px] border border-line"
      style={{
        backgroundImage: "url('/assets/map-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-cream/55 px-5 py-6 backdrop-blur-[1px]">
        <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-rust">
          {m.themeArea}
        </p>
        <p className="mt-2 font-serif text-[13.5px] italic leading-relaxed text-ink2">
          {m.arcHint}
        </p>

        <div className="mt-5 flex items-start gap-3">
          <span className="relative mt-[3px] flex h-3.5 w-3.5 shrink-0 items-center justify-center">
            {kept && <span aria-hidden className="map-halo-ring" />}
            <span
              id="moment-node"
              className={`relative inline-block h-3.5 w-3.5 rounded-full border ${
                kept ? "node-lit border-green bg-green" : "border-ink2/50 bg-transparent"
              }`}
            />
          </span>
          <div>
            <p
              className={`font-serif text-[16px] leading-snug ${
                kept ? "text-ink" : "text-ink2"
              }`}
            >
              {m.momentNode.title}
            </p>
            {kept && (
              <p className="halo-rise mt-1 font-serif text-[13.5px] italic leading-snug text-ink2">
                {m.momentNode.haloLine}
              </p>
            )}
          </div>
        </div>

        {kept ? (
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-green">
            This moment has been kept.
          </p>
        ) : (
          <>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.26em] text-faint">
              Moments you could keep next
            </p>
            <ul className="mt-2 flex flex-col gap-2 opacity-60">
              {m.darkPrompts.map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <span className="inline-block h-2 w-2 rounded-full border border-line" />
                  <span className="font-serif text-[14px] text-ink2">{p}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * Share sheet — disclosure first, invitation second. Static previews only.
 * -------------------------------------------------------------------------- */
function ShareSheet({
  seed,
  mode,
  setMode,
  onClose,
  onComing,
}: {
  seed: MemorySeed;
  mode: ShareMode;
  setMode: (m: ShareMode) => void;
  onClose: () => void;
  onComing: () => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const r = seed.receiverPreview;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <div
        className="absolute inset-0 bg-ink/30"
        onClick={onClose}
        aria-hidden
      />
      <div className="halo-sheet relative w-full max-w-[430px] rounded-t-[14px] border-t border-line bg-cream px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-5">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line" />

        {mode === "choice" && (
          <>
            <h3 className="font-display text-[22px] text-ink">
              How would you like to share?
            </h3>
            <div className="mt-5 flex flex-col gap-3">
              <SheetOption
                title="Share this card"
                sub="Let someone see this moment."
                onClick={() => setMode("card")}
              />
              <SheetOption
                title="Share with a question"
                sub="Invite them to add their version."
                onClick={() => setMode("question")}
              />
            </div>
          </>
        )}

        {mode === "card" && (
          <>
            <h3 className="font-display text-[20px] text-ink">Share this card</h3>
            <div className="mt-4 rounded-[4px] border border-line bg-paper px-5 py-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-faint">
                Iris shared a HALO Moment Card.
              </p>
              <p className="mt-3 font-display text-[18px] leading-tight text-ink2">
                {seed.card.title}
              </p>
              <p className="mt-2 whitespace-pre-line font-display text-[22px] leading-[1.16] text-ink">
                “{seed.card.originalQuote}”
              </p>
              <p className="mt-3 font-serif text-[14px] italic leading-snug text-ink2">
                {seed.card.haloLine}
              </p>
            </div>
            <div className="mt-4 flex gap-2.5">
              <button
                type="button"
                onClick={onComing}
                className="halo-cta halo-cta-secondary flex-1"
              >
                Copy card link
              </button>
              <button
                type="button"
                onClick={onComing}
                className="halo-cta halo-cta-secondary flex-1"
              >
                Download image
              </button>
            </div>
          </>
        )}

        {mode === "question" && picked === null && (
          <>
            <h3 className="font-display text-[20px] leading-tight text-ink">
              Pick a gentle question to send with your card.
            </h3>
            <div className="mt-4 flex flex-col gap-2.5">
              {seed.shareQuestions.map((q, i) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setPicked(i)}
                  className="w-full rounded-[3px] border border-line bg-paper px-4 py-3 text-left font-serif text-[14.5px] text-ink transition active:scale-[0.99]"
                >
                  {q}
                </button>
              ))}
            </div>
          </>
        )}

        {mode === "question" && picked !== null && (
          <>
            <h3 className="font-display text-[20px] text-ink">Ready to send</h3>
            <div className="mt-4 rounded-[4px] border border-line bg-paper px-5 py-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-faint">
                {r.intro}
              </p>
              <p className="mt-3 font-display text-[21px] leading-[1.18] text-ink">
                “{seed.card.originalQuote.replace(/\n/g, " ")}”
              </p>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
                She asks
              </p>
              <p className="mt-1 font-serif text-[15.5px] leading-snug text-ink">
                {seed.shareQuestions[picked]}
              </p>
              <div className="mt-5 border-t border-line pt-4">
                <button
                  type="button"
                  onClick={onComing}
                  className="inline-flex items-center gap-2 rounded-full border border-green px-4 py-2 font-sans text-[13px] text-green"
                >
                  {r.cta}
                  <span className="text-[15px]">→</span>
                </button>
              </div>
            </div>
          </>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full py-2 text-center font-mono text-[11px] uppercase tracking-[0.24em] text-faint"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function SheetOption({
  title,
  sub,
  onClick,
}: {
  title: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-[4px] border border-line bg-paper px-5 py-4 text-left transition active:scale-[0.99]"
    >
      <p className="font-display text-[18px] text-ink">{title}</p>
      <p className="mt-1 font-sans text-[12.5px] text-ink2">{sub}</p>
    </button>
  );
}
