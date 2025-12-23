import { redis } from "./_redis.js";

export default async function handler(req, res) {
  try {
    let body = "";
    for await (const chunk of req) body += chunk;
    const { secret } = JSON.parse(body || "{}");

    if (!secret || secret !== process.env.ADMIN_SECRET) {
      return res.json({ ok: false });
    }

    const session = Math.random().toString(36).slice(2);
    await redis.set(`admin:session:${session}`, "1", { ex: 3600 });

    res.json({ ok: true, session });
  } catch {
    res.status(500).json({ ok: false });
  }
}
