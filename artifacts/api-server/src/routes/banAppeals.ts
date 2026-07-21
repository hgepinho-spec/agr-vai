import { Router } from "express";
import { db } from "@workspace/db";
import { banAppealsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { sendMail } from "../mailer.js";

const router = Router();

router.get("/ban-appeals", async (req, res) => {
  const appeals = await db.select().from(banAppealsTable).orderBy(desc(banAppealsTable.createdAt));
  res.json(appeals.map(a => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt?.toISOString() ?? null,
  })));
});

router.get("/ban-appeals/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [appeal] = await db.select().from(banAppealsTable).where(eq(banAppealsTable.id, id));
  if (!appeal) { res.status(404).json({ error: "Not found" }); return; }
  res.json({
    ...appeal,
    createdAt: appeal.createdAt.toISOString(),
    updatedAt: appeal.updatedAt?.toISOString() ?? null,
  });
});

router.post("/ban-appeals", async (req, res): Promise<void> => {
  const { playerName, steamId, reason, description, discordTag, proofUrl } = req.body;
  if (!playerName || !steamId || !reason || !description || !discordTag) {
    res.status(400).json({ error: "Missing required fields" }); return;
  }
  const [appeal] = await db.insert(banAppealsTable).values({
    playerName, steamId, reason, description, discordTag, proofUrl,
  }).returning();

  sendMail({
    subject: `[Recurso de Ban] ${playerName} — ${steamId}`,
    html: `
      <h2>Novo recurso de ban recebido</h2>
      <p><strong>Jogador:</strong> ${playerName}</p>
      <p><strong>Steam ID:</strong> ${steamId}</p>
      <p><strong>Discord:</strong> ${discordTag}</p>
      <p><strong>Motivo do ban:</strong> ${reason}</p>
      ${proofUrl ? `<p><strong>Prova:</strong> <a href="${proofUrl}">${proofUrl}</a></p>` : ""}
      <hr/>
      <h3>Descrição</h3>
      <p>${description.replace(/\n/g, "<br/>")}</p>
    `,
  });

  res.status(201).json({
    ...appeal,
    createdAt: appeal.createdAt.toISOString(),
    updatedAt: appeal.updatedAt?.toISOString() ?? null,
  });
});

router.patch("/ban-appeals/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { status, adminNote } = req.body;
  const [appeal] = await db
    .update(banAppealsTable)
    .set({ status, adminNote, updatedAt: new Date() })
    .where(eq(banAppealsTable.id, id))
    .returning();
  if (!appeal) { res.status(404).json({ error: "Not found" }); return; }
  res.json({
    ...appeal,
    createdAt: appeal.createdAt.toISOString(),
    updatedAt: appeal.updatedAt?.toISOString() ?? null,
  });
});

export default router;
