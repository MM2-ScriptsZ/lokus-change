import { redis } from "./_redis.js";

export default async function handler(req, res) {
  let body = "";
  for await (const chunk of req) body += chunk;
  const { token, session } = JSON.parse(body || "{}");

  if (!token || !session) {
    return res.json({ ok: false });
  }

  const data = await redis.hgetall(`challenge:${token}`);
  if (!data || data.used === "true") {
    return res.json({ ok: false });
  }

  const createdAt = Number(data.createdAt);
  const now = Date.now();

  // ⏱️ Minimum time spent (anti-bypass)
  if (now - createdAt < 8000) {
    return res.json({ ok: false });
  }

  // Mark challenge as used
  await redis.hset(`challenge:${token}`, { used: "true" });

  // Unlock progress for session
  await redis.set(`progress:${session}`, "1", { ex: 600 });

  res.json({ ok: true });
}
