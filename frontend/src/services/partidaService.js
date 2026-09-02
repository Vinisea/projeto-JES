import api from "./api.js";

export async function listarPartidas() {
  const resposta = await api.get("/partidas");
  return resposta.data;
}