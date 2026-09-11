import bcrypt from "bcrypt";
import { usuario } from "../models/index.js";
import { errorHandler } from "../utils/errorHandler.js";

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
    try {
        const encontrado = await usuario.findByPk(req.params.id, {
            attributes: ["id_usuario", "nome", "email", "tipo_usuario"],
        });
        if (!encontrado) return res.status(404).json({ msg: "Usuário não encontrado." });
        return res.status(200).json(encontrado);
    } catch (error) {
        return errorHandler(error, res);
    }
};

export const criarUsuario = async (req, res) => {
    try {
        const { nome, email, senha, tipo_usuario } = req.body;
        if (!nome || !email || !senha || !tipo_usuario) {
            return res.status(400).json({ msg: "nome, email, senha e tipo_usuario são obrigatórios." });
        }
        const novo = await usuario.create({
            nome, email, tipo_usuario, senha: await bcrypt.hash(senha, 10),
        });
        return res.status(201).json(novo);
    } catch (error) {
        return errorHandler(error, res);
    }
};

export const editarUsuario = async (req, res) => {
    try {
        const encontrado = await usuario.findByPk(req.params.id);
        if (!encontrado) return res.status(404).json({ msg: "Usuário não encontrado." });
        const { senha, ...dados } = req.body;
        if (senha !== undefined) dados.senha = await bcrypt.hash(senha, 10);
        await encontrado.update(dados);
        return res.status(200).json(encontrado);
    } catch (error) {
        return errorHandler(error, res);
    }
};

export const removerUsuario = async (req, res) => {
    try {
        const encontrado = await usuario.findByPk(req.params.id);
        if (!encontrado) return res.status(404).json({ msg: "Usuário não encontrado." });
        await encontrado.destroy();
        return res.status(204).send();
    } catch (error) {
        return errorHandler(error, res);
    }
};
