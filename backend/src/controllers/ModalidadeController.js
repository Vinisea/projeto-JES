import { modalidade } from "../models/Modalidade.js";
//--------------------------------------------------------------  //
// TODO: impedir cadastro de modalidades com mesmo nome/categoria //
// -------------------------------------------------------------- //
export const listarModalidades = async (req, res, next) => {
    try {
        const modalidades = await modalidade.findAll();
        return res.status(200).json(modalidades);
    } catch (error) {
        next(error);
    }
};
export const buscarModalidadePorId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const modalidadeEncontrada = await modalidade.findByPk(id);
        if (!modalidadeEncontrada) {
            return res.status(404).json({
                message: "Modalidade não encontrada"
            });
        }
        return res.status(200).json(modalidadeEncontrada);
    } catch (error) {
        next(error);
    }
};
export const criarModalidade = async (req, res, next) => {
    try {
        const novaModalidade = await modalidade.create(req.body);
        return res.status(201).json(novaModalidade);
    } catch (error) {
        next(error);
    }
};
export const editarModalidade = async (req, res, next) => {
    try {
        const { id } = req.params;
        const modalidadeEncontrada = await modalidade.findByPk(id);
        if (!modalidadeEncontrada) {
            return res.status(404).json({
                message: "Modalidade não encontrada"
            });
        }
        await modalidadeEncontrada.update(req.body);
        return res.status(200).json(modalidadeEncontrada);
    } catch (error) {
        next(error);
    }
};
export const removerModalidade = async (req, res, next) => {
    try {
        const { id } = req.params;
        const modalidadeEncontrada = await modalidade.findByPk(id);
        if (!modalidadeEncontrada) {
            return res.status(404).json({
                message: "Modalidade não encontrada"
            });
        }
        await modalidadeEncontrada.destroy();
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
};