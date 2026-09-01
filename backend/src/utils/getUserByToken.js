import jwt from "jsonwebtoken";
import { usuario } from "../models/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "Segredo_Mais_Segredo_Dos_Jogos_Internos";

export const getUserByToken = async (token) => {
  if (!token) {
    console.log("❌ Diagnóstico: Token não chegou na função.");
    return null;
  }

  try {
    // 1. Tenta decodificar
    const decoded = jwt.verify(token, JWT_SECRET);
    // 2. Extrai o ID do payload
    const idUsuario = decoded.id || decoded.id_usuario;
    // 3. Busca no banco de dados
    const usuarioEncontrado = await usuario.findByPk(idUsuario);

    return usuarioEncontrado;
  } catch (error) {
    console.error("❌ Diagnóstico - Erro ao verificar JWT:");
    return null;
  }
};