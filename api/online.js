let players = {};

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const now = Date.now();
  Object.keys(players).forEach(uuid => {
    if (now - players[uuid].lastSeen > 35000) {
      delete players[uuid];
    }
  });

  try {
    if (req.method === "POST") {
      const { uuid, username, cape, badge } = req.body;
      if (!uuid) return res.status(400).json({ error: "uuid required" });

      players[uuid] = {
        uuid,
        username: username || "Unknown",
        cape: cape || "NONE",
        badge: badge || "DEFAULT",
        joined: players[uuid] ? players[uuid].joined : now,
        lastSeen: now
      };

      return res.status(200).json({ ok: true });
    }

    if (req.method === "GET") {
      Object.keys(players).forEach(uuid => {
        if (now - players[uuid].lastSeen > 35000) {
          delete players[uuid];
        }
      });

      const list = Object.values(players);
      return res.status(200).json({ players: list });
    }

    if (req.method === "DELETE") {
      const { uuid } = req.body;
      if (!uuid) return res.status(400).json({ error: "uuid required" });
      delete players[uuid];
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
