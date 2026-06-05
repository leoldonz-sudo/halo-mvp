// POST /api/halo/extract — given a finished transcript, returns the JSON
// pieces of MemorySeed (signals, card, map, shareQuestions, receiverPreview).
// The chat route guarantees the transcript ended on a closure line.

import { NextResponse } from "next/server";
import type { ChatTurn } from "@/lib/types";
import { HALO_EXTRACT_SYSTEM } from "@/lib/haloPrompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SeedContext = { entryLabel: string };

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  if (!apiKey || apiKey.startsWith("sk-REPLACE")) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY not configured" },
      { status: 500 },
    );
  }

  let body: { messages?: ChatTurn[]; seed?: SeedContext };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const seed = body.seed;
  if (!seed || messages.length === 0) {
    return NextResponse.json({ error: "missing messages or seed" }, { status: 400 });
  }

  const transcript = messages
    .map((m) => `${m.role === "halo" ? "HALO" : "USER"}: ${m.text}`)
    .join("\n");

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: HALO_EXTRACT_SYSTEM },
          {
            role: "user",
            content: `entryLabel: ${seed.entryLabel}\n\nTranscript:\n${transcript}`,
          },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
        max_tokens: 1100,
      }),
    });
    if (!r.ok) {
      const text = await r.text();
      return NextResponse.json(
        { error: `openai ${r.status}`, detail: text.slice(0, 400) },
        { status: 502 },
      );
    }
    const data = await r.json();
    const raw: string = data?.choices?.[0]?.message?.content ?? "";
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "extract returned non-json", raw: raw.slice(0, 400) },
        { status: 502 },
      );
    }
    return NextResponse.json(parsed);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "fetch failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
