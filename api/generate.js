import crypto from "crypto";
import { readDB, writeDB } from "./_db.js";

export default function handler(req, res) {
  const { session } = req.body || {};
  const db = readDB();

  if (db.linkvertise[session] !== 2)
    return res.status(403).json({ error: "tasks" });

  const key = crypto.randomBytes(20).toString("hex").toUpperCase();
  const expiresAt = Date.now() + 86400000;

  db.keys[key] = {
    hwids: [],
    banned: false,
    createdAt: Date.now(),
    expiresAt
  };

  writeDB(db);
  res.json({ key, expiresAt });
}
