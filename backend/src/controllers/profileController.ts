import type { Request, Response } from 'express';

import { profilePresenter } from '../presenters/profilePresenter';
import {
  deleteAccountService,
  getProfileService,
  updateProfileService,
} from '../services/profileService';

function getRequestUserId(req: Request) {
  return (req as any).user?.id as string | undefined;
}

export const profileController = {
  async show(req: Request, res: Response) {
    try {
      const userId = getRequestUserId(req);

      if (!userId) {
        return res.status(401).json({
          message: 'Usuário não autenticado',
        });
      }

      const profile = await getProfileService(userId);

      return res.json(profilePresenter(profile));
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : 'Erro ao buscar perfil',
      });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const userId = getRequestUserId(req);

      if (!userId) {
        return res.status(401).json({
          message: 'Usuário não autenticado',
        });
      }

      const profile = await updateProfileService(userId, req.body);

      return res.json(profilePresenter(profile));
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : 'Erro ao atualizar perfil',
      });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const userId = getRequestUserId(req);

      if (!userId) {
        return res.status(401).json({
          message: 'Usuário não autenticado',
        });
      }

      await deleteAccountService(userId);

      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : 'Erro ao excluir conta',
      });
    }
  },
};
