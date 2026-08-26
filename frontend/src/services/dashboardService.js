import api from "./api.js";

export async function buscarResumoDashboard() {
  const resposta = await api.get("/dashboard");
  return resposta.data;
}