import { redis } from "./_redis.js";

export default async function handler(req, res) {
  try {
    const { session, step, hash } = req.query;

    // Case 1: Linkvertise hash-only redirect (NO progress)
    if (hash && (!session || !step)) {
      return res.redirect("/");
    }

    // Case 2: Missing required params
    if (!session || !step) {
      return res.status(400).send("Invalid Linkvertise callback");
    }

    // Case 3: Valid checkpoint
    await redis.set(`progress:${session}`, String(step), { ex: 600 });

    return res.redirect(`/?session=${session}`);
  } catch (err) {
    console.error("Linkvertise error:", err);
    return res.status(500).send("Server error");
  }
}
