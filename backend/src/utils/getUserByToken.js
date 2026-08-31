import jwt from "jsonwebtoken"
import { usuario } from "../models/index.js"

const JWT_SECRET = process.env.JWT_SECRET || "Segredo_Mais_Segredo_Dos_Jogos_Internos";

export const getUserByToken = async (token) => {
    return new Promise(async (resolve, reject) => {
        if(!token){
            return response.status(401).json({message: "Acesso negado"})
        }

        const decoded = jwt.verify(token, JWT_SECRET)
        const usuarioEncontrado = await usuario.findByPk(decoded.id)
        if(!usuarioEncontrado){
            reject({error: "Error ao buscar usuário"})
        }else {
            resolve(usuarioEncontrado)
        }
    })
}