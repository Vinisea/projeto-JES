import bcrypt from "bcrypt";
import { usuario } from "../models/index.js";
import { createUserToken } from "../utils/createUserToken.js";
import { getUserByToken } from "../utils/getUserByToken.js";
import { getToken } from "../utils/getToken.js";

const JWT_SECRET = process.env.JWT_SECRET || "Segredo_Mais_Segredo_Dos_Jogos_Internos"; //kkkkkkk

export const loginUsuario = async (req, res, next) => {
  const { email, senha } = req.body;

  try {
    if (!email || !senha) {
      return res
        .status(400)
        .json({ msg: "O email e a senha são obriogatórios" });
    }

    //Encontra usuario
    const usuarioEncontrado = await usuario.scope("comSenha").findOne({ where: { email: email } });
    if (!usuarioEncontrado) {
      return res.status(401).json({ msg: "Credenciais inválidas." });
    }
    
    console.log("Senha recebida:", senha);
    console.log("Hash do banco:", usuarioEncontrado.senha);

    //Valida senha
    const senhaValida = bcrypt.compareSync(senha, usuarioEncontrado.senha);
    if (!senhaValida) {
      return res.status(401).json({ msg: "Credenciais inválidas." });
    }

    //Cria Token com função importada
    await createUserToken(usuarioEncontrado, req, res)

  } catch (error) {
    next(error)
  }
};


export const usuarioLogado = async (req, res, next) => {
    try {
        const token = await getToken(req)
        const usuarioEncontrado = await getUserByToken(token)

        if (!usuarioEncontrado) {
            return res.status(404).json({msg: "Usuário não encontrado"})
        };

        return res.status(200).json(usuarioEncontrado)
    } catch (error) {
        next(error);
    }
};

export const logoutUsuario = async (req, res, next) => {
    try {
        //O logout acontece no clientSide quando remove o token
        return res.status(200).json({
            msg: "Logout realizado com sucesso!"
        })
    } catch (error) {
        next(error);
    }
};