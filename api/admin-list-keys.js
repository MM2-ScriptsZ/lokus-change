import { redis } from "./_redis.js";

export default async function handler(req, res) {
  const admin = req.headers["x-admin-session"];
  if (!admin || !(await redis.get(`admin:${admin}`))) {
    return res.status(401).end();
  }

  const keys = await redis.keys("key:*");
  const result = [];

  for (const k of keys) {
    const key = k.replace("key:", "");
    const data = await redis.hgetall(k);
    result.push({
      key,
      hwid: data.hwid || "UNBOUND",
      banned: data.banned === "true",
      createdAt: data.createdAt || ""
    });
  }

  res.json({ keys: result });
}
