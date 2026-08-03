import express from "express";
import cors from "cors";

//Rotas


const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

//Rotas quando estiverem definidas
// app.use();
// app.use();

app.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
});

export default app;