import { redis } from "./_redis.js";

export default async function handler(req, res) {
  let body = "";
  for await (const chunk of req) body += chunk;
  const { hwid, minutes } = JSON.parse(body || {});

  const key = await redis.get(`hwid:${hwid}`);
  if (!key) return res.json({ ok: false });

  const add = minutes === "lifetime" ? 315360000000 : minutes * 60000;
  await redis.hincrby(`key:${key}`, "expiresAt", add);

  res.json({ ok: true });
}
