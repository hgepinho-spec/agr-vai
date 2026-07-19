import { Router } from "express";
import { db } from "@workspace/db";
import { staffTable } from "@workspace/db";

const router = Router();

const roleOrder = ["owner", "co_owner", "admin", "moderator", "helper", "developer"];

router.get("/staff", async (req, res) => {
  const staff = await db.select().from(staffTable);
  staff.sort((a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role));
  res.json(staff);
});

export default router;
