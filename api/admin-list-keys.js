import { readDB } from "./_db.js";

export default function handler(req, res) {
  const db = readDB();
  res.json({ keys: db.keys });
}
