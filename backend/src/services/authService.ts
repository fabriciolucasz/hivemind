import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../database/prisma';
import type { LoginRequest, RegisterRequest, TokenPayload } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET ?? 'changeme';
const JWT_EXPIRES_IN = '7d';

export async function registerService({ name, email, password }: RegisterRequest) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error('Email já cadastrado');
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  });

  const token = generateToken({ id: user.id, email: user.email });

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email },
  };
}

export async function loginService({ email, password }: LoginRequest) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Email ou senha incorretos');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error('Email ou senha incorretos');
  }

  const token = generateToken({ id: user.id, email: user.email });

  return {
  token,
  user,
};
}

function generateToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}