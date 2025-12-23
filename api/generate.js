import { redis } from "./_redis.js";
import crypto from "crypto";

export default async function handler(req, res) {
  let body = "";
  for await (const chunk of req) body += chunk;
  const { session } = JSON.parse(body || "{}");

  const progress = await redis.get(`progress:${session}`);
  if (progress !== "1") {
    return res.status(403).json({ error: "checkpoint_not_completed" });
  }

  const key = crypto.randomBytes(20).toString("hex").toUpperCase();
  const expiresAt = Date.now() + 86400000;

  await redis.hset(`key:${key}`, {
    expiresAt,
    banned: "false"
  });

  res.json({ key, expiresAt });
}
