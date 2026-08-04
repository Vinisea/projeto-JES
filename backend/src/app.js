import express from "express";
import cors from "cors";
import routes from "./routes/index.js"

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


app.use("/api", routes);


app.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
});

export default app;