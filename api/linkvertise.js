import { redis } from "./_redis.js";

export default async function handler(req, res) {
  const { session } = req.query;

  if (!session) {
    return res.redirect("/");
  }

  await redis.set(`progress:${session}`, "1", { ex: 600 });
  return res.redirect(`/?session=${session}`);
}
