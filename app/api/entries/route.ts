import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import type { Entry } from "@/types";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET() {
  try {
    const raw = await redis.lrange<string>("endgame:entries", 0, -1);
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
    await redis.lpush("endgame:entries", JSON.stringify(entry));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Storage error" }, { status: 500 });
  }
}
