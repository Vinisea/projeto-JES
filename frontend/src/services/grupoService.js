import api from "./api.js";

export async function listarGrupos() {
  const resposta = await api.get("/grupos");
  return resposta.data;
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
  const resposta = await api.delete(`/grupos/${id}`);
  return resposta.data;
}

export async function sortearGrupos(dados) {
  const resposta = await api.post("/grupos/sortear", dados);
  return resposta.data;
}
