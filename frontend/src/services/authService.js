import api from "./api.js";

export async function fazerLogin(email, senha) {
  const resposta = await api.post("/auth/login", { email, senha });

  const dados = resposta.data;
  const token = dados.token || dados.accessToken;
  const usuario = dados.usuario || dados.user || null;

  if (token) {
    localStorage.setItem("jes_token", token);
  }

  if (usuario) {
    localStorage.setItem("jes_usuario", JSON.stringify(usuario));
  }

  return dados;
}

export function sair() {
  localStorage.removeItem("jes_token");
  localStorage.removeItem("jes_usuario");
}

export function obterToken() {
  return localStorage.getItem("jes_token");
}

export function obterUsuario() {
  const usuario = localStorage.getItem("jes_usuario");
  return usuario ? JSON.parse(usuario) : null;
}