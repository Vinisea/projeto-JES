import jwt from "jsonwebtoken";
import { usuario } from "../models/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "Segredo_Mais_Segredo_Dos_Jogos_Internos";

export const getUserByToken = async (token) => {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const idUsuario = decoded.id || decoded.id_usuario;
    return usuario.findByPk(idUsuario);
  } catch (error) {
    return null;
  }
};