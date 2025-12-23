import { redis } from "./_redis.js";

export default async function handler(req, res) {
  try {
    const { session, step } = req.query;

    // ❌ Missing params → ignore
    if (!session || !step) {
      return res.redirect("/");
    }

    // Read current progress
    const current = await redis.get(`progress:${session}`) || "0";

    // 🔒 STEP ORDER ENFORCEMENT
    if (step === "2" && current !== "1") {
      return res.redirect("/");
    }

    if (step === "1" && current !== "0") {
      return res.redirect("/");
    }

    // Save progress (expires in 10 minutes)
    await redis.set(`progress:${session}`, step, { ex: 600 });

    // Return user to site
    return res.redirect(`/?session=${session}`);
  } catch (err) {
    console.error("Linkvertise error:", err);
    return res.redirect("/");
  }
}
