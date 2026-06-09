import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

import { prisma } from '../database/prisma';
import { transporter } from '../services/mailServices';
import {
  loginService,
  registerService,
} from '../services/authService';

export async function register(
  req: Request,
  res: Response,
) {

  try {

    const { name, email, password, age, interests } = req.body;

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
      age,
      interests,
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

export async function forgotPassword(
  req: Request,
  res: Response,
) {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        message: 'Informe o email',
      });

      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      res.json({
        message: 'Se o email existir, enviaremos as instruções de recuperação',
      });

      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 15);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const link = `${frontendUrl}/reset-password/${token}`;

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        resetToken: token,
        resetTokenExpiresAt: expires,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Recuperação de senha',
      html: `
        <h2>Recuperação de senha</h2>
        <p>Clique no link abaixo para criar uma nova senha:</p>
        <a href="${link}">${link}</a>
      `,
    });

    res.json({
      message: 'Se o email existir, enviaremos as instruções de recuperação',
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Erro interno',
    });
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
) {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      res.status(400).json({
        message: 'Token e senha são obrigatórios',
      });

      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
      },
    });

    if (!user) {
      res.status(400).json({
        message: 'Token inválido',
      });

      return;
    }

    if (
      !user.resetTokenExpiresAt ||
      user.resetTokenExpiresAt < new Date()
    ) {
      res.status(400).json({
        message: 'Token expirado',
      });

      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });

    res.json({
      message: 'Senha alterada com sucesso',
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Erro interno',
    });
  }
}
