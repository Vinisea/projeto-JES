import api from "./api.js";

const TOKEN_EXPIRATION_KEY = "jes_token_expira_em";

function obterExpiracao(token) {
  try {
    const partePayload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (partePayload.length % 4)) % 4);
    const payload = JSON.parse(atob(partePayload + padding));
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export async function fazerLogin(email, senha) {
  const resposta = await api.post("/auth/login", { email, senha });

  const dados = resposta.data;
  const token = dados.token || dados.accessToken;
  const usuario = dados.usuario || dados.user || null;

  if (token) {
    localStorage.setItem("jes_token", token);
    const expiracao = obterExpiracao(token);
    if (expiracao) localStorage.setItem(TOKEN_EXPIRATION_KEY, String(expiracao));
  }

  if (usuario) {
    localStorage.setItem("jes_usuario", JSON.stringify(usuario));
  }

  return dados;
}

export function sair() {
  localStorage.removeItem("jes_token");
  localStorage.removeItem(TOKEN_EXPIRATION_KEY);
  localStorage.removeItem("jes_usuario");
}

export function obterToken() {
  const token = localStorage.getItem("jes_token");
  const expiracaoSalva = Number(localStorage.getItem(TOKEN_EXPIRATION_KEY));
  const expiracao = expiracaoSalva || obterExpiracao(token);
  if (token && expiracao && Date.now() >= expiracao) {
    sair();
    return null;
  }
  if (token && expiracao && !expiracaoSalva) localStorage.setItem(TOKEN_EXPIRATION_KEY, String(expiracao));
  return token;
}

export function obterUsuario() {
  const usuario = localStorage.getItem("jes_usuario");
  return usuario ? JSON.parse(usuario) : null;
}