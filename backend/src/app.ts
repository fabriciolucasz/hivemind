import express, { Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import dailyLogRoutes from "./routes/dailyLogRoutes";
import { eventRoutes } from "./routes/eventRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes); 
app.use("/api", dailyLogRoutes); 

app.get("/", (req: Request, res: Response) => {
  return res.json({
    message: "API HiveMind funcionando perfeitamente em TypeScript! 🚀",
  });
});
app.use("/auth", authRoutes);
app.use("/events", eventRoutes);

app.get("/api/teste", (req: Request, res: Response) => {
  return res.json({
    mensagem: "Backend do Diário funcionando! 🚀"
  });
});

export { app };
