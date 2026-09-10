import { getToken } from "../utils/getToken.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "Segredo_Mais_Segredo_Dos_Jogos_Internos";

export const verifyToken = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({ msg: "Token de acesso não fornecido." });
  }

  const token = getToken(req);
  if (!token) {
    return res.status(401).json({ msg: "Header Authorization inválido. Use Bearer <token>." });
  }

  try {
    req.usuario = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token expirado. Faça login novamente." });
    }

    if (error.name === "JsonWebTokenError" || error.name === "NotBeforeError") {
      return res.status(401).json({ msg: "Token inválido." });
    }

    return next(error);
  }
};
