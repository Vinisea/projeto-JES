import { inscricao } from "../models/Inscricao.js";
import { equipe } from "../models/Equipe.js";
import { modalidade } from "../models/Modalidade.js";


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
        const inscricoes = await inscricao.findAll();

        return res.status(200).json(inscricoes);
    } catch (error) {
        next(error);
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