import api from "./api.js";

export async function listarGrupos() {
  const resposta = await api.get("/grupos");
  return resposta.data?.grupos ?? resposta.data ?? [];
}

export async function criarGrupo(dados) {
  const resposta = await api.post("/grupos", dados);
  return resposta.data;
}

export async function editarGrupo(id, dados) {
  const resposta = await api.put(`/grupos/${id}`, dados);
  return resposta.data;
}

export async function removerGrupo(id) {
  await api.delete(`/grupos/${id}`);
}

export async function listarEquipesDoGrupo(id) {
  const resposta = await api.get(`/grupos/${id}/equipes`);
  return resposta.data?.equipes ?? resposta.data ?? [];
}

export async function adicionarEquipeAoGrupo(id, equipeId) {
  const resposta = await api.post(`/grupos/${id}/equipes`, { id_equipe: equipeId });
  return resposta.data;
}

export async function removerEquipeDoGrupo(id, equipeId) {
  await api.delete(`/grupos/${id}/equipes/${equipeId}`);
}
