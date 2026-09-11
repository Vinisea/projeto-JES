import { confronto } from "../models/index.js";

const includes = [
  { association: "equipe_mandante", attributes: ["id_equipe", "nome_equipe"] },
  { association: "equipe_visitante", attributes: ["id_equipe", "nome_equipe"] },
  { association: "modalidade", attributes: ["id_modalidade", "nome_modalidade", "categoria"] },
  { association: "grupo", attributes: ["id_grupo", "nome_grupo"] },
];

export async function listarPartidasDoTelao(req, res, next) {
  try {
    const partidas = await confronto.findAll({
      where: { status_confronto: "Em andamento" },
      include: includes,
      order: [["data_hora", "ASC"], ["id_confronto", "ASC"]],
    });
    return res.status(200).json(partidas);
  } catch (error) {
    return next(error);
  }
}

export async function buscarPartidaDoTelao(req, res, next) {
  try {
    const partida = await confronto.findByPk(req.params.id, { include: includes });
    if (!partida) return res.status(404).json({ msg: "Partida não encontrada." });
    return res.status(200).json(partida);
  } catch (error) {
    return next(error);
  }
}
