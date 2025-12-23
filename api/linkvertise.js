import { redis } from "./_redis.js";

export default async function handler(req, res) {
  try {
    const { session, step, hash } = req.query;

    // Hash-only redirect from Linkvertise
    if (hash && (!session || !step)) {
      return res.redirect("/");
    }

    // Invalid call
    if (!session || !step) {
      return res.status(400).send("Invalid Linkvertise callback");
    }

    await redis.set(`progress:${session}`, String(step), { ex: 600 });

    return res.redirect(`/?session=${session}`);
  } catch (err) {
    console.error("Linkvertise error:", err);
    return res.status(500).send("Server error");
  }
}
