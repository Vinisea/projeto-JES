import api from "./api.js";

export async function listarPartidas(params = {}) {
  const resposta = await api.get("/public/partidas", { params });
  return resposta.data;
}

export async function criarPartida(dados) {
  const resposta = await api.post("/confrontos", dados);
  return resposta.data;
}

export async function editarPartida(id, dados) {
  const resposta = await api.put(`/confrontos/${id}`, dados);
  return resposta.data;
}

export async function removerPartida(id) {
  const resposta = await api.delete(`/confrontos/${id}`);
  return resposta.data;
}
