import api from "./api.js";

export async function buscarRankingGeral() {
  const resposta = await api.get("/ranking/geral");
  return resposta.data;
}

export async function buscarRankingPorModalidade(idModalidade) {
  const resposta = await api.get(`/ranking/modalidade/${idModalidade}`);
  return resposta.data;
}
