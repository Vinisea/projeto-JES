import { Op } from "sequelize";
import { confronto, equipe, grupo, modalidade } from "../models/index.js";
import { listarRankingGeral } from "./RankingController.js";

const STATUS = {
  AGENDADO: "Agendado",
  EM_ANDAMENTO: "Em andamento",
  FINALIZADO: "Finalizado",
};

const normalizeStatus = (value) => {
  if (!value) return undefined;
  const normalized = String(value).trim().toUpperCase().replace(/\s+/g, "_");
  return STATUS[normalized] || null;
};

const parseId = (value, name) => {
  if (value === undefined) return undefined;
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) {
    const error = new Error(`${name} deve ser um número inteiro positivo.`);
    error.status = 400;
    throw error;
  }
  return id;
};

const parseDate = (value) => {
  if (value === undefined) return undefined;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const error = new Error("data deve estar no formato YYYY-MM-DD.");
    error.status = 400;
    throw error;
  }

  const start = new Date(`${value}T00:00:00.000Z`);
  const end = new Date(`${value}T23:59:59.999Z`);
  if (Number.isNaN(start.getTime())) {
    const error = new Error("data inválida.");
    error.status = 400;
    throw error;
  }

  return { [Op.between]: [start, end] };
};

const publicTeam = (team) => team && ({
  id_equipe: team.id_equipe,
  nome_equipe: team.nome_equipe,
});

const publicMatch = (match) => ({
  id_confronto: match.id_confronto,
  data_hora: match.data_hora,
  local_partida: match.local_partida,
  placar_equipe_1: match.placar_equipe_1,
  placar_equipe_2: match.placar_equipe_2,
  fase: match.fase,
  status_confronto: match.status_confronto,
  id_equipe_vencedora: match.id_equipe_vencedora,
  modalidade: match.modalidade && {
    id_modalidade: match.modalidade.id_modalidade,
    nome_modalidade: match.modalidade.nome_modalidade,
    categoria: match.modalidade.categoria,
  },
  grupo: match.grupo && {
    id_grupo: match.grupo.id_grupo,
    nome_grupo: match.grupo.nome_grupo,
  },
  equipe_mandante: publicTeam(match.equipe_mandante),
  equipe_visitante: publicTeam(match.equipe_visitante),
});

const matchIncludes = [
  { association: "equipe_mandante", attributes: ["id_equipe", "nome_equipe"] },
  { association: "equipe_visitante", attributes: ["id_equipe", "nome_equipe"] },
  { association: "modalidade", attributes: ["id_modalidade", "nome_modalidade", "categoria"] },
  { association: "grupo", attributes: ["id_grupo", "nome_grupo"] },
];

const buildMatchWhere = (query) => {
  const status = normalizeStatus(query.status);
  if (query.status !== undefined && !status) {
    const error = new Error("status inválido. Use AGENDADO, EM_ANDAMENTO ou FINALIZADO.");
    error.status = 400;
    throw error;
  }

  return {
    ...(status && { status_confronto: status }),
    ...(query.modalidade !== undefined && { id_modalidade: parseId(query.modalidade, "modalidade") }),
    ...(query.grupo !== undefined && { id_grupo: parseId(query.grupo, "grupo") }),
    ...(query.data !== undefined && { data_hora: parseDate(query.data) }),
  };
};

export const listarPartidasPublicas = async (req, res, next) => {
  try {
    const partidas = await confronto.findAll({
      where: buildMatchWhere(req.query),
      attributes: [
        "id_confronto", "data_hora", "local_partida", "placar_equipe_1",
        "placar_equipe_2", "fase", "status_confronto", "id_equipe_vencedora",
      ],
      include: matchIncludes,
      order: [["data_hora", "ASC"], ["id_confronto", "ASC"]],
    });

    return res.status(200).json(partidas.map(publicMatch));
  } catch (error) {
    return next(error);
  }
};

export const obterPartidaPublica = async (req, res, next) => {
  try {
    const id = parseId(req.params.id, "id");
    const partida = await confronto.findByPk(id, {
      attributes: [
        "id_confronto", "data_hora", "local_partida", "placar_equipe_1",
        "placar_equipe_2", "fase", "status_confronto", "id_equipe_vencedora",
      ],
      include: matchIncludes,
    });

    if (!partida) return res.status(404).json({ msg: "Partida não encontrada." });
    return res.status(200).json(publicMatch(partida));
  } catch (error) {
    return next(error);
  }
};

