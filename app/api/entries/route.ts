import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";
import type { Entry } from "@/types";

export async function GET() {
  try {
    const raw = await kv.lrange<string>("endgame:entries", 0, -1);
    const entries: Entry[] = raw.map((item) =>
      typeof item === "string" ? JSON.parse(item) : item
    );
    const sorted = entries.sort((a, b) => b.numero - a.numero);
    return NextResponse.json(sorted);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  const { token, entry } = await req.json();

  if (!token || token !== process.env.ACCESS_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await kv.lpush("endgame:entries", JSON.stringify(entry));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Storage error" }, { status: 500 });
  }
}
