import { Op } from "sequelize";
import { confronto, modalidade, equipe } from "../models/index.js"; // ajuste os nomes conforme seus models

// GET /partidas?status=EM_ANDAMENTO&modalidade=1&grupo=A&data=2026-09-01
export const listarPartidasPublicas = async (req, res, next) => {
  try {
    const { status, modalidade: idModalidade, grupo, data } = req.query;

    // 1. Filtros dinâmicos para a partida
    const wherePartida = {};
    if (status) wherePartida.status_confronto = status;
    if (data) {
      // Filtra confrontos do dia fornecido
      const inicioDia = new Date(data);
      inicioDia.setUTCHours(0, 0, 0, 0);
      const fimDia = new Date(data);
      fimDia.setUTCHours(23, 59, 59, 999);

      wherePartida.data_hora = {
        [Op.between]: [inicioDia, fimDia]
      };
    }

    // 2. Filtros e otimização dos relacionamentos (Dia 4: Sem dados sensíveis/internos)
    const includeModalidade = {
      model: modalidade,
      attributes: ["id_modalidade", "nome", "genero"],
      ...(idModalidade && { where: { id_modalidade: idModalidade } })
    };

    const includeEquipes = {
      model: equipe,
      attributes: ["id_equipe", "nome", "turma", "grupo"],
      ...(grupo && { where: { grupo } })
    };

    // 3. Busca otimizada no banco
    const partidas = await confronto.findAll({
      where: wherePartida,
      attributes: { exclude: ["createdAt", "updatedAt"] }, // Otimização de payload
      include: [includeModalidade, includeEquipes],
      order: [["data_hora", "ASC"]]
    });

    return res.status(200).json(partidas);
  } catch (error) {
    next(error);
  }
};

// GET /partidas/:id
export const obterPartidaPublica = async (req, res, next) => {
  try {
    const { id } = req.params;

    const partida = await confronto.findByPk(id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        { model: modalidade, attributes: ["id_modalidade", "nome", "genero"] },
        { model: equipe, attributes: ["id_equipe", "nome", "turma", "grupo"] }
      ]
    });

    if (!partida) {
      return res.status(404).json({ msg: "Partida não encontrada." });
    }

    return res.status(200).json(partida);
  } catch (error) {
    next(error);
  }
};