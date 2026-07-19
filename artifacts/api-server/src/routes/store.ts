import { Router } from "express";
import { db } from "@workspace/db";
import { storePackagesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/store/packages", async (req, res) => {
  const packages = await db.select().from(storePackagesTable);
  res.json(packages.map(p => ({
    ...p,
    features: JSON.parse(p.features),
  })));
});

router.get("/store/packages/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [pkg] = await db.select().from(storePackagesTable).where(eq(storePackagesTable.id, id));
  if (!pkg) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...pkg, features: JSON.parse(pkg.features) });
});

export default router;
