import { redis } from "./_redis.js";

export default async function handler(req, res) {
  let body = "";
  for await (const chunk of req) body += chunk;
  const { key } = JSON.parse(body || {});

  await redis.del(`hwids:${key}`);
  res.json({ ok: true });
}
