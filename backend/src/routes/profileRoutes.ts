import { Router } from 'express';

import { profileController } from '../controllers/profileController';
import { authMiddleware } from '../middlewares/authMiddleware';

const profileRoutes = Router();

profileRoutes.get('/profile', authMiddleware, profileController.show);
profileRoutes.put('/profile', authMiddleware, profileController.update);
profileRoutes.delete('/profile', authMiddleware, profileController.delete);

export default profileRoutes;
