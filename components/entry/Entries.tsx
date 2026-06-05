"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { MemorySeed } from "@/lib/types";
import {
  MOMENT_CHIPS,
  OBJECT_PRESETS,
  GUIDE_QUESTIONS,
  type ObjectSeedKey,
} from "@/lib/demoData";
import { XiaomanAvatar } from "@/components/XiaomanAvatar";

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      type="button"
      onClick={onBack}
      aria-label="Back"
      className="-ml-1 mb-5 inline-flex h-9 w-9 items-center justify-center text-[22px] text-ink2"
    >
      ←
    </button>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative z-10 flex min-h-[100dvh] flex-col px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[max(2.25rem,env(safe-area-inset-top))]">
      {children}
    </main>
  );
}

/* ----------------------------------------------------------------------------
 * Screen 2A — A moment I never captured. HALO asks first.
 * -------------------------------------------------------------------------- */
export function MomentEntry({
  seed,
  onBack,
  onSubmit,
}: {
  seed: MemorySeed;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const [text, setText] = useState("");

  return (
    <Shell>
      <BackButton onBack={onBack} />

      <div className="flex items-center gap-3">
        <XiaomanAvatar size={44} mood="idle" priority />
        <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-faint">
          HALO asks first
        </span>
      </div>

      <h1 className="mt-6 font-display text-[26px] leading-[1.18] text-ink">
        {seed.openerQuestion}
      </h1>
      <p className="mt-3 font-sans text-[13px] leading-relaxed text-ink2">
        Just write one sentence. Start with the part you remember.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {MOMENT_CHIPS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setText(seed.userFragment)}
            className="rounded-full border border-line bg-paper px-3.5 py-1.5 text-left font-serif text-[12.5px] text-ink2 transition active:scale-[0.98]"
          >
            {c}
          </button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="I remember..."
        rows={4}
        className="halo-input mt-5 resize-none"
      />

      <div className="mt-auto pt-7">
        <button
          type="button"
          onClick={onSubmit}
          disabled={text.trim().length === 0}
          className="halo-cta halo-cta-primary w-full"
        >
          Let HALO listen
        </button>
      </div>
    </Shell>
  );
}

/* ----------------------------------------------------------------------------
 * Screen 2B — A photo or object I kept. HALO sees first.
 * -------------------------------------------------------------------------- */
export function PhotoObjectEntry({
  seed,
  onBack,
  onSubmit,
  onPickSeed,
}: {
  seed: MemorySeed;
  onBack: () => void;
  onSubmit: () => void;
  onPickSeed: (key: ObjectSeedKey) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Keep the user's real uploaded image; presets show their own asset.
  const image = picked;
  const chosen = picked !== null || uploaded;

  function pickPreset(key: ObjectSeedKey, asset: string) {
    onPickSeed(key);
    setPicked(asset);
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      onPickSeed("upload");
      setUploaded(true);
      setPicked(URL.createObjectURL(f));
    }
  }

  // imageObservation / openerQuestion now come from the picked seed itself
  // (set by the parent via onPickSeed), so every preset stays honest.
  const observation = seed.imageObservation;
  const followUp = seed.openerQuestion;

  return (
    <Shell>
      <BackButton onBack={onBack} />

      {!chosen ? (
        <>
          <h1 className="font-display text-[26px] leading-[1.18] text-ink">
            A photo or object you kept
          </h1>
          <p className="mt-3 font-sans text-[13px] leading-relaxed text-ink2">
            Choose something you kept, even if others may not understand why.
          </p>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onFile}
            className="hidden"
          />
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="halo-cta halo-cta-secondary flex-1"
            >
              Take a photo
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="halo-cta halo-cta-secondary flex-1"
            >
              Upload a photo
            </button>
          </div>

          <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.3em] text-faint">
            Or start with one of these
          </p>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {OBJECT_PRESETS.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => pickPreset(o.id, o.asset)}
                className="overflow-hidden rounded-[3px] border border-line bg-paper text-left transition active:scale-[0.98]"
              >
                <div className="relative aspect-square w-full">
                  <Image
                    src={o.asset}
                    alt={o.label}
                    fill
                    sizes="33vw"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <p className="px-2 py-2 font-serif text-[11.5px] leading-tight text-ink2">
                  {o.label}
                </p>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="overflow-hidden rounded-[3px] border border-line bg-paper">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={image ?? seed.imageAsset ?? "/assets/object-box.png"}
                alt={uploaded ? "Your uploaded image" : "Your kept object"}
                fill
                sizes="100vw"
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <XiaomanAvatar size={40} mood="thinking" priority />
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-faint">
              HALO sees
            </span>
          </div>
          <p className="mt-4 font-serif text-[16px] leading-[1.5] text-ink">
            {observation}
          </p>
          <p className="mt-3 font-serif text-[16px] leading-[1.5] text-ink2">
            {followUp}
          </p>

          <div className="mt-auto pt-7">
            <button
              type="button"
              onClick={onSubmit}
              className="halo-cta halo-cta-primary w-full"
            >
              Tell HALO about it
            </button>
          </div>
        </>
      )}
    </Shell>
  );
}

/* ----------------------------------------------------------------------------
 * Screen 2C — Let HALO guide me. Choose one small place to start.
 * -------------------------------------------------------------------------- */
export function GuideEntry({
  onBack,
  onSelect,
}: {
  onBack: () => void;
  onSelect: (question: string) => void;
}) {
  return (
    <Shell>
      <BackButton onBack={onBack} />

      <h1 className="font-display text-[26px] leading-[1.18] text-ink">
        Choose one small place to start.
      </h1>
      <p className="mt-3 font-sans text-[13px] leading-relaxed text-ink2">
        You don't need a photo or anything prepared. Just pick one.
      </p>

      <div className="mt-6 flex flex-col gap-2.5">
        {GUIDE_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onSelect(q)}
            className="w-full rounded-[3px] border border-line bg-paper px-4 py-3 text-left font-serif text-[15px] text-ink transition active:scale-[0.99]"
          >
            {q}
          </button>
        ))}
      </div>

      <div className="mt-auto" />
    </Shell>
  );
}
