import { NextResponse } from "next/server";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const { email } = (await req.json()) as { email?: string };
    if (!email || !/.+@.+\..+/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // In a real app, persist this to a DB or provider.
    // For now, we log server-side to confirm receipt.
    console.log("[Luxin] Access request:", { email, at: new Date().toISOString() });

    const res = NextResponse.json({ ok: true });
    Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  } catch {
    const res = NextResponse.json({ error: "Malformed request" }, { status: 400 });
    Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  }
}
