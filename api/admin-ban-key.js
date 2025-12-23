import { readDB, writeDB } from "./_db.js";

export default function handler(req, res) {
  const db = readDB();
  db.keys[req.body.key].banned = !db.keys[req.body.key].banned;
  writeDB(db);
  res.json({ ok: true });
}
