import { Router } from "express";
import { db } from "@workspace/db";
import { leaderboardTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

// Simulated online players list (in production this would query game server API)
const locations = ["Elektrozavodsk", "Chernogorsk", "Solnichniy", "Berezino", "Novaya Petrovka", "Severograd", "Tisy", "Vybor", "Zelenogorsk", "Gorka"];

router.get("/players/online", (req, res) => {
  const count = Math.floor(Math.random() * 30) + 10;
  const players = Array.from({ length: count }, (_, i) => ({
    name: `Survivor_${Math.floor(Math.random() * 9000) + 1000}`,
    playtime: Math.floor(Math.random() * 240),
    location: locations[Math.floor(Math.random() * locations.length)],
    avatarUrl: null,
  }));
  res.json(players);
});

router.get("/players/search", async (req, res): Promise<void> => {
  const name = req.query.name as string;
  if (!name) { res.status(400).json({ error: "name is required" }); return; }

  const [player] = await db.select().from(leaderboardTable).where(eq(leaderboardTable.playerName, name));
  if (!player) { res.status(404).json({ error: "Player not found" }); return; }

  const kdr = player.deaths > 0 ? +(player.kills / player.deaths).toFixed(2) : player.kills;
  res.json({
    name: player.playerName,
    kills: player.kills,
    deaths: player.deaths,
    playtime: player.playtime,
    lastSeen: player.lastSeen.toISOString(),
    joinedAt: player.lastSeen.toISOString(),
    kdr,
    rank: 1,
    avatarUrl: player.avatarUrl,
  });
});

export default router;
