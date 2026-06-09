import type { Request, Response } from 'express';

import {
  createEventService,
  deleteEventService,
  getEventsService,
  updateEventService,
} from '../services/eventService';

export async function createEventController(req: Request, res: Response) {
  try {
    const event = await createEventService(req.body);

    return res.status(201).json(event);
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : 'Erro ao criar evento',
    });
  }
}

export async function getEventsController(req: Request, res: Response) {
  try {
    const { userId } = req.query;
    const events = await getEventsService(userId as string);

    return res.json(events);
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : 'Erro ao buscar eventos',
    });
  }
}

export async function updateEventController(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const { userId } = req.query;
    const event = await updateEventService(id, userId as string, req.body);

    return res.json(event);
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : 'Erro ao atualizar evento',
    });
  }
}

export async function deleteEventController(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const { userId } = req.query;

    await deleteEventService(id, userId as string);

    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : 'Erro ao deletar evento',
    });
  }
}
