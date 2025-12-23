import { redis } from "./_redis.js";

export default async function handler(req, res) {
  const { session } = req.query;
  const step = await redis.get(`progress:${session}`);
  res.json({ step: Number(step || 0) });
}
