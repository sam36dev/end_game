import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  if (!process.env.ACCESS_TOKEN) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const valid = token === process.env.ACCESS_TOKEN;
  return NextResponse.json({ valid });
}
