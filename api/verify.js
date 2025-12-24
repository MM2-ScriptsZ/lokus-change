import { redis } from "./_redis.js";

export default async function handler(req, res) {
  let body = "";
  for await (const chunk of req) body += chunk;
  const { token, session } = JSON.parse(body || "{}");

  if (!token || !session) {
    return res.json({ ok: false, reason: "missing_data" });
  }

  const data = await redis.hgetall(`challenge:${token}`);
  if (!data) {
    return res.json({ ok: false, reason: "token_not_found" });
  }

  if (data.used === "true") {
    return res.json({ ok: false, reason: "token_used" });
  }

  // 🔧 TEMPORARILY DISABLE TIME CHECK
  // const createdAt = Number(data.createdAt);
  // if (Date.now() - createdAt < 8000) {
  //   return res.json({ ok: false, reason: "too_fast" });
  // }

  await redis.hset(`challenge:${token}`, { used: "true" });
  await redis.set(`progress:${session}`, "1", { ex: 600 });

  return res.json({ ok: true });
}
