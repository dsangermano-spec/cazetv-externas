import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

let redis;
try { redis = Redis.fromEnv(); } catch { redis = null; }

export async function GET() {
  try {
    if (redis) {
      const data = await redis.get("cazetv_data");
      return NextResponse.json(data ? (typeof data === "string" ? JSON.parse(data) : data) : {});
    }
  } catch {}
  return NextResponse.json({});
}

export async function POST(req) {
  try {
    const body = await req.json();
    if (redis) await redis.set("cazetv_data", JSON.stringify(body));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
