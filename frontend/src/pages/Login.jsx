import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  async function entrar(event) {
    event.preventDefault();
    setErro("");

    if (!email || !senha) {
      setErro("Preencha e-mail e senha.");
      return;
    }

    try {
      setCarregando(true);
      await login(email, senha);
      const destino = location.state?.from || "/admin";
      navigate(destino, { replace: true });
    } catch (error) {
      console.error("Erro no login:", error);
      setErro("Não foi possível entrar. Confira o backend e seus dados.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <Link className="login-brand" to="/">
          <span className="brand-mark">SESI</span>
          <span>
            <strong>JES 2026</strong>
            <small>Jogos Internos</small>
          </span>
        </Link>
        <span className="eyebrow">ÁREA RESTRITA</span>
        <h1>Entrar na arbitragem</h1>
        <p className="login-description">
          Acesse o painel para organizar jogos, equipes e resultados.
        </p>

        <form onSubmit={entrar} className="login-form">
          <label htmlFor="email">Usuario</label>
          <input
            id="email"
            type="email"
            placeholder="Usuario"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
          />
          {erro && <div className="form-error">{erro}</div>}
          <button className="login-button" type="submit" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar no painel"}
          </button>
        </form>

        <Link className="back-link" to="/">
          ← Voltar ao Inicio
        </Link>
      </section>
    </main>
  );
}
