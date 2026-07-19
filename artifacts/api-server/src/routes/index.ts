import { Router, type IRouter } from "express";
import healthRouter from "./health";
import serverRouter from "./server";
import newsRouter from "./news";
import storeRouter from "./store";
import leaderboardRouter from "./leaderboard";
import staffRouter from "./staff";
import faqRouter from "./faq";
import banAppealsRouter from "./banAppeals";
import contactRouter from "./contact";
import votesRouter from "./votes";
import playersRouter from "./players";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(authRouter);
router.use(healthRouter);
router.use(serverRouter);
router.use(newsRouter);
router.use(storeRouter);
router.use(leaderboardRouter);
router.use(staffRouter);
router.use(faqRouter);
router.use(banAppealsRouter);
router.use(contactRouter);
router.use(votesRouter);
router.use(playersRouter);

export default router;
