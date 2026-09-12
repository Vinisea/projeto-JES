import bcrypt from "bcrypt";
import { usuario } from "../models/index.js";
import { errorHandler } from "../utils/errorHandler.js";

const validarCamposObrigatorios = (payload) => {
  const { nome, email, senha, tipo_usuario } = payload || {};
  if (!nome || !email || !senha || !tipo_usuario) {
    return "nome, email, senha e tipo_usuario são obrigatórios.";
  }
  return null;
};

export const listarUsuario = async (req, res) => {
  try {
    const usuarios = await usuario.findAll({
      attributes: ["id_usuario", "nome", "email", "tipo_usuario"],
    });
    return res.status(200).json(usuarios);
  } catch (error) {
    return errorHandler(error, res);
  }
};

export const buscarUsuarioPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const usuarioEncontrado = await usuario.findByPk(id, {
      attributes: ["id_usuario", "nome", "email", "tipo_usuario"],
    });
    if (!usuarioEncontrado) {
      return res.status(404).json({ msg: "Usuário não encontrado." });
    }

    return res.status(200).json(usuarioEncontrado);
  } catch (error) {
    return errorHandler(error, res);
  }
};

export const criarUsuario = async (req, res) => {
  try {
    const erro = validarCamposObrigatorios(req.body);
    if (erro) {
      return res.status(400).json({ msg: erro });
    }

    const { nome, email, senha, tipo_usuario } = req.body;
    const senhaHash = await bcrypt.hash(senha, 10);
    const novoUsuario = await usuario.create({
      nome,
      email,
      tipo_usuario,
      senha: senhaHash,
    });

    return res.status(201).json(novoUsuario);
  } catch (error) {
    return errorHandler(error, res);
  }
};

export const editarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuarioEncontrado = await usuario.findByPk(id);
    if (!usuarioEncontrado) {
      return res.status(404).json({ msg: "Usuário não encontrado." });
    }

    const { senha, ...dados } = req.body;
    const dadosAtualizados = { ...dados };

    if (senha !== undefined) {
      dadosAtualizados.senha = await bcrypt.hash(senha, 10);
    }

    await usuarioEncontrado.update(dadosAtualizados);
    return res.status(200).json(usuarioEncontrado);
  } catch (error) {
    return errorHandler(error, res);
  }
};

export const removerUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuarioEncontrado = await usuario.findByPk(id);
    if (!usuarioEncontrado) {
      return res.status(404).json({ msg: "Usuário não encontrado." });
    }

    await usuarioEncontrado.destroy();
    return res.status(204).send();
  } catch (error) {
    return errorHandler(error, res);
  }
};
