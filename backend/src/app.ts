import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes';
import dailyLogRoutes from './routes/dailyLogRoutes';
import { eventRoutes } from './routes/eventRoutes';
import vocationalTestRoutes from './routes/vocationalTestRoutes';
import recommendationRoutes from './routes/recommendationRoutes';
import academicRecordRoutes from './routes/academicRecordRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api', dailyLogRoutes);
app.use('/api', vocationalTestRoutes);
app.use('/api', recommendationRoutes);
app.use('/api', academicRecordRoutes);
app.use('/events', eventRoutes);

app.get('/', (req: Request, res: Response) => {
  return res.json({
    message: 'API HiveMind funcionando perfeitamente em TypeScript!',
  });
});

app.get('/api/teste', (req: Request, res: Response) => {
  return res.json({
    mensagem: 'Backend do Diario funcionando!',
  });
});

export { app };
