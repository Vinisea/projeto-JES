import "./models/index.js"; //Quando adicionar os modelos vai pegar já
import express from "express";
import cors from "cors";

//Bancop de dados
import { conn } from "./config/conn.js";

//Rotas

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  }),
);

conn.sync();

app.use(express.json());

//Rotas quando estiverem definidas
app.use();
app.use();

export default app;