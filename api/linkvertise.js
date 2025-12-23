import { readDB, writeDB } from "./_db.js";

export default function handler(req, res) {
  const { session, step, start } = req.query;
  if (!session || !step || !start) return res.status(400).end();

  if (Date.now() - Number(start) < 8000)
    return res.status(403).send("Bypass");

  const db = readDB();
  db.linkvertise[session] = Math.max(
    db.linkvertise[session] || 0,
    Number(step)
  );

  writeDB(db);
  res.redirect(`/?session=${session}`);
}
