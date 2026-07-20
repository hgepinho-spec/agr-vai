import { Router } from "express";
import { db } from "@workspace/db";
import { leaderboardTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { getPlayerCache } from "../lib/playerCache";

const router = Router();

const locations = ["Elektrozavodsk", "Chernogorsk", "Solnichniy", "Berezino", "Novaya Petrovka", "Severograd", "Tisy", "Vybor", "Zelenogorsk", "Gorka"];

router.get("/players/online", (_req, res) => {
  const { players, age } = getPlayerCache();

  // Cache fresco (menos de 2 min) e tem jogadores reais
  if (players.length > 0 && age < 120_000) {
    return res.json(
      players.map((p) => ({
        name: p.name,
        playtime: Math.round(p.playtime / 60), // segundos → minutos
        location: locations[Math.floor(Math.random() * locations.length)],
        avatarUrl: null,
      }))
    );
  }

  // Sem cache real: retorna lista vazia (servidor offline ou sem dados)
  return res.json([]);
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
