import { Request, Response } from 'express';
import { prisma } from '../database/prisma';

export const dashboardController = {
  
  async getStats(req: Request, res: Response) {
    try {
      const userId = req.params.userId as string;

      const profile = await prisma.profile.findUnique({
        where: { userId },
        include: {
          _count: {
            select: {
              dailyLogs: true,
              academicRecords: true,
              vocationalTests: true,
            },
          },
          events: {
            take: 3, 
            orderBy: {
              date: 'asc', 
            },
          },
        },
      });

      if (!profile) {
         res.status(404).json({ message: 'Perfil não encontrado' });
         return;
      }

      res.json({
        diaryCount: profile._count.dailyLogs,
        vocationalCompleted: profile._count.vocationalTests > 0,
        performanceCount: profile._count.academicRecords,
        reminderActive: profile.reminderActive,
        reminderTime: profile.reminderTime || '18:00',
        upcomingEvents: profile.events,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  async updateReminder(req: Request, res: Response) {
    try {
      const userId = req.params.userId as string;
      const { reminderActive, reminderTime } = req.body;

      await prisma.profile.update({
        where: { userId },
        data: {
          reminderActive,
          reminderTime,
        },
      });

      res.json({ message: 'Lembrete atualizado com sucesso' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};