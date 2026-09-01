import http from "http";
import "./models/index.js";
import app from "./app.js";
import { conn } from "./config/conn.js";
import dotenv from "dotenv"
import { initSocket } from "./config/socket.js";
import { popularBancoInicial } from "./seeds/popularBanco.js";

dotenv.config()
const PORT = process.env.PORT || 3333;

const server = http.createServer(app);

initSocket(server);

const iniciarServidor = async () => {
  try {
    // await conn.sync({ force: true });
    await conn.sync();
    await popularBancoInicial();

    server.listen(PORT, () => {
      console.log(`Servidor rodando em: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Erro ao iniciar o servidor: ", error.message);
  }
};

await iniciarServidor();
