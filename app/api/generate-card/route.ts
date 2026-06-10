// POST /api/generate-card
// Body:   { memoryText: string, followUpAnswers?: string[], entryLabel?: string }
// Returns: a complete canonical MomentCard (JSON).
//
// If OPENAI_API_KEY is set, HALO calls the model with a structured prompt and
// coerces the result into a complete card. If the key is missing OR anything
// fails, it falls back to a deterministic mock built from the user's own words,
// so the demo always produces a real, saveable card. The API key never leaves
// the server.

import { NextResponse } from "next/server";
import { buildMockCard, coerceCard, makeId } from "@/lib/halo/mockCard";
import { GENERATE_CARD_SYSTEM, buildCardUserMessage } from "@/lib/halo/cardPrompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  memoryText?: string;
  followUpAnswers?: unknown;
  entryLabel?: string;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const memoryText = typeof body.memoryText === "string" ? body.memoryText.trim() : "";
  const followUpAnswers = Array.isArray(body.followUpAnswers)
    ? body.followUpAnswers.filter((a): a is string => typeof a === "string")
    : [];
  const entryLabel = typeof body.entryLabel === "string" ? body.entryLabel : undefined;

  if (!memoryText && followUpAnswers.length === 0) {
    return NextResponse.json(
      { error: "memoryText or followUpAnswers required" },
      { status: 400 },
    );
  }

  const id = makeId("card");
  const createdAt = new Date().toISOString();
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  // No key configured → deterministic mock. Honest, offline-safe path.
  if (!apiKey || apiKey.startsWith("sk-REPLACE")) {
    const card = buildMockCard(memoryText, followUpAnswers, { id, createdAt, entryLabel });
    return NextResponse.json({ card, source: "mock" });
  }

  // Key present → real model, with the mock as a guaranteed safety net.
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
          { role: "system", content: GENERATE_CARD_SYSTEM },
          { role: "user", content: buildCardUserMessage(memoryText, followUpAnswers, entryLabel) },
        ],
        temperature: 0.4,
        response_format: { type: "json_object" },
        max_tokens: 700,
      }),
    });
    if (!r.ok) throw new Error(`openai ${r.status}`);
    const data = await r.json();
    const raw: string = data?.choices?.[0]?.message?.content ?? "";
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const card = coerceCard(parsed, memoryText, followUpAnswers, { id, createdAt, entryLabel });
    return NextResponse.json({ card, source: "openai" });
  } catch {
    // Any failure (network, non-JSON, rate limit) → mock, still a real card.
    const card = buildMockCard(memoryText, followUpAnswers, { id, createdAt, entryLabel });
    return NextResponse.json({ card, source: "mock-fallback" });
  }
}
