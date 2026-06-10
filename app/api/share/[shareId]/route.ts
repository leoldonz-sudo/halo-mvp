// GET  /api/share/[shareId] — fetch an invitation (card snapshot) + its responses.
// POST /api/share/[shareId] — add a recipient response, returns the updated list.
//
// 200 { source:"supabase", invitation, responses } | { source:"supabase", responses }
// 404 { error:"not found" }      — unknown/invalid id (client falls back to localStorage)
// 503 { configured:false }       — Supabase not set up (client falls back to localStorage)
//
// Server-side only. The browser never talks to Supabase directly.

import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID_RX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type ResponseRow = {
  id: string;
  response_text: string;
  responder_name: string | null;
  created_at: string;
};

function mapResponses(rows: ResponseRow[] | null) {
  return (rows ?? []).map((r) => ({
    id: r.id,
    responseText: r.response_text,
    responderName: r.responder_name ?? undefined,
    createdAt: r.created_at,
  }));
}

export async function GET(
  _req: Request,
  { params }: { params: { shareId: string } },
) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ configured: false }, { status: 503 });

  const id = params.shareId;
  if (!UUID_RX.test(id)) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const { data: inv, error } = await supabase
    .from("share_invitations")
    .select("id, card, question, share_mode, created_at")
    .eq("id", id)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!inv) return NextResponse.json({ error: "not found" }, { status: 404 });

  const { data: responses, error: rErr } = await supabase
    .from("shared_responses")
    .select("id, response_text, responder_name, created_at")
    .eq("invitation_id", id)
    .order("created_at", { ascending: true });
  if (rErr) return NextResponse.json({ error: rErr.message }, { status: 500 });

  return NextResponse.json({
    source: "supabase",
    invitation: {
      id: inv.id,
      card: inv.card,
      question: inv.question,
      shareMode: inv.share_mode,
      createdAt: inv.created_at,
    },
    responses: mapResponses(responses as ResponseRow[] | null),
  });
}

export async function POST(
  req: Request,
  { params }: { params: { shareId: string } },
) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ configured: false }, { status: 503 });

  const id = params.shareId;
  if (!UUID_RX.test(id)) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  let body: { responseText?: unknown; responderName?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const responseText =
    typeof body.responseText === "string" ? body.responseText.trim() : "";
  if (!responseText) {
    return NextResponse.json({ error: "responseText required" }, { status: 400 });
  }
  const responderName =
    typeof body.responderName === "string" && body.responderName.trim()
      ? body.responderName.trim().slice(0, 80)
      : null;

  // Ensure the invitation exists before inserting a response.
  const { data: inv } = await supabase
    .from("share_invitations")
    .select("id")
    .eq("id", id)
    .maybeSingle();
  if (!inv) return NextResponse.json({ error: "not found" }, { status: 404 });

  const { error } = await supabase.from("shared_responses").insert({
    invitation_id: id,
    response_text: responseText.slice(0, 4000),
    responder_name: responderName,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: responses } = await supabase
    .from("shared_responses")
    .select("id, response_text, responder_name, created_at")
    .eq("invitation_id", id)
    .order("created_at", { ascending: true });

  return NextResponse.json({
    source: "supabase",
    responses: mapResponses(responses as ResponseRow[] | null),
  });
}
