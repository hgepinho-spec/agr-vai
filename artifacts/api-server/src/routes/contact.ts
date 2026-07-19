import { Router } from "express";
import { db } from "@workspace/db";
import { contactTable } from "@workspace/db";
import { sendMail } from "../mailer.js";

const router = Router();


router.post("/contact", async (req, res): Promise<void> => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    res.status(400).json({ error: "Missing required fields" }); return;
  }
  const [msg] = await db.insert(contactTable).values({ name, email, subject, message }).returning();

  sendMail({
    replyTo: email,
    subject: `[Contato] ${subject}`,
    html: `
      <h2>Nova mensagem de contato</h2>
      <p><strong>Nome:</strong> ${name}</p>
      <p><strong>E-mail:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Assunto:</strong> ${subject}</p>
      <hr/>
      <p>${message.replace(/\n/g, "<br/>")}</p>
    `,
  });

  res.status(201).json({ ...msg, createdAt: msg.createdAt.toISOString() });
});

export default router;
