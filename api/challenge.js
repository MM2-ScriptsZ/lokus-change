import { redis } from "./_redis.js";
import crypto from "crypto";

export default async function handler(req, res) {
  const token = crypto.randomBytes(16).toString("hex");

  // Save challenge: unused, created now
  await redis.hset(`challenge:${token}`, {
    used: "false",
    createdAt: Date.now().toString()
  });

  // Auto-expire in 15 minutes
  await redis.expire(`challenge:${token}`, 900);

  res.json({ token });
}
