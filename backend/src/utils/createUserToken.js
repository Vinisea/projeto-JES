import jwt from "jsonwebtoken"
import { errorHandler } from "./errorHandler.js"

const JWT_SECRET = process.env.JWT_SECRET || "Segredo_Mais_Segredo_Dos_Jogos_Internos";

export const createUserToken = async (usuario, request, response) => {
    try {
        const token = jwt.sign(
            {
                id: usuario.id_usuario,
                email: usuario.email,
                idade: usuario.idade,
            },
            JWT_SECRET,
            {
                expiresIn: '8h'
            }
        )

        response.status(200).json({
            success: true,
            statusCode: 200,
            message: "Você está autenticado",
            token: token,
            usuarioId: usuario.id_usuario
        })
    } catch (error) {
        await errorHandler(error, response)
    }
}