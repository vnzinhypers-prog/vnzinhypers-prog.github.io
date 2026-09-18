const { kv } = require("@vercel/kv");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const TTL = 30;

  try {
    if (req.method === "POST") {
      const { uuid, username, cape, badge } = req.body;
      if (!uuid) return res.status(400).json({ error: "uuid required" });

      await kv.set(`player:${uuid}`, {
        uuid,
        username: username || "Unknown",
        cape: cape || "NONE",
        badge: badge || "DEFAULT",
        joined: Date.now()
      }, { ex: TTL });

      return res.status(200).json({ ok: true });
    }

    if (req.method === "GET") {
      const keys = [];
      let cursor = 0;
      do {
        const result = await kv.scan(cursor, { match: "player:*", count: 100 });
        cursor = result.cursor;
        keys.push(...result.keys);
      } while (cursor !== 0);

      const players = [];
      for (const key of keys) {
        const player = await kv.get(key);
        if (player) players.push(player);
      }

      return res.status(200).json({ players });
    }

    if (req.method === "DELETE") {
      const { uuid } = req.body;
      if (!uuid) return res.status(400).json({ error: "uuid required" });
      await kv.del(`player:${uuid}`);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
