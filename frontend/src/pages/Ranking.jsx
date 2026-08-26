const teams = [
  { position: 1, team: "9º B", country: "Espanha", points: 150, games: 8, color: "orange" },
  { position: 2, team: "9º A", country: "Inglaterra", points: 100, games: 8, color: "lime" },
  { position: 3, team: "2º EM A", country: "Argentina", points: 70, games: 7, color: "purple" },
  { position: 4, team: "1º EM B", country: "Brasil", points: 55, games: 6, color: "blue" },
  { position: 5, team: "8º A", country: "Portugal", points: 40, games: 6, color: "red" },
];

export default function Ranking() {
  return (
    <main className="page-shell inner-page">
      <section className="inner-header">
        <span className="eyebrow">JES 2026</span>
        <h1>Classificação geral</h1>
        <p>Acompanhe a pontuação das turmas nos Jogos Internos SESI.</p>
      </section>

      <section className="table-card">
        <div className="table-title"><h2>Liderança geral</h2><span>Atualizado hoje</span></div>
        <div className="classification-table">
          <div className="table-row table-head"><span>#</span><span>Equipe</span><span>Jogos</span><span>Pontos</span></div>
          {teams.map((item) => (
            <div className="table-row" key={item.team}>
              <span className={`rank-number ${item.color}`}>{item.position}</span>
              <span className="team-name"><strong>{item.team}</strong><small>• {item.country}</small></span>
              <span>{item.games}</span>
              <strong>{item.points} pts</strong>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}