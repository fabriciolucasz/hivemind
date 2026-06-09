import { Router } from "express";
import { dailyLogController } from "../controllers/dailyLogController";

const router = Router();

router.get(
  "/daily-logs/:userId",
  dailyLogController.listAll
);

router.post("/daily-logs", dailyLogController.create);

router.delete("/daily-logs/:id", dailyLogController.delete);

export default router;
