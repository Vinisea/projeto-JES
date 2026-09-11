import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarModalidades } from "../../services/modalidadeService.js";
import { buscarRankingGeral } from "../../services/rankingService.js";
import { listarPartidas } from "../../services/partidaService.js";

const colors = ["orange", "lime", "blue", "red", "purple"];

function SportCard({ sport }) {
  return (
    <Link className="sport-card" to="/modalidades">
      <span className={`sport-line ${sport.color}`} />
      <span className={`sport-icon ${sport.color}`} aria-hidden="true">{sport.icon}</span>
      <span className="sport-content">
        <strong>{sport.name}</strong>
        <small>{sport.type}</small>
      </span>
      <span className="card-arrow" aria-hidden="true">›</span>
    </Link>
  );
}

export function MainLayout() {
  const [sports, setSports] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [partidas, setPartidas] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    Promise.allSettled([listarModalidades(), buscarRankingGeral(), listarPartidas()])
      .then(([modalidadesResult, rankingResult, partidasResult]) => {
        if (modalidadesResult.status === "fulfilled") setSports(modalidadesResult.value);
        if (rankingResult.status === "fulfilled") setRanking(rankingResult.value.ranking || []);
        if (partidasResult.status === "fulfilled") {
          setPartidas(partidasResult.value.filter((partida) => partida.status_confronto !== "Finalizado").slice(0, 3));
        }
        if ([modalidadesResult, rankingResult, partidasResult].some((result) => result.status === "rejected")) {
          setErro("Alguns dados dos jogos não puderam ser carregados.");
        }
      });
  }, []);

  const maiorPontuacao = Math.max(...ranking.map((item) => item.pontos_gerais), 1);

  return (
    <main>
      <section className="hero page-shell">
        <div className="shape shape-orange shape-one" />
        <div className="shape shape-blue shape-two" />
        <div className="shape shape-green shape-three" />
        <div className="shape shape-pink shape-four" />
        <div className="shape shape-lilac shape-five" />
        <div className="hero-content">
          <span className="eyebrow">SESI • JOGOS INTERNOS</span>
          <h1>JES 2026</h1>
          <p>A copa é da nossa escola.<br />Suor, torcida e uma taça pra chamar de nossa.</p>
          <div className="hero-actions">
            <Link className="primary-button" to="/ao-vivo">◉ &nbsp; Jogos ao vivo</Link>
            <Link className="secondary-button" to="/classificacao">⌁ &nbsp; Classificação geral</Link>
          </div>
        </div>
      </section>

      <section className="page-shell content-section">
        <div className="section-heading">
          <h2>Modalidades</h2>
          <Link to="/modalidades">Ver todas →</Link>
        </div>
        <div className="sports-grid">
          {sports.map((sport, index) => (
            <SportCard
              key={sport.id_modalidade}
              sport={{
                name: sport.nome_modalidade,
                type: sport.categoria,
                color: colors[index % colors.length],
                icon: "◉",
              }}
            />
          ))}
          {!sports.length && !erro && <div className="empty-state">Carregando modalidades...</div>}
        </div>
      </section>

      {erro && <div className="page-shell empty-state">{erro}</div>}

      <section className="page-shell content-section home-matches">
        <div className="section-heading">
          <h2>Próximos confrontos</h2>
          <Link to="/ao-vivo">Ver jogos →</Link>
        </div>
        <div className="home-match-list">
          {partidas.map((partida) => (
            <Link className="home-match" to="/chaveamento" key={partida.id_confronto}>
              <span>{new Date(partida.data_hora).toLocaleDateString("pt-BR")}</span>
              <strong>{partida.equipe_mandante?.nome_equipe} <small>x</small> {partida.equipe_visitante?.nome_equipe}</strong>
              <small>{partida.modalidade?.nome_modalidade} • {partida.fase}</small>
            </Link>
          ))}
          {!partidas.length && <div className="empty-state">Nenhum confronto agendado.</div>}
        </div>
      </section>

      <section className="page-shell content-section ranking-section">
        <div className="section-heading">
          <h2>Liderança geral</h2>
        </div>
        <div className="ranking-card">
          {ranking.slice(0, 3).map((item, index) => (
            <div className="ranking-row" key={item.equipe}>
              <span className={`rank-number ${colors[index % colors.length]}`}>{item.posicao}</span>
              <div className="rank-info">
                <div className="rank-label">
                  <span><strong>{item.equipe}</strong> <em>• JES 2026</em></span>
                  <strong>{item.pontos_gerais} pts</strong>
                </div>
                <div className="rank-track"><span className={`rank-fill ${colors[index % colors.length]}`} style={{ width: `${(item.pontos_gerais / maiorPontuacao) * 100}%` }} /></div>
              </div>
            </div>
          ))}
          {!ranking.length && <div className="empty-state">Ainda não há resultados finalizados.</div>}
        </div>
      </section>
    </main>
  );
}