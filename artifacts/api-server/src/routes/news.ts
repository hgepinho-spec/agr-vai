import { Router } from "express";
import { db } from "@workspace/db";
import { newsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/news", async (req, res) => {
  const news = await db.select().from(newsTable).orderBy(desc(newsTable.pinned), desc(newsTable.createdAt));
  res.json(news.map(n => ({
    ...n,
    createdAt: n.createdAt.toISOString(),
  })));
});

router.get("/news/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [article] = await db.select().from(newsTable).where(eq(newsTable.id, id));
  if (!article) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...article, createdAt: article.createdAt.toISOString() });
});

router.post("/news", async (req, res): Promise<void> => {
  const { title, content, category, author, imageUrl, pinned } = req.body;
  if (!title || !content || !category || !author) {
    res.status(400).json({ error: "Missing required fields" }); return;
  }
  const [article] = await db.insert(newsTable).values({ title, content, category, author, imageUrl, pinned: pinned ?? false }).returning();
  res.status(201).json({ ...article, createdAt: article.createdAt.toISOString() });
});

export default router;
