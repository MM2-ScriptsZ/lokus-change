import { redis } from "./_redis.js";

export default async function handler(req, res) {
  let body = "";
  for await (const chunk of req) body += chunk;
  const { key, hwid } = JSON.parse(body || {});

  const data = await redis.hgetall(`key:${key}`);
  if (!data) return res.json({ ok: false });
  if (data.banned === "true") return res.json({ ok: false, reason: "banned" });
  if (Date.now() > Number(data.expiresAt)) return res.json({ ok: false, reason: "expired" });

  await redis.set(`hwid:${hwid}`, key);
  res.json({ ok: true });
}
