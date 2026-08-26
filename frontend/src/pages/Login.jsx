import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  function entrar(event) {
    event.preventDefault();
    setErro("");

    if (!email || !senha) {
      setErro("Preencha e-mail e senha.");
      return;
    }

    navigate("/admin");
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <Link className="login-brand" to="/">
          <span className="brand-mark">SESI</span>
          <span><strong>JES 2026</strong><small>Jogos Internos</small></span>
        </Link>
        <span className="eyebrow">ÁREA RESTRITA</span>
        <h1>Entrar na arbitragem</h1>
        <p className="login-description">Acesse o painel para organizar jogos, equipes e resultados.</p>

        <form onSubmit={entrar} className="login-form">
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(event) => setEmail(event.target.value)} />
          <label htmlFor="senha">Senha</label>
          <input id="senha" type="password" placeholder="Digite sua senha" value={senha} onChange={(event) => setSenha(event.target.value)} />
          {erro && <div className="form-error">{erro}</div>}
          <button className="login-button" type="submit">Entrar no painel</button>
        </form>

        <Link className="back-link" to="/">← Voltar para o site público</Link>
      </section>
    </main>
  );
}