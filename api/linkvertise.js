import { redis } from "./_redis.js";

export default async function handler(req, res) {
  const { session } = req.query;

  // If Linkvertise sends only hash → ignore
  if (!session) {
    return res.redirect("/");
  }

  // SAVE PROGRESS
  await redis.set(`progress:${session}`, "1", { ex: 600 });

  return res.redirect(`/?session=${session}`);
}
