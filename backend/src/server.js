import "./models/index.js";
import app from "./app.js";
import { conn } from "./config/conn.js";
import dotenv from "dotenv"
// import { criarAdminInicial } from "./seeds/seedAdmin.js"; <- para popular o banco com o usuario adm

dotenv.config()
const PORT = process.env.PORT;

const iniciarServidor = async () => {
  try {
    // await conn.sync({ force: true });
    await conn.sync();

    // await criarAdminInicial(); <- para popular o banco com o usuario adm
    app.listen(PORT, () => {
      console.log(`Servidor rodando em: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Erro ao iniciar o servidor: ", error.message);
  }
};

await iniciarServidor();
