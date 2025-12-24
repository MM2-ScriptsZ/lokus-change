import { redis } from "./_redis.js";

export default async function handler(req, res) {
  let body = "";
  for await (const c of req) body += c;
  const { key, hwid } = JSON.parse(body || "{}");

  if (!key || !hwid) {
    return res.json({ ok: false });
  }

  const data = await redis.hgetall(`key:${key}`);
  if (!data) {
    return res.json({ ok: false });
  }

  // 🚫 BANNED
  if (data.banned === "true") {
    return res.json({ ok: false, reason: "banned" });
  }

  // ⏱ EXPIRED
  if (data.expiresAt && Date.now() > Number(data.expiresAt)) {
    return res.json({ ok: false, reason: "expired" });
  }

  // 🔒 HWID bind
  if (!data.hwid) {
    await redis.hset(`key:${key}`, { hwid });
  } else if (data.hwid !== hwid) {
    return res.json({ ok: false, reason: "hwid_mismatch" });
  }

  res.json({ ok: true });
}
