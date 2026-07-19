import { Router } from "express";
import { db } from "@workspace/db";
import { votesTable } from "@workspace/db";
import { count, gte } from "drizzle-orm";
import { sql } from "drizzle-orm";

const router = Router();

router.get("/votes", async (req, res) => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());

  const [total] = await db.select({ count: count() }).from(votesTable);
  const [monthly] = await db.select({ count: count() }).from(votesTable).where(gte(votesTable.createdAt, monthStart));
  const [weekly] = await db.select({ count: count() }).from(votesTable).where(gte(votesTable.createdAt, weekStart));

  res.json({
    totalVotes: total.count,
    monthlyVotes: monthly.count,
    weeklyVotes: weekly.count,
  });
});

router.post("/votes", async (req, res): Promise<void> => {
  const { playerName } = req.body;
  if (!playerName) { res.status(400).json({ error: "playerName is required" }); return; }
  await db.insert(votesTable).values({ playerName });

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());

  const [total] = await db.select({ count: count() }).from(votesTable);
  const [monthly] = await db.select({ count: count() }).from(votesTable).where(gte(votesTable.createdAt, monthStart));
  const [weekly] = await db.select({ count: count() }).from(votesTable).where(gte(votesTable.createdAt, weekStart));

  res.status(201).json({
    totalVotes: total.count,
    monthlyVotes: monthly.count,
    weeklyVotes: weekly.count,
  });
});

export default router;
