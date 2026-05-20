import { Request, Response } from 'express';

import {
  loginService,
  registerService,
} from '../services/authService';

export async function register(
  req: Request,
  res: Response,
) {

  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        message: 'Preencha todos os campos',
      });

      return;
    }

    const result = await registerService({
      name,
      email,
      password,
    });

    res.status(201).json(result);

  } catch (error: any) {

    res.status(400).json({
      message: error.message,
    });

  }
}

export async function login(
  req: Request,
  res: Response,
) {

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: 'Preencha todos os campos',
      });

      return;
    }

    const result = await loginService({
      email,
      password,
    });

    res.status(200).json(result);

  } catch (error: any) {

    res.status(401).json({
      message: error.message,
    });

  }
}