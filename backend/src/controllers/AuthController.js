import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { usuario } from "../models/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "Segredo_Mais_Segredo_Dos_Jogos_Internos"; //kkkkkkk

export const loginUsuario = async (req, res, next) => {
  const { email, senha } = req.body;

  try {
    if (!email || !senha) {
      return res
        .status(400)
        .json({ msg: "O email e a senha são obriogatórios" });
    }

    const usuarioEmail = await usuario.findOne({ where: { email: email } });
    if (!usuarioEmail) {
      return res.status(401).json({ msg: "Credenciais inválidas." });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ msg: "Credenciais inválidas." });
    }

    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        role: usuario.tipo_usuario,
        email: usuario.email,
      },
      JWT_SECRET,
      {
        expiresIn: "8h",
      },
    );

    return res.status(200).json({
        msg: "Login realizado com sucesso!",
        token,
        usuario: {
            id: usuario.usuario_id,
            nome: usuario.nome,
            email: usuario.email,
            role: usuario.tipo_usuario
        }
    })
  } catch (error) {
    next(error)
  }
};


export const usuarioLogado = async (req, res, next) => {
    try {
        const usuario = await usuario.findByPk(req.usuario.id, {
            attributes: {exclude: ["senha"]}
        });

        if (!usuario) {
            return res.status(404).json({msg: "Usuário não encontrado"})
        };

        return res.status(200).json(usuario)
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