import Sequelize from "sequelize";
import dotenv from "dotenv";
dotenv.config()

export const conn = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOpitions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false
})

async function testarConexao() {
  try {
    await conn.authenticate();
    console.log('Conexão com o Supabase via Sequelize estabelecida com sucesso!');
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
  }
}

testarConexao();