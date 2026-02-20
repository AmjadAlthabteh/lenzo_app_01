import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Cmd = { id: number; cmd: string; at: string };
let last: Cmd = { id: 0, cmd: "", at: new Date(0).toISOString() };

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  const res = NextResponse.json(last);
  Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { cmd?: string };
    const cmd = (body.cmd || "").toString();

    if (cmd.length > 1000) {
      const res = NextResponse.json({ error: "Command too long" }, { status: 400 });
      Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
      return res;
    }

    last = { id: last.id + 1, cmd, at: new Date().toISOString() };
    const res = NextResponse.json({ ok: true, id: last.id });
    Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  } catch {
    const res = NextResponse.json({ error: "Malformed request" }, { status: 400 });
    Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  }
}
