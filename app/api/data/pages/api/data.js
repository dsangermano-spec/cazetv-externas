import { Redis } from "@upstash/redis";

let redis;
try { redis = Redis.fromEnv(); } catch { redis = null; }

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      if (redis) {
        const data = await redis.get("cazetv_data");
        return res.json(data ? (typeof data === "string" ? JSON.parse(data) : data) : {});
      }
    } catch {}
    return res.json({});
  }
  if (req.method === "POST") {
    try {
      if (redis) await redis.set("cazetv_data", JSON.stringify(req.body));
      return res.json({ ok: true });
    } catch (e) {
      return res.status(500).json({ ok: false, error: e.message });
    }
  }
  res.status(405).end();
}
