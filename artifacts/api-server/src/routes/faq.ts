import { Router } from "express";
import { db } from "@workspace/db";
import { faqTable } from "@workspace/db";
import { asc } from "drizzle-orm";

const router = Router();

router.get("/faq", async (req, res) => {
  const items = await db.select().from(faqTable).orderBy(asc(faqTable.order));
  res.json(items);
});

export default router;
