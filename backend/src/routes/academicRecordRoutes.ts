import { Router } from 'express';
import { academicRecordController } from '../controllers/academicRecordController';
import { authMiddleware } from '../middlewares/authMiddleware';

const academicRecordRoutes = Router();

academicRecordRoutes.use(authMiddleware);

academicRecordRoutes.get('/academic-records', academicRecordController.listAll);
academicRecordRoutes.post('/academic-records', academicRecordController.create);
academicRecordRoutes.put('/academic-records/:id', academicRecordController.update);
academicRecordRoutes.delete('/academic-records/:id', academicRecordController.delete);

export default academicRecordRoutes;
