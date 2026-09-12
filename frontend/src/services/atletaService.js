import api from "./api.js";

export async function listarAtletas() {
  const resposta = await api.get("/atletas", { params: { limit: 1000 } });
  return resposta.data;
}

export async function transferirAtleta(id, idEquipe) {
  const resposta = await api.patch(`/atletas/${id}/equipe`, { id_equipe: idEquipe });
  return resposta.data;
}

export async function criarAtleta(dados) {
  const resposta = await api.post("/atletas", dados);
  return resposta.data;
}

export async function removerAtleta(id) {
  await api.delete(`/atletas/${id}`);
}

export async function editarAtleta(id, dados) {
  const resposta = await api.put(`/atletas/${id}`, dados);
  return resposta.data;
}