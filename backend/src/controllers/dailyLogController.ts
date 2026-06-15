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
      const userId = (req as any).user.id;
      const dailyLogs = await listDailyLogsService(userId);
      res.json(dailyLogs.map(dailyLogPresenter));
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { text, tags, emoji, date, time } = req.body;
      const userId = (req as any).user.id;
      const dailyLog = await createDailyLogService({ text, tags, emoji, date, time, userId });
      res.status(201).json(dailyLogPresenter(dailyLog));
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const userId = (req as any).user.id;
      await deleteDailyLogService(id, userId);
      res.status(204).send(); 
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
};