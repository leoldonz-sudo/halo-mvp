// POST /api/share — create a cross-browser share invitation.
// Body:   { card: MomentCard, question?: string, shareMode?: ShareMode }
// Returns: { id, source: "supabase" }  — id is the shareId (UUID) for /share/[id]
//          503 { configured: false }   — Supabase not set up; client falls back to localStorage
//
// Server-side only: stores a full MomentCard snapshot as jsonb so the recipient
// (any browser) can read it without the creator's localStorage.

import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { MomentCard, ShareMode } from "@/lib/halo/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SHARE_MODES: ShareMode[] = [
  "card_only",
  "with_question",
  "ask_their_version",
  "similar_experience",
];

export async function POST(req: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ configured: false }, { status: 503 });
  }

  let body: { card?: MomentCard; question?: unknown; shareMode?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const card = body.card;
  if (!card || typeof card !== "object" || typeof card.id !== "string") {
    return NextResponse.json({ error: "card required" }, { status: 400 });
  }

  const shareMode: ShareMode = SHARE_MODES.includes(body.shareMode as ShareMode)
    ? (body.shareMode as ShareMode)
    : "ask_their_version";
  const question =
    typeof body.question === "string" && body.question.trim()
      ? body.question.trim().slice(0, 500)
      : card.shareQuestion ?? null;

  const { data, error } = await supabase
    .from("share_invitations")
    .insert({ card_id: card.id, card, share_mode: shareMode, question })
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "insert failed" },
      { status: 500 },
    );
  }

  return NextResponse.json({ id: data.id, source: "supabase" });
}
