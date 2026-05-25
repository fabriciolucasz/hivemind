import { Request, Response } from 'express';
import { loginService, registerService } from '../services/authService';
import crypto from "crypto";
import bcrypt from "bcrypt";
import { prisma } from "../database/prisma";
import { transporter } from "../services/mailServices";

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Preencha todos os campos' });
      return;
    }

    const result = await registerService({ name, email, password });
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Preencha todos os campos' });
      return;
    }

    const result = await loginService({ email, password });
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
}
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "Usuário não encontrado",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    const expires = new Date(Date.now() + 1000 * 60 * 15);

    await prisma.user.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpiresAt: expires,
      },
    });

    const link = `http://localhost:5173/reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Recuperação de senha",
      html: `
        <h2>Recuperação de senha</h2>
        <p>Clique no link abaixo:</p>
        <a href="${link}">${link}</a>
      `,
    });

    return res.json({
      message: "Email enviado",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Erro interno",
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Token inválido",
      });
    }

    if (
      !user.resetTokenExpiresAt ||
      user.resetTokenExpiresAt < new Date()
    ) {
      return res.status(400).json({
        message: "Token expirado",
      });
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

    return res.json({
      message: "Senha alterada com sucesso",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Erro interno",
    });
  }
};