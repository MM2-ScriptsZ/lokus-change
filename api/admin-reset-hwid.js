import { redis } from "./_redis.js";

export default async function handler(req, res) {
  let body = "";
  for await (const c of req) body += c;
  const { key } = JSON.parse(body || {});

  await redis.hdel(`key:${key}`, "hwid");
  res.json({ ok: true });
}
