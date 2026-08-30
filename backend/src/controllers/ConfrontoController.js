import { confronto } from "../models/Confronto.js";
import { equipe } from "../models/Equipe.js";
import { modalidade } from "../models/Modalidade.js";
import { grupo } from "../models/Grupo.js";


//Gerar partidas aleatórios
export const gerarPartidas = (equipes, dadosPartida) => {
    const confrontos = [];

    for (let i = 0; i < equipes.length; i++) {
        for (let j = i + 1; j < equipes.length; j++) {
            confrontos.push({
                id_equipe_1: equipes[i].id_equipe,
                id_equipe_2: equipes[j].id_equipe,
                id_modalidade: dadosPartida.id_modalidade,
                id_grupo: dadosPartida.id_grupo,
                data_hora: dadosPartida.data_hora,
                local_partida: dadosPartida.local_partida,
                fase: dadosPartida.fase,
                status_confronto: dadosPartida.status_confronto
            });
        }
    }

    return confrontos;
};


// Listar todos os confrontos
export const listarConfrontos = async (req, res, next) => {
    try {
        const { modalidade, grupo, status } = req.query;

        const where = {};

        if (modalidade) {
            where.id_modalidade = modalidade;
        }

        if (grupo) {
            where.id_grupo = grupo;
        }

        if (status) {
            where.status_confronto = status;
        }

        const confrontos = await confronto.findAll({
            where,
            include: [
                {
                    association: "equipe_mandante"
                },
                {
                    association: "equipe_visitante"
                },
                {
                    association: "modalidade"
                },
                {
                    association: "grupo"
                }
            ]
        });

        return res.status(200).json(confrontos);
    } catch (error) {
        next(error);
    }
};

// Buscar confronto por ID
export const buscarConfrontoPorId = async (req, res, next) => {
    try {
        const { id } = req.params;

        const confrontoEncontrado = await confronto.findByPk(id, {
    include: [
        {
            association: "equipe_mandante"
        },
        {
            association: "equipe_visitante"
        },
        {
            association: "modalidade"
        },
        {
            association: "grupo"
        }
    ]
});

        if (!confrontoEncontrado) {
            return res.status(404).json({
                message: "Confronto não encontrado"
            });
        }

        return res.status(200).json(confrontoEncontrado);
    } catch (error) {
        next(error);
    }
};

// Criar confronto
export const criarConfronto = async (req, res, next) => {
    try {
        const {
            id_equipe_1,
            id_equipe_2,
            id_modalidade,
            id_grupo
        } = req.body;

        const equipe1 = await equipe.findByPk(id_equipe_1);

        if (!equipe1) {
            return res.status(404).json({
                message: "Equipe 1 não encontrada"
            });
        }

        const equipe2 = await equipe.findByPk(id_equipe_2);

        if (!equipe2) {
            return res.status(404).json({
                message: "Equipe 2 não encontrada"
            });
        }

        const modalidadeEncontrada = await modalidade.findByPk(id_modalidade);

        if (!modalidadeEncontrada) {
            return res.status(404).json({
                message: "Modalidade não encontrada"
            });
        }

        const grupoEncontrado = await grupo.findByPk(id_grupo);

        if (!grupoEncontrado) {
            return res.status(404).json({
                message: "Grupo não encontrado"
            });
        }

        const novoConfronto = await confronto.create(req.body);

        return res.status(201).json(novoConfronto);
    } catch (error) {
        next(error);
    }
};
// Editar confronto
export const editarConfronto = async (req, res, next) => {
    try {
        const { id } = req.params;

        const confrontoEncontrado = await confronto.findByPk(id);

        if (!confrontoEncontrado) {
            return res.status(404).json({
                message: "Confronto não encontrado"
            });
        }

        await confrontoEncontrado.update(req.body);

        return res.status(200).json(confrontoEncontrado);
    } catch (error) {
        next(error);
    }
};

// Remover confronto
export const removerConfronto = async (req, res, next) => {
    try {
        const { id } = req.params;

        const confrontoEncontrado = await confronto.findByPk(id);

        if (!confrontoEncontrado) {
            return res.status(404).json({
                message: "Confronto não encontrado"
            });
        }

        await confrontoEncontrado.destroy();

        return res.status(200).json({
    message: "Confronto deletado com sucesso."
});

    } catch (error) {
        next(error);
    }
};


