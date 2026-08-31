import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "Segredo_Mais_Segredo_Dos_Jogos_Internos";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({msg: "Token de acesso não fornecido"})
    };

    const partes = authHeader.split(" ");
    if (partes.length !== 2 || partes[0] !== "Bearer") {
        return res.status(401).json({msg: "Tipo de token inválido. Use Bearer TOKEN"})
    }

    const token = partes[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({msg: "Token expirado. Faça login novamente."})
            }
        return res.status(401).json({msg: "Token inválido."})
        }
    req.usuario = decoded;
    return next();
    })
}