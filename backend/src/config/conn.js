import Sequelize from "sequelize";
import dotenv from "dotenv";
dotenv.config()

const databaseUrl = process.env.DATABASE_URL || "postgres://localhost:5432/projeto_jes";

export const conn = new Sequelize(databaseUrl, {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false
})

export async function testarConexao() {
  try {
    await conn.authenticate();
    console.log('Conexão com o Supabase via Sequelize estabelecida com sucesso!');
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
  }
}