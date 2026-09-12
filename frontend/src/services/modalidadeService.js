import api from "./api.js";

export async function listarModalidades() {
  const resposta = await api.get("/modalidades");
  return resposta.data;
}

export async function criarModalidade(dados) {
  const resposta = await api.post("/modalidades", dados);
  return resposta.data;
}

export async function editarModalidade(id, dados) {
  const resposta = await api.put(`/modalidades/${id}`, dados);
  return resposta.data;
}

export async function removerModalidade(id) {
  await api.delete(`/modalidades/${id}`);
}