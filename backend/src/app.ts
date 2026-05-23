import express, { Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import diarioRoutes from "./routes/diarioRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes); 
app.use("/api", diarioRoutes); 

app.get("/", (req: Request, res: Response) => {
  return res.json({
    message: "API HiveMind funcionando perfeitamente em TypeScript! 🚀",
  });
});

app.get("/api/teste", (req: Request, res: Response) => {
  return res.json({
    mensagem: "Backend do Diário funcionando! 🚀"
  });
});

export { app };