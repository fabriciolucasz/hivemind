import { Request, Response } from 'express';

import {
  criarRelatoService,
  listarRelatosService,
} from '../services/diarioService';

import { diarioPresenter }
from '../presenters/diarioPresenter';

export const diarioController = {

  async listarTodos(
  req: Request,
  res: Response
) {

  try {

    const userId =
      req.params.userId as string;

    const relatos =
      await listarRelatosService(userId);

    res.json(
  relatos.map(diarioPresenter)
);

  } catch (error: any) {

    res.status(500).json({
      message: error.message,
    });

  }

},

  async criarNovo(
    req: Request,
    res: Response
  ) {

    try {

      const {
        texto,
        tags,
        emoji,
        data,
        hora,
        userId,
      } = req.body;

      const relato =
        await criarRelatoService({
          texto,
          tags,
          emoji,
          data,
          hora,
          userId,
        });

      res
        .status(201)
        .json(diarioPresenter(relato));

    } catch (error: any) {

      res.status(500).json({
        message: error.message,
      });

    }

  },

};