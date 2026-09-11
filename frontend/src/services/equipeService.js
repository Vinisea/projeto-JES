import api from "./api.js";

export async function listarEquipes() {
  const resposta = await api.get("/equipes");
  return resposta.data;
}