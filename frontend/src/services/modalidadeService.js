import api from "./api.js";

export async function listarModalidades() {
  const resposta = await api.get("/modalidades");
  return resposta.data;
}