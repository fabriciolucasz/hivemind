import { Router } from 'express';
import { vocationalTestController } from '../controllers/vocationalTestController';
import { authMiddleware } from '../middlewares/authMiddleware';

const vocationalTestRoutes = Router();

vocationalTestRoutes.use(authMiddleware);

vocationalTestRoutes.get('/vocational-tests', vocationalTestController.listAll);
vocationalTestRoutes.post('/vocational-tests', vocationalTestController.create);
vocationalTestRoutes.delete('/vocational-tests/:id', vocationalTestController.delete);

export default vocationalTestRoutes;
