import { Router } from "express";
import { dashboardController } from "../controllers/dashboardController";

const router = Router();

router.get("/:userId", dashboardController.getStats);
router.put("/:userId/reminder", dashboardController.updateReminder);

export default router;