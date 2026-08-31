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

export const gerarConfrontosDoGrupo = async (req, res, next) => {
    try {
        const { id_grupo } = req.body;

        const grupoEncontrado = await grupo.findByPk(id_grupo);

        if (!grupoEncontrado) {
            return res.status(404).json({
                message: "Grupo não encontrado"
            });
        }

        const equipes = await equipe.findAll({
            where: {
                id_grupo: id_grupo
            }
        });

        if (equipes.length < 2) {
            return res.status(400).json({
                message: "O grupo precisa ter pelo menos duas equipes."
            });
        }

        const dadosPartida = {
            id_modalidade: grupoEncontrado.id_modalidade,
            id_grupo: id_grupo,
            data_hora: new Date(),
            local_partida: "A definir",
            fase: "Quartas",
            status_confronto: "Agendado"
        };

        const confrontos = gerarPartidas(equipes, dadosPartida);

        const confrontosCriados = await confronto.bulkCreate(confrontos);

        return res.status(201).json({
            message: "Confrontos gerados com sucesso.",
            quantidade: confrontosCriados.length,
            confrontos: confrontosCriados
        });

    } catch (error) {
        next(error);
    }
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


//Iniciar confronto
export const iniciarConfronto = async (req, res, next) => {
    try {
       const { id } = req.params;
       const confrontoEncontrado = await confronto.findByPk(id);
       
       if (!confrontoEncontrado) return res.status(404).json({msg: "Confornto não encontrado"})

        //regra: só pode iniciar se estiver agendade
        if (confrontoEncontrado.status_confronto !== "Agendado") return res.status(400).json({msg: `Apenas confrontos com status 'Agendado' podem ser iniciados. Status atual: ${confrontoEncontrado.status_confronto}.`})
            
        await confrontoEncontrado.update({ status_confronto: 'Em andamento' });
        return res.status(200).json({msg: "Confronto inicado com sucesso", confronto: confrontoEncontrado})
        } catch (error) {
        next(error)
    }
}

//Atualizar placar/resultado
//PATCH confronto/:id/atualizar
export const atualizarPlacar = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { placar_equipe_1, placar_equipe_2 } = req.body;

        const confrontoAchado = await confronto.findByPk(id);
        if (!confrontoAchado) return res.status(404).json({msg: "Confronto não encontrado"})
        //Não alterar confronto que não esteja em andamento
        if (confrontoAchado.status_confronto !== "Em andamento") 
            return res.status(400).json(
        {msg: `Não pe possível alterar o placar de um confronto ${confrontoAchado.status_confronto}. O confronto precisa estar 'Em andamento`}
    )

        if (placar_equipe_1 === undefined || placar_equipe_2 === undefined) {
            res.status(400).json({msg: "Informe os campos de 'placar_equipe_1' e 'placar_equipe_2'"})
            return
        }

        await confrontoAchado.update({
            placar_equipe_1: parseInt(placar_equipe_1),
            placar_equipe_2: parseInt(placar_equipe_2)
        });
        
        return res.status(200).json({message: "Placar atualizado com sucesso!", confronto: confrontoAchado})
    } catch (error) {
        next(error);
    }
}


// Finalizar confronto
// PATCH /confrontos/:id/finalizar
export const finalizarConfronto = async (req, res, next) => {
    try {
        const { id } = req.params;

        const confrontoAchado = await confronto.findByPk(id);

        if (!confrontoAchado) {
            return res.status(404).json({
                msg: "Confronto não encontrado"
            });
        }

        // Só pode finalizar um confronto que esteja em andamento
        if (confrontoAchado.status_confronto !== "Em andamento") {
            return res.status(400).json({
                msg: `O confronto precisa estar 'Em andamento' para ser finalizado. Status atual: ${confrontoAchado.status_confronto}.`
            });
        }

        const {
            placar_equipe_1,
            placar_equipe_2
        } = confrontoAchado;

        // Determina o vencedor
        let id_equipe_vencedora = null;

        if (placar_equipe_1 > placar_equipe_2) {
            id_equipe_vencedora = confrontoAchado.id_equipe_1;
        } else if (placar_equipe_2 > placar_equipe_1) {
            id_equipe_vencedora = confrontoAchado.id_equipe_2;
        }

        // Não permite empate definitivo nas fases eliminatórias
        if (
            placar_equipe_1 === placar_equipe_2 &&
            ["Quartas", "Semifinal", "Final"].includes(confrontoAchado.fase)
        ) {
            return res.status(400).json({
                msg: "Não é permitido empate nas fases eliminatórias. É necessário definir um vencedor através dos critérios de desempate."
            });
        }

        await confrontoAchado.update({
            status_confronto: "Finalizado",
            id_equipe_vencedora
        });

        return res.status(200).json({
            message: "Confronto finalizado com sucesso.",
            vencedor: id_equipe_vencedora
                ? `Equipe ID: ${id_equipe_vencedora}`
                : "Empate",
            confronto: confrontoAchado
        });

    } catch (error) {
        next(error);
    }
};

