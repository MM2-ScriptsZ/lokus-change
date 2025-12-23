import { readDB, writeDB } from "./_db.js";

export default function handler(req, res) {
  const db = readDB();
  for (const k in db.keys) {
    if (db.keys[k].hwids.includes(req.body.hwid)) {
      db.keys[k].expiresAt += Number(req.body.minutes) * 60000;
      writeDB(db);
      return res.json({ ok: true });
    }
  }
  res.json({ ok: false });
}
