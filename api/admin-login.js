import { redis } from "./_redis.js";
import crypto from "crypto";

export default async function handler(req, res) {
  let body = "";
  for await (const c of req) body += c;
  const { secret } = JSON.parse(body || "{}");

  if (secret !== process.env.ADMIN_SECRET) {
    return res.json({ ok: false });
  }

  const session = crypto.randomBytes(16).toString("hex");
  await redis.set(`admin:${session}`, "1", { ex: 3600 });

  res.json({ ok: true, session });
}
