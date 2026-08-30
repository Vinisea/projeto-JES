import { modalidade } from "../models/Modalidade.js";

// Tabela oficial de pontos do Interclasse por colocação na modalidade
const TABELA_PONTOS_MODALIDADE = {
  1: 100, // 1º Lugar
  2: 70,  // 2º Lugar
  3: 50,  // 3º Lugar
  4: 30   // 4º Lugar
};
const PONTOS_PARTICIPACAO = 10; // DEMAIS COLOCAÇÕES (5º em diante)

//Consolida o resultado final da modalidade ordenando as equipes de todos os grupos
const consolidarResultadoModalidade = (gruposComClassificacao) => {
  let todasEquipes = [];

  // Junta as equipes de todos os grupos da modalidade
  gruposComClassificacao.forEach((g) => {
    todasEquipes = todasEquipes.concat(g.ranking);
  });

  // Ordena a lista geral da modalidade pelos critérios oficiais
  const ordenadaGeral = todasEquipes.sort((a, b) => {
    if (b.pontos !== a.pontos) return b.pontos - a.pontos;
    if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;
    if (b.saldo !== a.saldo) return b.saldo - a.saldo;
    if (b.gols_marcados !== a.gols_marcados) return b.gols_marcados - a.gols_marcados;
    return a.nome_equipe.localeCompare(b.nome_equipe);
  });

  // Atribui posições e pontuações do torneio
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

//oi
