import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function GET() {
  try {
    const value = await redis.get<number>("endgame:config_number");
    return NextResponse.json({ number: value ?? 0 });
  } catch {
    return NextResponse.json({ number: 0 });
  }
}

export async function POST(req: NextRequest) {
  const { password, number } = await req.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await redis.set("endgame:config_number", number);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Redis error" }, { status: 500 });
  }
}
