import { redis } from "./_redis.js";

export default async function handler(req, res) {
  try {
    const { session, step, hash } = req.query;

    // CASE 1: Linkvertise hash-only redirect
    if (hash && !session) {
      // Just send user back safely
      return res.redirect("/");
    }

    // CASE 2: Proper checkpoint redirect
    if (!session || !step) {
      return res.status(400).send("Invalid checkpoint callback");
    }

    // Save progress
    await redis.set(`progress:${session}`, step, { ex: 600 });

    // Redirect user back to homepage with session
    return res.redirect(`/?session=${session}`);

  } catch (err) {
    return res.status(500).send("Server error");
  }
}
