import { Router } from 'express';
import { diarioController } from '../controllers/diarioController';

const router = Router();

// Rota para buscar as informações (GET)
router.get('/relatos', diarioController.listarTodos);

// Rota para salvar uma nova informação (POST)
router.post('/relatos', diarioController.criarNovo);

export default router;