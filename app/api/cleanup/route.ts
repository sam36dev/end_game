import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import type { Entry } from "@/types";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function GET() {
  const raw = await redis.lrange<string>("endgame:entries", 0, -1);
  const entries: Entry[] = raw.map((item) =>
    typeof item === "string" ? JSON.parse(item) : item
  );

  const filtered = entries.filter(
    (e) => !(e.nome === "sdas" && e.sobrenome === "sadd" && e.numero === 16)
  );

  await redis.del("endgame:entries");
  for (const entry of filtered) {
    await redis.rpush("endgame:entries", JSON.stringify(entry));
  }

  return NextResponse.json({ removed: entries.length - filtered.length });
}
