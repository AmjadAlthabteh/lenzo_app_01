import { NextResponse } from "next/server";

export async function GET() {
  const scenes = [
    { id: "focus", name: "Focus", brightness: 85, temperature: 5000 },
    { id: "relax", name: "Relax", brightness: 55, temperature: 3000 },
    { id: "night", name: "Night Light", brightness: 15, temperature: 2700 },
    { id: "energize", name: "Energize", brightness: 100, temperature: 6500 },
  ];
  return NextResponse.json({ scenes });
}

