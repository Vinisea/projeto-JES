import { grupo, equipe, confronto, modalidade } from "../models/index.js";
import { errorHandler } from "../middlewares/errorHandler.js";

// ==========================================
// FUNÇÕES AUXILIARES DE CÁLCULO
// ==========================================

const calcularEstatisticasEquipes = (equipes, confrontos) => {
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
      saldo: 0
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
        eq1.pontos += 3;
        eq2.derrotas += 1;
      } else if (p2 > p1) {
        eq2.vitorias += 1;
        eq2.pontos += 3;
        eq1.derrotas += 1;
      } else {
        eq1.empates += 1;
        eq1.pontos += 1;
        eq2.empates += 1;
        eq2.pontos += 1;
      }

      eq1.saldo = eq1.gols_marcados - eq1.gols_sofridos;
      eq2.saldo = eq2.gols_marcados - eq2.gols_sofridos;
    }
  });

  return Object.values(tabelaMap);
};

const classificarEquipes = (tabelaArray) => {
  const ordenada = tabelaArray.sort((a, b) => {
    if (b.pontos !== a.pontos) return b.pontos - a.pontos;
    if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;
    if (b.saldo !== a.saldo) return b.saldo - a.saldo;
    if (b.gols_marcados !== a.gols_marcados) return b.gols_marcados - a.gols_marcados;
    return a.nome_equipe.localeCompare(b.nome_equipe);
  });

  return ordenada.map((eq, index) => ({
    posicao: `${index + 1}º`,
    ...eq
  }));
};


// ==========================================
// METODOS DO CONTROLLER
// ==========================================

export const listarRankingPorGrupo = async (req, res) => {
  const { grupoId } = req.params;

  try {
    const grupoEncontrado = await grupo.findByPk(grupoId, {
      include: [{ model: equipe, as: "equipes" }]
    });

    if (!grupoEncontrado) {
      return res.status(404).json({ msg: "Grupo não encontrado." });
    }

    const confrontos = await confronto.findAll({
      where: {
        id_grupo: grupoId,
        status_confronto: "Finalizado"
      }
    });

    const estatisticas = calcularEstatisticasEquipes(grupoEncontrado.equipes, confrontos);
    const rankingFinal = classificarEquipes(estatisticas);

    return res.status(200).json({
      grupo: grupoEncontrado.nome_grupo,
      id_modalidade: grupoEncontrado.id_modalidade,
      ranking: rankingFinal
    });
  } catch (error) {
    errorHandler(error, res);
  }
};
