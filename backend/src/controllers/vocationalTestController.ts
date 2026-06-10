import type { Request, Response } from 'express';

import {
  createVocationalTestService,
  deleteVocationalTestService,
  listVocationalTestsService,
} from '../services/vocationalTestService';
import { vocationalTestPresenter } from '../presenters/vocationalTestPresenter';

export const vocationalTestController = {
  async listAll(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const tests = await listVocationalTestsService(userId);

      return res.json(tests.map(vocationalTestPresenter));
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : 'Erro ao buscar testes vocacionais',
      });
    }
  },

  async create(req: Request, res: Response) {
    try {
      req.body.userId = (req as any).user.id;
      const test = await createVocationalTestService(req.body);

      return res.status(201).json(vocationalTestPresenter(test));
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : 'Erro ao criar teste vocacional',
      });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const userId = (req as any).user.id;

      await deleteVocationalTestService(id, userId);

      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : 'Erro ao excluir teste vocacional',
      });
    }
  },
};
