import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import { eventRoutes } from "./routes/eventRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/events", eventRoutes);

app.get("/", (req, res) => {
  return res.json({
    message: "API funcionando",
  });
});

export { app };
