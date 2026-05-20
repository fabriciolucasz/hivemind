import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'changeme';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {

    res.status(401).json({
      message: 'Token não informado',
    });

    return;
  }

  const [, token] = authHeader.split(' ');

  try {

    jwt.verify(token, JWT_SECRET);

    next();

  } catch {

    res.status(401).json({
      message: 'Token inválido',
    });

  }
}