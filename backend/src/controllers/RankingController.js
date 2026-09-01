import { grupo, equipe, confronto, modalidade } from "../models/index.js";
import { errorHandler } from "../middlewares/errorHandler.js";

const REGRAS_PONTUACAO = {
  FUTSAL: {
    pontosVitoria: 3,
    pontosDerrota: 0,
    usaSaldo: true,
    permiteEmpate: false,
  },

  QUEIMADO: {
    pontosVitoria: null,
    pontosDerrota: null,
    usaSaldo: false,
    permiteEmpate: false,
  },

  VOLEIBOL: {
    pontosVitoria: null,
    pontosDerrota: null,
    usaSaldo: false,
    permiteEmpate: false,
  },

  FUTMESA: {
    pontosVitoria: null,
    pontosDerrota: null,
    usaSaldo: false,
    permiteEmpate: false,
  },

  DAMA: {
    pontosVitoria: null,
    pontosDerrota: null,
    usaSaldo: false,
    permiteEmpate: true,
  },
};

// ==========================================
// FUNÇÕES AUXILIARES DE CÁLCULO
// ==========================================

const calcularEstatisticasEquipes = (equipes, confrontos, nomeModalidade) => {
  const regras = REGRAS_PONTUACAO[nomeModalidade];

  const tabelaMap = {};

  // Inicializa zerado para todas as equipes do grupo
  equipes.forEach((eq) => {
    tabelaMap[eq.id_equipe] = {
      id_equipe: eq.id_equipe,
      nome_equipe: eq.nome_equipe || eq.nome,
      jogos: 0,
      vitorias: 0,
      empates: 0,
      derrotas: 0,
      pontos: 0,
      gols_marcados: 0,
      gols_sofridos: 0,
      saldo: 0,
    };
  });

  // Processa apenas confrontos com status 'Finalizado'
  confrontos.forEach((conf) => {
    if (conf.status_confronto !== "Finalizado") return;

    const id1 = conf.id_equipe_1;
    const id2 = conf.id_equipe_2;
    const p1 = Number(conf.placar_equipe_1) || 0;
    const p2 = Number(conf.placar_equipe_2) || 0;

    const eq1 = tabelaMap[id1];
    const eq2 = tabelaMap[id2];

    if (eq1 && eq2) {
      eq1.jogos += 1;
      eq2.jogos += 1;

      eq1.gols_marcados += p1;
      eq1.gols_sofridos += p2;
      eq2.gols_marcados += p2;
      eq2.gols_sofridos += p1;

      if (p1 > p2) {
        eq1.vitorias += 1;
        eq1.pontos += regras.pontosVitoria;
        eq2.derrotas += 1;
        eq2.pontos += regras.pontosDerrota;
      } else if (p2 > p1) {
        eq2.vitorias += 1;
        eq2.pontos += regras.pontosVitoria;
        eq1.derrotas += 1;
        eq1.pontos += regras.pontosDerrota;
      } else {
        eq1.empates += 1;
        eq2.empates += 1;
      }

      if (regras.usaSaldo) {
        eq1.saldo = eq1.gols_marcados - eq1.gols_sofridos;
        eq2.saldo = eq2.gols_marcados - eq2.gols_sofridos;
      }
    }
  });

  return Object.values(tabelaMap);
};

const classificarEquipes = (tabelaArray) => {
  const ordenada = tabelaArray.sort((a, b) => {
    if (b.pontos !== a.pontos) return b.pontos - a.pontos;
    if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;
    if (b.saldo !== a.saldo) return b.saldo - a.saldo;
    if (b.gols_marcados !== a.gols_marcados)
      return b.gols_marcados - a.gols_marcados;
    return a.nome_equipe.localeCompare(b.nome_equipe);
  });

  return ordenada.map((eq, index) => ({
    posicao: `${index + 1}º`,
    ...eq,
  }));
};

// ==========================================
// METODOS DO CONTROLLER
// ==========================================

