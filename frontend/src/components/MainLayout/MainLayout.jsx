import { Link } from "react-router-dom";

const sports = [
  { name: "Futmesa", type: "Dupla", color: "orange", icon: "◎" },
  { name: "Voleibol Masculino", type: "Coletivo • masculino", color: "lime", icon: "◉" },
  { name: "Voleibol Feminino", type: "Coletivo • feminino", color: "blue", icon: "◉" },
  { name: "Queimado Feminino", type: "Coletivo • feminino", color: "red", icon: "◎" },
  { name: "Queimado Masculino", type: "Coletivo • masculino", color: "purple", icon: "◎" },
  { name: "Fut7 Masculino", type: "Coletivo • masculino", color: "orange", icon: "◉" },
  { name: "Fut7 Feminino", type: "Coletivo • feminino", color: "lime", icon: "◉" },
  { name: "Atletismo 100m", type: "Individual", color: "blue", icon: "♧" },
];

const ranking = [
  { position: 1, team: "9º B", country: "Espanha", points: 150, color: "orange", width: "100%" },
  { position: 2, team: "9º A", country: "Inglaterra", points: 100, color: "lime", width: "67%" },
  { position: 3, team: "2º EM A", country: "Argentina", points: 70, color: "purple", width: "47%" },
];

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
          {sports.map((sport) => <SportCard key={sport.name} sport={sport} />)}
        </div>
      </section>

      <section className="page-shell content-section ranking-section">
        <div className="section-heading">
          <h2>Liderança geral</h2>
        </div>
        <div className="ranking-card">
          {ranking.map((item) => (
            <div className="ranking-row" key={item.position}>
              <span className={`rank-number ${item.color}`}>{item.position}</span>
              <div className="rank-info">
                <div className="rank-label">
                  <span><strong>{item.team}</strong> <em>• {item.country}</em></span>
                  <strong>{item.points} pts</strong>
                </div>
                <div className="rank-track"><span className={`rank-fill ${item.color}`} style={{ width: item.width }} /></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}