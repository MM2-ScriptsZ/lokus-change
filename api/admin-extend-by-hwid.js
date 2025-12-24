import { redis } from "./_redis.js";

export default async function handler(req, res) {
  let body = "";
  for await (const c of req) body += c;
  const { key, hours } = JSON.parse(body || "{}");

  const data = await redis.hgetall(`key:${key}`);
  if (!data || !data.expiresAt) {
    return res.json({ ok: false });
  }

  const extra = (hours || 24) * 60 * 60 * 1000;
  const newExpire = Number(data.expiresAt) + extra;

  await redis.hset(`key:${key}`, {
    expiresAt: newExpire.toString()
  });

  res.json({ ok: true, expiresAt: newExpire });
}