export const listarRankingPorGrupo = async (req, res) => {
  const { grupoId } = req.params;

  try {
    const grupoEncontrado = await grupo.findByPk(grupoId, {
      include: [{ model: equipe, as: "equipes" }],
    });

    if (!grupoEncontrado) {
      return res.status(404).json({ msg: "Grupo não encontrado." });
    }

    const confrontos = await confronto.findAll({
      where: {
        id_grupo: grupoId,
        status_confronto: "Finalizado",
      },
    });

    const modalidadeEncontrada = await modalidade.findByPk(
      grupoEncontrado.id_modalidade,
    );

    const estatisticas = calcularEstatisticasEquipes(
      grupoEncontrado.equipes,
      confrontos,
      modalidadeEncontrada.nome_modalidade.toUpperCase(),
    );

    const rankingFinal = classificarEquipes(estatisticas);

    return res.status(200).json({
      grupo: grupoEncontrado.nome_grupo,
      id_modalidade: grupoEncontrado.id_modalidade,
      ranking: rankingFinal,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

export const listarRankingPorModalidade = async (req, res) => {
  const { modalidadeId } = req.params;

  try {
    const modalidadeEncontrada = await modalidade.findByPk(modalidadeId, {
      include: [
        {
          model: grupo,
          as: "grupos",
          include: [{ model: equipe, as: "equipes" }],
        },
      ],
    });

    if (!modalidadeEncontrada) {
      return res.status(404).json({ msg: "Modalidade não encontrada." });
    }

    const resultadoPorGrupo = [];

    for (const g of modalidadeEncontrada.grupos) {
      const confrontos = await confronto.findAll({
        where: {
          id_grupo: g.id_grupo,
          status_confronto: "Finalizado",
        },
      });

      const estatisticas = calcularEstatisticasEquipes(
        g.equipes,
        confrontos,
        modalidadeEncontrada.nome_modalidade.toUpperCase(),
      );

      const rankingFinal = classificarEquipes(estatisticas);

      resultadoPorGrupo.push({
        id_grupo: g.id_grupo,
        nome_grupo: g.nome_grupo,
        ranking: rankingFinal,
      });
    }

    return res.status(200).json({
      modalidade: modalidadeEncontrada.nome_modalidade,
      categoria: modalidadeEncontrada.categoria,
      grupos: resultadoPorGrupo,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

// Tabela de pontuação geral por posição na modalidade
const TABELA_PONTOS_GERAL = {
  1: 100,
  2: 70,
  3: 50,
};

export const listarRankingGeral = async (req, res) => {
  try {
    // 1. Busca todas as modalidades com seus grupos e equipes
    const modalidades = await modalidade.findAll({
      include: [
        {
          model: grupo,
          as: "grupos",
          include: [{ model: equipe, as: "equipes" }],
        },
      ],
    });

    // Mapa para acumular a pontuação geral de cada equipe/turma
    // Chave: nome_equipe (ou id_turma / nome_turma)
    const rankingGeralMap = {};

    // 2. Percorre cada modalidade e cada grupo
    for (const mod of modalidades) {
      for (const g of mod.grupos) {
        // Busca os confrontos finalizados do grupo
        const confrontos = await confronto.findAll({
          where: {
            id_grupo: g.id_grupo,
            status_confronto: "Finalizado",
          },
        });

        // Se não houver jogos finalizados, pula
        if (confrontos.length === 0) continue;

        // Calcula e classifica as equipes deste grupo especificamente
        const estatisticas = calcularEstatisticasEquipes(
          g.equipes,
          confrontos,
          mod.nome_modalidade.toUpperCase(),
        );
        const classificacaoGrupo = classificarEquipes(estatisticas);

        // 3. Atribui a pontuação geral baseada na colocação do grupo
        classificacaoGrupo.forEach((item, index) => {
          const pos = index + 1; // 1, 2, 3, 4...

          const pontosGeraisGanhos = TABELA_PONTOS_GERAL[pos] || 0;

          const nomeEquipe = item.nome_equipe;

          if (!rankingGeralMap[nomeEquipe]) {
            rankingGeralMap[nomeEquipe] = {
              equipe: nomeEquipe,
              pontos_gerais: 0,
              primeiros_lugares: 0,
              segundos_lugares: 0,
              terceiros_lugares: 0,
              modalidades_disputadas: 0,
            };
          }

          rankingGeralMap[nomeEquipe].pontos_gerais += pontosGeraisGanhos;
          rankingGeralMap[nomeEquipe].modalidades_disputadas += 1;

          if (pos === 1) rankingGeralMap[nomeEquipe].primeiros_lugares += 1;
          if (pos === 2) rankingGeralMap[nomeEquipe].segundos_lugares += 1;
          if (pos === 3) rankingGeralMap[nomeEquipe].terceiros_lugares += 1;
        });
      }
    }

    // 4. Converte o mapa para Array e Ordena o Ranking Geral
    const rankingGeralArray = Object.values(rankingGeralMap).sort((a, b) => {

      // 1º Criterio: Pontos Gerais
      if (b.pontos_gerais !== a.pontos_gerais)
        return b.pontos_gerais - a.pontos_gerais;

      // 2º Criterio: Quantidade de 1ºs lugares (Ouros)
      if (b.primeiros_lugares !== a.primeiros_lugares)
        return b.primeiros_lugares - a.primeiros_lugares;

      // 3º Criterio: Quantidade de 2ºs lugares (Pratas)
      if (b.segundos_lugares !== a.segundos_lugares)
        return b.segundos_lugares - a.segundos_lugares;

      // 4º Criterio: Quantidade de 3ºs lugares (bronzes)
      if (b.terceiros_lugares !== a.terceiros_lugares)
        return b.terceiros_lugares - a.terceiros_lugares;

      // 5º Criterio: Nome
      return a.equipe.localeCompare(b.equipe);

    });

    // 5. Adiciona o rótulo de posição geral (1º, 2º, 3º...)
    const resultadoComPosicao = rankingGeralArray.map((item, index) => ({
      posicao: `${index + 1}º`,
      ...item,
    }));

    return res.status(200).json({
      titulo: "Ranking Geral do Campeonato",
      ranking: resultadoComPosicao,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

export const listarRankingPorTurma = async (req, res) => {
  // Caso tenham pontuação por turma geral do colégio
  return res
    .status(501)
    .json({ msg: "Ranking por turma ainda não implementado." });
};
