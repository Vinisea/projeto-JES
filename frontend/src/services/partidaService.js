import api from "./api.js";

export async function listarPartidas() {
  const resposta = await api.get("/public/partidas");
  return resposta.data;
}

export async function listarChaveamento(filtros = {}) {
  const resposta = await api.get("/public/chaveamento", { params: filtros });
  return resposta.data;
}

export async function gerarChaveamento(dados) {
  const resposta = await api.post("/confrontos/gerar", dados);
  return resposta.data;
}

export async function criarPartida(dados) {
  const resposta = await api.post("/confrontos", dados);
  return resposta.data;
}

export async function removerPartida(id) {
  await api.delete(`/confrontos/${id}`);
}

export async function editarPartida(id, dados) {
  const resposta = await api.put(`/confrontos/${id}`, dados);
  return resposta.data;
}