import { redis } from "./_redis.js";

export default async function handler(req, res) {
  const session = req.headers["x-admin-session"];
  if (!session) return res.status(401).end();

  const ok = await redis.get(`admin:session:${session}`);
  if (!ok) return res.status(401).end();

  const keys = {};
  const list = await redis.keys("key:*");

  for (const k of list) {
    const data = await redis.hgetall(k);
    keys[k.replace("key:", "")] = data;
  }

  res.json({ keys });
}
