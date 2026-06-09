import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  email: string;
}

const JWT_SECRET = process.env.JWT_SECRET ?? 'changeme';

export function generateToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  });
}