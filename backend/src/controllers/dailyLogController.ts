import { Request, Response } from 'express';

import {
  createDailyLogService,
  listDailyLogsService,
  deleteDailyLogService,
} from '../services/dailyLogService';

import { dailyLogPresenter } from '../presenters/dailyLogPresenter';

export const dailyLogController = {
  async listAll(req: Request, res: Response) {
    try {
      const userId = req.params.userId as string;
      const dailyLogs = await listDailyLogsService(userId);
      res.json(dailyLogs.map(dailyLogPresenter));
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { text, tags, emoji, date, time, userId } = req.body;
      const dailyLog = await createDailyLogService({ text, tags, emoji, date, time, userId });
      res.status(201).json(dailyLogPresenter(dailyLog));
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // FUNÇÃO DE EXCLUSÃO
  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      await deleteDailyLogService(id);
      res.status(204).send(); // 204 significa "Sucesso e sem conteúdo para retornar"
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
};