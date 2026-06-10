import type { Request, Response } from 'express';

import {
  createEventService,
  deleteEventService,
  getEventsService,
  updateEventService,
} from '../services/eventService';

export async function createEventController(req: Request, res: Response) {
  try {
    req.body.userId = (req as any).user.id;
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
    const userId = (req as any).user.id;
    const events = await getEventsService(userId);

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
    const userId = (req as any).user.id;
    const event = await updateEventService(id, userId, req.body);

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
    const userId = (req as any).user.id;

    await deleteEventService(id, userId);

    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : 'Erro ao deletar evento',
    });
  }
}