export const listarResultadosPublicos = async (req, res, next) => {
  try {
    const where = buildMatchWhere({ ...req.query, status: "FINALIZADO" });
    const resultados = await confronto.findAll({
      where,
      attributes: [
        "id_confronto", "data_hora", "local_partida", "placar_equipe_1",
        "placar_equipe_2", "fase", "status_confronto", "id_equipe_vencedora",
      ],
      include: matchIncludes,
      order: [["data_hora", "DESC"], ["id_confronto", "DESC"]],
    });

    return res.status(200).json(resultados.map(publicMatch));
  } catch (error) {
    return next(error);
  }
};

export const listarClassificacaoPublica = async (req, res, next) => {
  try {
    const groupId = parseId(req.query.grupo, "grupo");
    const groups = await grupo.findAll({
      where: groupId ? { id_grupo: groupId } : undefined,
      attributes: ["id_grupo", "nome_grupo", "id_modalidade"],
      include: [{ association: "equipes", attributes: ["id_equipe", "nome_equipe"] }],
      order: [["id_grupo", "ASC"]],
    });

    if (groupId && groups.length === 0) {
      return res.status(404).json({ msg: "Grupo não encontrado." });
    }

    const rows = [];
    for (const group of groups) {
      const matches = await confronto.findAll({
        where: { id_grupo: group.id_grupo, status_confronto: STATUS.FINALIZADO },
        attributes: ["id_equipe_1", "id_equipe_2", "placar_equipe_1", "placar_equipe_2"],
      });
      const table = new Map(group.equipes.map((team) => [team.id_equipe, {
        id_equipe: team.id_equipe, nome_equipe: team.nome_equipe, jogos: 0,
        vitorias: 0, empates: 0, derrotas: 0, pontos: 0,
        gols_marcados: 0, gols_sofridos: 0, saldo: 0,
      }]));

      for (const match of matches) {
        const first = table.get(match.id_equipe_1);
        const second = table.get(match.id_equipe_2);
        if (!first || !second) continue;
        const score1 = Number(match.placar_equipe_1);
        const score2 = Number(match.placar_equipe_2);
        first.jogos++; second.jogos++;
        first.gols_marcados += score1; first.gols_sofridos += score2;
        second.gols_marcados += score2; second.gols_sofridos += score1;
        if (score1 > score2) { first.vitorias++; first.pontos += 3; second.derrotas++; }
        else if (score2 > score1) { second.vitorias++; second.pontos += 3; first.derrotas++; }
        else { first.empates++; second.empates++; first.pontos++; second.pontos++; }
      }

      const ranking = [...table.values()]
        .map((team) => ({ ...team, saldo: team.gols_marcados - team.gols_sofridos }))
        .sort((a, b) => b.pontos - a.pontos || b.vitorias - a.vitorias ||
          b.saldo - a.saldo || b.gols_marcados - a.gols_marcados ||
          a.nome_equipe.localeCompare(b.nome_equipe))
        .map((team, index) => ({ posicao: index + 1, ...team }));
      rows.push({ id_grupo: group.id_grupo, nome_grupo: group.nome_grupo, ranking });
    }

    return res.status(200).json(rows);
  } catch (error) {
    return next(error);
  }
};

export const listarRankingPublico = (req, res, next) => listarRankingGeral(req, res, next);

export const listarChaveamentoPublico = async (req, res, next) => {
  try {
    const modalidadeId = parseId(req.query.modalidade, "modalidade");
    const modalidades = await modalidade.findAll({
      where: modalidadeId ? { id_modalidade: modalidadeId } : undefined,
      include: [{
        association: "grupos",
        include: [
          { association: "equipes", attributes: ["id_equipe", "nome_equipe"] },
          {
            association: "confrontos",
            include: [
              { association: "equipe_mandante", attributes: ["id_equipe", "nome_equipe"] },
              { association: "equipe_visitante", attributes: ["id_equipe", "nome_equipe"] },
            ],
            order: [["data_hora", "ASC"], ["id_confronto", "ASC"]],
          },
        ],
      }],
      order: [["id_modalidade", "ASC"]],
    });

    const resultado = modalidades.map((item) => ({
      id_modalidade: item.id_modalidade,
      nome_modalidade: item.nome_modalidade,
      categoria: item.categoria,
      series: item.grupos.map((grupoAtual) => ({
        id_grupo: grupoAtual.id_grupo,
        nome_grupo: grupoAtual.nome_grupo,
        fases: grupoAtual.confrontos.reduce((fases, confrontoAtual) => {
          const fase = confrontoAtual.fase || "Grupos";
          if (!fases[fase]) fases[fase] = [];
          fases[fase].push(confrontoAtual);
          return fases;
        }, {}),
      })),
    }));

    return res.status(200).json({ modalidades: resultado });
  } catch (error) {
    return next(error);
  }
};
