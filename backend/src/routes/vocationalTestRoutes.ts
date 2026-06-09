import { Router } from 'express';
import { vocationalTestController } from '../controllers/vocationalTestController';

const vocationalTestRoutes = Router();

vocationalTestRoutes.get(
  '/vocational-tests/:userId',
  vocationalTestController.listAll
);

vocationalTestRoutes.post(
  '/vocational-tests',
  vocationalTestController.create
);

vocationalTestRoutes.delete(
  '/vocational-tests/:id',
  vocationalTestController.delete
);

export default vocationalTestRoutes;
