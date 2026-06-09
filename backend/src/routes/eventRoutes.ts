import { Router } from 'express';

import {
  createEventController,
  deleteEventController,
  getEventsController,
  updateEventController,
} from '../controllers/eventController';

const eventRoutes = Router();

eventRoutes.post('/', createEventController);
eventRoutes.get('/', getEventsController);
eventRoutes.put('/:id', updateEventController);
eventRoutes.delete('/:id', deleteEventController);

export { eventRoutes };
