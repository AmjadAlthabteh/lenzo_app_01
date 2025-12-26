import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok", time: new Date().toISOString() });
}

export async function OPTIONS() {
  // Permissive CORS for preview/static contexts
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

