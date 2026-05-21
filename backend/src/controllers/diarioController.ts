import { Request, Response } from 'express';
import { bancoDeDadosRelatos, Relato } from '../models/diarioModel';

export const diarioController = {
  // Puxa as informações (GET)
  listarTodos: (req: Request, res: Response) => {
    res.json(bancoDeDadosRelatos);
  },

  // Salvar (POST)
  criarNovo: (req: Request, res: Response) => {
    const { texto, tags, emoji, data, hora } = req.body;

    const novoRelato: Relato = {
      id: Date.now(),
      data,
      hora,
      texto,
      tags: tags || ["Geral"],
      emoji: emoji || "📝"
    };

    bancoDeDadosRelatos.push(novoRelato);
    
    res.status(201).json(novoRelato);
  }
};