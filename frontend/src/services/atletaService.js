import api from "./api.js";

export async function listarAtletas() {
  const resposta = await api.get("/atletas");
  return resposta.data;
}