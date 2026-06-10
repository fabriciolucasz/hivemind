import type { Request, Response } from 'express';

import {
  createAcademicRecordService,
  deleteAcademicRecordService,
  listAcademicRecordsService,
  updateAcademicRecordService,
} from '../services/academicRecordService';
import { academicRecordPresenter } from '../presenters/academicRecordPresenter';

export const academicRecordController = {
  async listAll(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const records = await listAcademicRecordsService(userId);

      return res.json(records.map(academicRecordPresenter));
    } catch (error) {
      console.error("ERRO ACADEMIC:", error);
      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : 'Erro ao buscar registros acadêmicos',
      });
    }
  },

  async create(req: Request, res: Response) {
    try {
      req.body.userId = (req as any).user.id;
      const record = await createAcademicRecordService(req.body);

      return res.status(201).json(academicRecordPresenter(record));
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : 'Erro ao criar registro acadêmico',
      });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const userId = (req as any).user.id;
      const record = await updateAcademicRecordService(id, userId, req.body);

      return res.json(academicRecordPresenter(record));
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : 'Erro ao atualizar registro acadêmico',
      });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const userId = (req as any).user.id;

      await deleteAcademicRecordService(id, userId);

      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : 'Erro ao excluir registro acadêmico',
      });
    }
  },
};
