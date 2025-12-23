import crypto from "crypto";
import { readDB, writeDB } from "./_db.js";

export default function handler(req, res) {
  if (req.body?.secret !== process.env.ADMIN_SECRET)
    return res.json({ ok: false });

  const db = readDB();
  const session = crypto.randomBytes(16).toString("hex");
  db.adminSessions[session] = Date.now() + 1800000;

  writeDB(db);
  res.json({ ok: true, session });
}
