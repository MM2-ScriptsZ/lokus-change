import { readDB, writeDB } from "./_db.js";

export default function handler(req, res) {
  const { key, hwid } = req.body || {};
  const db = readDB();

  const data = db.keys[key];
  if (!data || data.banned) return res.json({ ok: false });
  if (Date.now() > data.expiresAt) return res.json({ ok: false });

  if (!data.hwids.includes(hwid)) {
    if (data.hwids.length >= 3) return res.json({ ok: false });
    data.hwids.push(hwid);
  }

  writeDB(db);
  res.json({ ok: true });
}
