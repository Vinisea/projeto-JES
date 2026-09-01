import { getToken } from "../utils/getToken.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "Segredo_Mais_Segredo_Dos_Jogos_Internos";

export const verifyToken = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ msg: "Token de acesso não fornecido" });
    }

    const token = await getToken(req);
    if (!token) {
      return res
        .status(401)
        .json({ msg: "Verifique se o token está presente" });
    }

    let verified;

    try {
      verified = jwt.verify(token, JWT_SECRET);
    } catch (jwtError) {
      let message;

      if (jwtError.name === "TokenExpiredError") {
        message = "Token expirado. Por favor, faça login novamente.";
      } else if (jwtError.name === "JsonWebTokenError") {
        message = "Token Inválido. O token não confere com a chave de validação, ou o token foi adulterado.";
      } else {
        message = "Erro ao validar token";
      }
      return response.status(401).json({ message });
    }
    req.usuario = verified;
    next();
  } catch (error) {}
};
