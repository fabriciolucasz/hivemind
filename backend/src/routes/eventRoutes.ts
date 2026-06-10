import { Router } from 'express';

import {
  createEventController,
  deleteEventController,
  getEventsController,
  updateEventController,
} from '../controllers/eventController';

import { authMiddleware } from '../middlewares/authMiddleware';

const eventRoutes = Router();

eventRoutes.use(authMiddleware);

eventRoutes.post('/', createEventController);
eventRoutes.get('/', getEventsController);
eventRoutes.put('/:id', updateEventController);
eventRoutes.delete('/:id', deleteEventController);

export { eventRoutes };
