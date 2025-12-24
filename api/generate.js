import { redis } from "./_redis.js";
import crypto from "crypto";

function makeKey() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "LOKUS-";
  for (let i = 0; i < 7; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export default async function handler(req, res) {
  let body = "";
  for await (const c of req) body += c;
  const { session } = JSON.parse(body || "{}");

  if (!session) {
    return res.json({ ok: false, reason: "missing_session" });
  }

  // 🔒 MUST be unlocked by verify
  const unlocked = await redis.get(`progress:${session}`);
  if (unlocked !== "1") {
    return res.json({ ok: false, reason: "checkpoint_not_completed" });
  }

  const key = makeKey();

  // ⏱️ 24h expiration
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

  await redis.hset(`key:${key}`, {
    createdAt: Date.now().toString(),
    expiresAt: expiresAt.toString(),
    banned: "false"
  });

  // 🔁 OPTIONAL: prevent generating multiple keys per session
  await redis.del(`progress:${session}`);

  res.json({
    ok: true,
    key,
    expiresAt
  });
}
