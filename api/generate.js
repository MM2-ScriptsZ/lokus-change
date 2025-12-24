import { redis } from "./_redis.js";
import crypto from "crypto";

export default async function handler(req, res) {
  let body = "";
  for await (const c of req) body += c;
  const { session } = JSON.parse(body || "{}");

  // Must be unlocked by token verification
  if (await redis.get(`progress:${session}`) !== "1") {
    return res.json({ error: "locked" });
  }

  const key = crypto.randomBytes(20).toString("hex").toUpperCase();

  // 🔴 EXPIRATION: 24 hours
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

  await redis.hset(`key:${key}`, {
    createdAt: Date.now().toString(),
    expiresAt: expiresAt.toString(),
    banned: "false"
  });

  res.json({ key, expiresAt });
}
