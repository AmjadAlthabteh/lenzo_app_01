import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date().toISOString();
  const scenes = [
    {
      id: "focus",
      name: "Focus",
      brightness: 85,
      temperature: 5000,
      category: "productivity",
      createdAt: "2024-01-15T10:00:00Z",
      lastUsed: now,
    },
    {
      id: "relax",
      name: "Relax",
      brightness: 55,
      temperature: 3000,
      category: "wellness",
      createdAt: "2024-01-15T10:00:00Z",
      lastUsed: null,
    },
    {
      id: "night",
      name: "Night Light",
      brightness: 15,
      temperature: 2700,
      category: "sleep",
      createdAt: "2024-01-15T10:00:00Z",
      lastUsed: null,
    },
    {
      id: "energize",
      name: "Energize",
      brightness: 100,
      temperature: 6500,
      category: "productivity",
      createdAt: "2024-01-15T10:00:00Z",
      lastUsed: null,
    },
  ];
  return NextResponse.json({ scenes, total: scenes.length });
}

