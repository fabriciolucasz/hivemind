import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';
import type { TokenPayload } from '../types/auth';

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

    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    (req as any).user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();

  } catch {

    res.status(401).json({
      message: 'Token inválido',
    });

  }
}
