// api/admin-login.js

export default async function handler(req, res) {
  try {
    let body = "";

    // Collect body data
    for await (const chunk of req) {
      body += chunk;
    }

    const data = JSON.parse(body || "{}");
    const secret = data.secret;

    if (!secret) {
      return res.status(400).json({ ok: false, error: "missing_secret" });
    }

    if (secret !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ ok: false });
    }

    // Create a simple session token
    const session = Math.random().toString(36).slice(2);

    return res.status(200).json({
      ok: true,
      session
    });

  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: "server_error"
    });
  }
}
