import { redis } from "./_redis.js";

export default async function handler(req, res) {
  const { session, step } = req.query;
  await redis.set(`progress:${session}`, step, { ex: 600 });
  res.redirect(`/?session=${session}`);
}
