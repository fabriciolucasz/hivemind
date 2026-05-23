import { prisma } from '../database/prisma';

interface CriarRelatoRequest {
  texto: string;
  tags: string[];
  emoji: string;
  data: string;
  hora: string;
  userId: string;
}

export async function criarRelatoService({
  texto,
  tags,
  emoji,
  data,
  hora,
  userId,
}: CriarRelatoRequest) {

  const relato = await prisma.relato.create({
    data: {
      texto,
      tags,
      emoji,
      data,
      hora,
      userId,
    },
  });

  return relato;
}

export async function listarRelatosService(
  userId: string
) {

  const relatos = await prisma.relato.findMany({
    where: {
      userId,
    },

    orderBy: {
      createdAt: 'desc',
    },
  });

  return relatos;
}