"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { MemoryNode, MomentCard } from "@/lib/halo/types";
import { listCards, listNodes } from "@/lib/halo/store";

/**
 * Memory Map — saved Moment Cards as a quiet constellation of nodes.
 * Each node opens its card detail. This is also the "return and see what you
 * kept" surface: it reads straight from localStorage, so it survives reloads.
 * No graph algorithms — just card → node → detail.
 */
export default function MemoryMapPage() {
  const [mounted, setMounted] = useState(false);
  const [cards, setCards] = useState<MomentCard[]>([]);
  const [nodes, setNodes] = useState<MemoryNode[]>([]);

  useEffect(() => {
    setCards(listCards());
    setNodes(listNodes());
    setMounted(true);
  }, []);

  const themes = Array.from(new Set(nodes.map((n) => n.theme))).slice(0, 6);

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-[430px] flex-col bg-cream px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]">
      {/* Header */}
      <header className="flex items-center justify-between">
        <Link
          href="/demo/start"
          aria-label="Back"
          className="font-mono text-[18px] leading-none text-ink2"
        >
          ←
        </Link>
        <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-rust">
          Memory Map
        </span>
        <span className="w-4" />
      </header>

      {!mounted ? null : nodes.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <p className="mt-6 font-display text-[26px] leading-tight text-ink">
            The moments that made you
          </p>
          <p className="mt-1.5 font-serif text-[14px] italic leading-snug text-ink2">
            {nodes.length} {nodes.length === 1 ? "moment" : "moments"} kept · a quiet map of becoming
          </p>

          {/* Constellation */}
          <div className="relative mt-5 w-full overflow-hidden rounded-[10px] border border-line bg-paper/80" style={{ aspectRatio: "1 / 1.05" }}>
            <div
              aria-hidden
              className="map-halo-ring"
              style={{ left: "calc(50% - 15px)", top: "calc(50% - 15px)" }}
            />
            {nodes.map((node) => (
              <Link
                key={node.id}
                href={`/card/${node.cardId}`}
                aria-label={`Open ${node.title}`}
                className="absolute flex max-w-[44%] -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-line bg-cream/90 px-2.5 py-1 transition active:scale-95"
                style={{ left: `${node.x * 100}%`, top: `${node.y * 100}%` }}
              >
                <span className="inline-block h-2 w-2 flex-none rounded-full border border-green bg-green" />
                <span className="truncate font-serif text-[11px] leading-tight text-ink2">
                  {node.title}
                </span>
              </Link>
            ))}
          </div>

          {/* Theme threads */}
          {themes.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {themes.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-line px-2.5 py-[3px] font-mono text-[9px] uppercase tracking-[0.16em] text-faint"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* List — accessible, scannable record of what's kept */}
          <p className="mt-7 font-mono text-[9.5px] uppercase tracking-[0.26em] text-faint">
            All kept moments
          </p>
          <ul className="mt-2 flex flex-col gap-2">
            {cards.map((card) => (
              <li key={card.id}>
                <Link
                  href={`/card/${card.id}`}
                  className="flex items-center gap-3 rounded-[6px] border border-line bg-paper px-4 py-3 transition active:scale-[0.99]"
                >
                  <span className="inline-block h-2 w-2 flex-none rounded-full border border-green bg-green" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-[15px] text-ink">
                      {card.title}
                    </span>
                    <span className="block truncate font-serif text-[12px] italic text-ink2">
                      {card.haloLine}
                    </span>
                  </span>
                  <span className="font-mono text-[14px] text-faint">→</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-7">
            <Link href="/demo/start" className="halo-cta halo-cta-primary w-full">
              Keep another moment
            </Link>
          </div>
        </>
      )}
    </main>
  );
}

function EmptyState() {
  return (
    <div className="mt-[18vh] flex flex-1 flex-col items-center text-center">
      <div className="relative">
        <div aria-hidden className="map-halo-ring" style={{ left: "calc(50% - 15px)", top: "-2px" }} />
        <span className="inline-block h-3 w-3 rounded-full border border-line" />
      </div>
      <p className="mt-8 font-display text-[24px] leading-tight text-ink">
        Your map is still empty
      </p>
      <p className="mt-2 max-w-[16rem] font-serif text-[14px] leading-snug text-ink2">
        It begins with one small moment. Keep a memory, and it becomes the first node here.
      </p>
      <Link href="/demo/start" className="halo-cta halo-cta-primary mt-7 w-full max-w-[18rem]">
        Start with one moment
      </Link>
    </div>
  );
}
