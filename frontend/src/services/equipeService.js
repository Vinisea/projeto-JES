import api from "./api.js";

export async function listarEquipes() {
  const resposta = await api.get("/equipes");
  return resposta.data;
}

export async function criarEquipe(dados) {
  const resposta = await api.post("/equipes", dados);
  return resposta.data;
}

export async function removerEquipe(id) {
  await api.delete(`/equipes/${id}`);
}

export async function editarEquipe(id, dados) {
  const resposta = await api.put(`/equipes/${id}`, dados);
  return resposta.data;
}