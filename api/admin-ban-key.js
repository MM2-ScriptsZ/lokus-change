import { redis } from "./_redis.js";

export default async function handler(req, res) {
  let body = "";
  for await (const c of req) body += c;
  const { key, ban } = JSON.parse(body || {});

  await redis.hset(`key:${key}`, {
    banned: ban ? "true" : "false"
  });

  res.json({ ok: true });
}
