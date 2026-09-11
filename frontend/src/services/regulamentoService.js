import api from "./api.js";

export async function buscarRegulamento() {
  const resposta = await api.get("/regulamento");
  return resposta.data;
}

export async function editarRegulamento(texto) {
  const resposta = await api.put("/regulamento", { texto });
  return resposta.data;
}
