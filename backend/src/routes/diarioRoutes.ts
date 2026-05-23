import { Router } from "express";
import { diarioController } from "../controllers/diarioController";

const router = Router();

router.get(
  "/relatos/:userId",
  diarioController.listarTodos
);

router.post("/relatos", diarioController.criarNovo);

export default router;