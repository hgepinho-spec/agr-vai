import { Router } from "express";
import { db } from "@workspace/db";
import { leaderboardTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router = Router();

router.get("/leaderboard", async (req, res): Promise<void> => {
  const category = (req.query.category as string) || "kills";
  const limit = parseInt((req.query.limit as string) || "25");

  const validCategories = ["kills", "survived", "playtime", "loot"];
  if (!validCategories.includes(category)) {
    res.status(400).json({ error: "Invalid category" }); return;
  }

  const colMap = {
    kills: leaderboardTable.kills,
    survived: leaderboardTable.survived,
    playtime: leaderboardTable.playtime,
    loot: leaderboardTable.loot,
  } as const;

  const col = colMap[category as keyof typeof colMap];

  const rows = await db
    .select()
    .from(leaderboardTable)
    .orderBy(desc(col))
    .limit(limit);

  const getValue = (r: typeof rows[0]): number => {
    if (category === "kills") return r.kills;
    if (category === "survived") return r.survived;
    if (category === "loot") return r.loot;
    return r.playtime;
  };

  res.json(rows.map((r, i) => ({
    rank: i + 1,
    playerName: r.playerName,
    value: getValue(r),
    category,
    playtime: r.playtime,
    lastSeen: r.lastSeen.toISOString(),
    avatarUrl: r.avatarUrl,
  })));
});

export default router;
