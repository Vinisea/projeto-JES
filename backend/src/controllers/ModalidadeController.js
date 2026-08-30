import { modalidade, confronto } from "../models/Modalidade.js";

// Tabela de pontos de acordo com o regulamento
const TABELA_PONTOS_MODALIDADE = {
  1: 100, // 1º Lugar
  2: 70,  // 2º Lugar
  3: 50,  // 3º Lugar
  4: 30   // 4º Lugar
};
const PONTOS_PARTICIPACAO = 10; // DEMAIS COLOCAÇÕES (da 5º em diante)

//Consolida o resultado final da modalidade ordenando as equipes de todos os grupos
const consolidarResultadoModalidade = (gruposComClassificacao) => {
  let todasEquipes = [];

  // Junta as equipes de todos os grupos da modalidade
  gruposComClassificacao.forEach((g) => {
    todasEquipes = todasEquipes.concat(g.ranking);
  });

  // Ordena a lista geral da modalidade pelos critérios do regulamento
  const ordenadaGeral = todasEquipes.sort((a, b) => {
    if (b.pontos !== a.pontos) return b.pontos - a.pontos;
    if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;
    if (b.saldo !== a.saldo) return b.saldo - a.saldo;
    if (b.gols_marcados !== a.gols_marcados) return b.gols_marcados - a.gols_marcados;
    return a.nome_equipe.localeCompare(b.nome_equipe);
  });

  // atribui as posições e as pontuações
  return ordenadaGeral.map((eq, index) => {
    const posicaoNum = index + 1;
    const pontosTorneio = TABELA_PONTOS_MODALIDADE[posicaoNum] || PONTOS_PARTICIPACAO;

    return {
      posicao: `${posicaoNum}º`,
      id_equipe: eq.id_equipe,
      nome_equipe: eq.nome_equipe,
      pontos_partida: eq.pontos,
      vitorias: eq.vitorias,
      saldo: eq.saldo,
      pontos_gerais_conquistados: pontosTorneio
    };
  });
};

//--------------------------------------------------------------  //
// TODO: impedir cadastro de modalidades com mesmo nome/categoria //
// -------------------------------------------------------------- //
export const listarModalidades = async (req, res, next) => {
  try {
    const modalidades = await modalidade.findAll();
    return res.status(200).json(modalidades);
  } catch (error) {
    next(error);
  }
};
export const buscarModalidadePorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const modalidadeEncontrada = await modalidade.findByPk(id);
    if (!modalidadeEncontrada) {
      return res.status(404).json({
        message: "Modalidade não encontrada",
      });
    }
    return res.status(200).json(modalidadeEncontrada);
  } catch (error) {
    next(error);
  }
};
export const criarModalidade = async (req, res, next) => {
  try {
    const novaModalidade = await modalidade.create(req.body);
    return res.status(201).json(novaModalidade);
  } catch (error) {
    next(error);
  }
};
export const editarModalidade = async (req, res, next) => {
  try {
    const { id } = req.params;
    const modalidadeEncontrada = await modalidade.findByPk(id);
    if (!modalidadeEncontrada) {
      return res.status(404).json({
        message: "Modalidade não encontrada",
      });
    }
    await modalidadeEncontrada.update(req.body);
    return res.status(200).json(modalidadeEncontrada);
  } catch (error) {
    next(error);
  }
};
export const removerModalidade = async (req, res, next) => {
  try {
    const { id } = req.params;
    const modalidadeEncontrada = await modalidade.findByPk(id);
    if (!modalidadeEncontrada) {
      return res.status(404).json({
        message: "Modalidade não encontrada",
      });
    }
    await modalidadeEncontrada.destroy();
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

//oi || eai?

export const obterResultadoFinalModalidade = async (req, res) => {
  const { id } = req.params;

  try {
    const modalidadeEncontrada = await modalidade.findByPk(id, {
      include: [
        {
          model: grupo,
          as: "grupos",
          include: [{ model: equipe, as: "equipes" }]
        }
      ]
    });

    if (!modalidadeEncontrada) {
      return res.status(404).json({ msg: "Modalidade não encontrada." });
    }

    const gruposCalculados = [];

    // vai processar os resultados de cada modalidade
    for (const g of modalidadeEncontrada.grupos) {
      const confrontos = await confronto.findAll({
        where: { id_grupo: g.id_grupo, status_confronto: "Finalizado" }
      });

      const stats = calcularEstatisticasEquipes(g.equipes, confrontos);
      const rankingGrupo = classificarEquipes(stats);

      gruposCalculados.push({
        id_grupo: g.id_grupo,
        nome_grupo: g.nome_grupo,
        ranking: rankingGrupo
      });
    }

    // gera o pódio e pontuações da modalidade
    const resultadoFinal = consolidarResultadoModalidade(gruposCalculados);

    return res.status(200).json({
      modalidade: modalidadeEncontrada.nome_modalidade,
      categoria: modalidadeEncontrada.categoria,
      total_equipes: resultadoFinal.length,
      podio: resultadoFinal.slice(0, 3), // Destaque para o Top 3
      classificacao_completa: resultadoFinal
    });
  } catch (error) {
    errorHandler(error, res);
  }
};
