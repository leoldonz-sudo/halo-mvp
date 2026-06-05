// POST /api/halo/chat — one conversation turn.
// Body: { messages: ChatTurn[], seed: { entryLabel, openerQuestion, imageObservation? } }
// Returns: { reply: string, done: boolean }
//
// Server-side only. The OpenAI API key never leaves the server.

import { NextResponse } from "next/server";
import type { ChatTurn } from "@/lib/types";
import { HALO_CHAT_SYSTEM, isClosure } from "@/lib/haloPrompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SeedContext = {
  entryLabel: string;
  openerQuestion: string;
  imageObservation?: string;
};

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

  const seedContext = [
    `Entry type the user picked: ${seed.entryLabel}`,
    seed.imageObservation ? `What HALO already said it sees: ${seed.imageObservation}` : null,
    `The opening line HALO already said to the user: "${seed.openerQuestion}"`,
  ]
    .filter(Boolean)
    .join("\n");

  const openaiMessages = [
    { role: "system" as const, content: HALO_CHAT_SYSTEM },
    { role: "system" as const, content: seedContext },
    ...messages.map((m) => ({
      role: m.role === "halo" ? ("assistant" as const) : ("user" as const),
      content: m.text,
    })),
  ];

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: openaiMessages,
        temperature: 0.7,
        max_tokens: 220,
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
    const reply: string = data?.choices?.[0]?.message?.content?.trim() ?? "";
    return NextResponse.json({ reply, done: isClosure(reply) });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "fetch failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
