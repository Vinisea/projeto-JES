import { Op } from "sequelize";
import { atleta, equipe, grupo, modalidade, confronto } from "../models/index.js";

export const buscarDashboard = async (req, res, next) => {
  try {
    const [equipes, atletas, grupos, modalidades, partidas] = await Promise.all([
      equipe.count(), atleta.count(), grupo.count(), modalidade.count(), confronto.count(),
    ]);
    return res.status(200).json({ equipes, atletas, grupos, modalidades, partidas });
  } catch (error) {
    return next(error);
  }
};

export const estatisticas = async (req, res, next) => {
  try {
    const [agendadas, emAndamento, finalizadas] = await Promise.all([
      confronto.count({ where: { status_confronto: "Agendado" } }),
      confronto.count({ where: { status_confronto: "Em andamento" } }),
      confronto.count({ where: { status_confronto: "Finalizado" } }),
    ]);
    return res.status(200).json({ agendadas, em_andamento: emAndamento, finalizadas });
  } catch (error) {
    return next(error);
  }
};

export const proximosJogos = async (req, res, next) => {
  try {
    const jogos = await confronto.findAll({
      where: {
        status_confronto: "Agendado",
        data_hora: { [Op.gte]: new Date() },
      },
      attributes: ["id_confronto", "data_hora", "local_partida", "fase", "status_confronto"],
      order: [["data_hora", "ASC"]],
      limit: 10,
    });
    return res.status(200).json(jogos);
  } catch (error) {
    return next(error);
  }
};
