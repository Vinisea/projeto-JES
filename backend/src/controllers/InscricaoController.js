import { Op } from "sequelize";
import { inscricao } from "../models/Inscricao.js";
import { equipe } from "../models/Equipe.js";
import { modalidade } from "../models/Modalidade.js";
import { confronto } from "../models/Confronto.js";


export const criarInscricao = async (req, res, next) => {
    try {
        const { id_equipe, id_modalidade } = req.body;

        const equipeEncontrada = await equipe.findByPk(id_equipe);

        if (!equipeEncontrada) {
            return res.status(404).json({
                message: "Equipe não encontrada"
            });
        }

        const modalidadeEncontrada = await modalidade.findByPk(id_modalidade);

        if (!modalidadeEncontrada) {
            return res.status(404).json({
                message: "Modalidade não encontrada"
            });
        }

        const inscricaoExistente = await inscricao.findOne({
            where: {
                id_equipe,
                id_modalidade
            }
        });

        if (inscricaoExistente) {
            return res.status(409).json({
                message: "A equipe já está inscrita nesta modalidade"
            });
        }

        const novaInscricao = await inscricao.create({
            id_equipe,
            id_modalidade
        });

        return res.status(201).json(novaInscricao);

    } catch (error) {
        next(error);
    }
};


export const listarInscricoes = async (req, res, next) => {
    try {
        const inscricoes = await inscricao.findAll({
            include: [
                { model: equipe, as: "equipe", attributes: ["id_equipe", "nome_equipe"] },
                { model: modalidade, as: "modalidade", attributes: ["id_modalidade", "nome_modalidade", "categoria"] },
            ],
        });

        return res.status(200).json(inscricoes);
    } catch (error) {
        next(error);
    }
};

export const removerInscricao = async (req, res, next) => {
    try {
        const inscricaoEncontrada = await inscricao.findByPk(req.params.id);
        if (!inscricaoEncontrada) {
            return res.status(404).json({ message: "Inscrição não encontrada" });
        }

        const partidas = await confronto.count({
            where: {
                id_modalidade: inscricaoEncontrada.id_modalidade,
                [Op.or]: [
                    { id_equipe_1: inscricaoEncontrada.id_equipe },
                    { id_equipe_2: inscricaoEncontrada.id_equipe },
                ],
            },
        });
        if (partidas > 0) {
            return res.status(409).json({ message: "Não é possível remover inscrição vinculada a partidas." });
        }

        await inscricaoEncontrada.destroy();
        return res.status(204).send();
    } catch (error) {
        return next(error);
    }
};


export const buscarInscricaoPorId = async (req, res, next) => {
    try {
        const { id } = req.params;

        const inscricaoEncontrada = await inscricao.findByPk(id);

        if (!inscricaoEncontrada) {
            return res.status(404).json({
                message: "Inscrição não encontrada"
            });
        }

        return res.status(200).json(inscricaoEncontrada);
    } catch (error) {
        next(error);
    }
};