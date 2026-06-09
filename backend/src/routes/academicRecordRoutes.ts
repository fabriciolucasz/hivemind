import { Router } from 'express';
import { academicRecordController } from '../controllers/academicRecordController';

const academicRecordRoutes = Router();

academicRecordRoutes.get(
  '/academic-records/:userId',
  academicRecordController.listAll
);

academicRecordRoutes.post(
  '/academic-records',
  academicRecordController.create
);

academicRecordRoutes.put(
  '/academic-records/:id',
  academicRecordController.update
);

academicRecordRoutes.delete(
  '/academic-records/:id',
  academicRecordController.delete
);

export default academicRecordRoutes;
