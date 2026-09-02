import { createContext, useContext, useMemo, useState } from "react";
import {
  fazerLogin,
  sair,
  obterToken,
  obterUsuario,
} from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(obterToken());
  const [usuario, setUsuario] = useState(obterUsuario());

  async function login(email, senha) {
    const dados = await fazerLogin(email, senha);
    setToken(dados.token || dados.accessToken || null);
    setUsuario(dados.usuario || dados.user || null);
    return dados;
  }

  function logout() {
    sair();
    setToken(null);
    setUsuario(null);
  }

  const valor = useMemo(
    () => ({
      token,
      usuario,
      autenticado: Boolean(token),
      login,
      logout,
    }),
    [token, usuario],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error("useAuth precisa ser usado dentro de AuthProvider");
  }

  return contexto;
}
