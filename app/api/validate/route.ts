import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  const stored = await redis.get<string>("endgame:token");
  if (!stored) {
    return NextResponse.json({ error: "No token set" }, { status: 500 });
  }

  const valid = token === stored;
  return NextResponse.json({ valid });
}
