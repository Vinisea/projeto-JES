import { Op } from "sequelize";
import { confronto, modalidade, equipe } from "../models/index.js"; // ajuste os nomes conforme seus models

// GET /partidas?status=EM_ANDAMENTO&modalidade=1&grupo=A&data=2026-09-01
export const listarPartidasPublicas = async (req, res, next) => {
  try {
    const { status, data } = req.query;

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

    // Consulta apenas as colunas existentes no schema atual do banco.
    const partidas = await confronto.findAll({
      where: wherePartida,
      attributes: ["id_confronto", "data_hora", "local_partida", "placar_equipe_1", "placar_equipe_2", "fase", "status_confronto", "id_equipe_1", "id_equipe_2"],
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
      attributes: ["id_confronto", "data_hora", "local_partida", "placar_equipe_1", "placar_equipe_2", "fase", "status_confronto", "id_equipe_1", "id_equipe_2"]
    });

    if (!partida) {
      return res.status(404).json({ msg: "Partida não encontrada." });
    }

    return res.status(200).json(partida);
  } catch (error) {
    next(error);
  }
};