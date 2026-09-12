import { getToken } from "../utils/getToken.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "Segredo_Mais_Segredo_Dos_Jogos_Internos";

export const verifyToken = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ msg: "Token de acesso não fornecido." });
    }

    const token = getToken(req);
    if (!token) {
  return res.status(401).json({ msg: "Header Authorization inválido. Use Bearer <token>." });
}

    let verified;

    try {
      verified = jwt.verify(token, JWT_SECRET);
    } catch (jwtError) {
      let message;

      if (jwtError.name === "TokenExpiredError") {
        message = "Token expirado. Por favor, faça login novamente.";
      } else if (jwtError.name === "JsonWebTokenError") {
        message = "Token inválido. O token não confere com a chave de validação, ou o token foi adulterado.";
      } else {
        message = "Erro ao validar token.";
      }
      return res.status(401).json({ msg: message });
    }

    req.usuario = verified;
    return next();
  } catch (error) {
    return res.status(401).json({ msg: "Token inválido." });
  }
};
