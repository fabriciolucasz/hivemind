import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { prisma } from '../database/prisma';

import type {
  LoginRequest,
  RegisterRequest,
  TokenPayload,
} from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export async function registerService({
  name,
  email,
  password,
  age,
  interests,
}: RegisterRequest) {

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error('Email já cadastrado');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const interestsArray = interests
    ? interests
        .split(',')
        .map((i: string) => i.trim())
        .filter((i: string) => i.length > 0)
    : [];

  const parsedAge = age ? Number(age) : null;

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      profile: {
        create: {
          age: parsedAge,
          interests: interestsArray,
        },
      },
    },
  });

  console.log(user);

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}

export async function loginService({
  email,
  password,
}: LoginRequest) {

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error('Email ou senha inválidos');
  }

  const passwordMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatch) {
    throw new Error('Email ou senha inválidos');
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}