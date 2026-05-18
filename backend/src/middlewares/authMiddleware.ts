import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { TokenPayload } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET ?? 'changeme';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token não fornecido' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
    (req as any).user = payload;
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido ou expirado' });
  }
}