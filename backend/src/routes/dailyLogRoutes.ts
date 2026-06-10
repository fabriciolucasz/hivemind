import { Router } from "express";
import { dailyLogController } from "../controllers/dailyLogController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/daily-logs", dailyLogController.listAll);
router.post("/daily-logs", dailyLogController.create);
router.delete("/daily-logs/:id", dailyLogController.delete);

export default router;
