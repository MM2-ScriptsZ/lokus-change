import { readDB } from "./_db.js";

export default function handler(req, res) {
  const { session } = req.query;
  const db = readDB();
  res.json({ step: db.linkvertise[session] || 0 });
}
