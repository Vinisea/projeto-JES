import { modalidade } from "../models/Modalidade.js";

//--------------------------------------------------------------  //
// TODO: impedir cadastro de modalidades com mesmo nome/categoria //
// -------------------------------------------------------------- //


export const listarModalidades = async (req, res) => {
    try {
        const modalidades = await modalidade.findAll();

        return res.status(200).json(modalidades);
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao listar modalidades."
        });
    }
};


export const buscarModalidadePorId = async (req, res) => {
    try {
        const { id } = req.params;

        const modalidadeEncontrada = await modalidade.findByPk(id);

        if (!modalidadeEncontrada) {
            return res.status(404).json({
                mensagem: "Modalidade não encontrada."
            });
        }

        return res.status(200).json(modalidadeEncontrada);
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao buscar modalidade."
        });
    }
};


export const criarModalidade = async (req, res) => {
    try {
        const {
            nome_modalidade,
            regras,
            categoria
        } = req.body;

        if (!nome_modalidade || !regras || !categoria) {
            return res.status(400).json({
                mensagem: "Nome, regras e categoria são obrigatórios."
            });
        }

        const novaModalidade = await modalidade.create({
            nome_modalidade,
            regras,
            categoria
        });

        return res.status(201).json(novaModalidade);
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao criar modalidade."
        });
    }
};


export const editarModalidade = async (req, res) => {
    try {
        const { id } = req.params;

        const modalidadeEncontrada = await modalidade.findByPk(id);

        if (!modalidadeEncontrada) {
            return res.status(404).json({
                mensagem: "Modalidade não encontrada."
            });
        }

        const {
            nome_modalidade,
            regras,
            categoria
        } = req.body;

        if (!nome_modalidade || !regras || !categoria) {
            return res.status(400).json({
                mensagem: "Nome, regras e categoria são obrigatórios."
            });
        }

        await modalidadeEncontrada.update({
            nome_modalidade,
            regras,
            categoria
        });

        return res.status(200).json(modalidadeEncontrada);
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao editar modalidade."
        });
    }
};


export const removerModalidade = async (req, res) => {
    try {
        const { id } = req.params;

        const modalidadeEncontrada = await modalidade.findByPk(id);

        if (!modalidadeEncontrada) {
            return res.status(404).json({
                mensagem: "Modalidade não encontrada."
            });
        }

        await modalidadeEncontrada.destroy();

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao remover modalidade."
        });
    }
};