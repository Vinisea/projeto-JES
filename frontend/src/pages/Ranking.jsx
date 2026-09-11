const teams = [
  {
    position: 1,
    team: "3º D",
    country: "Espanha",
    points: 150,
    games: 8,
    color: "orange",
  },
  {
    position: 2,
    team: "3º A",
    country: "Espanha",
    points: 100,
    games: 8,
    color: "lime",
  },
  {
    position: 3,
    team: "3º B",
    country: "Espanha",
    points: 70,
    games: 7,
    color: "purple",
  },
  {
    position: 4,
    team: "3º C",
    country: "Espanha",
    points: 55,
    games: 6,
    color: "blue",
  },
  {
    position: 5,
    team: "3º E",
    country: "Espanha",
    points: 40,
    games: 6,
    color: "red",
  },
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
        <div className="table-title">
          <h2>Liderança geral</h2>
          <span>Atualizado hoje</span>
        </div>
        <div className="classification-table">
          <div className="table-row table-head">
            <span>#</span>
            <span>Equipe</span>
            <span>Jogos</span>
            <span>Pontos</span>
          </div>
          {teams.map((item) => (
            <div className="table-row" key={item.team}>
              <span className={`rank-number ${item.color}`}>
                {item.position}
              </span>
              <span className="team-name">
                <strong>{item.team}</strong>
                <small>• {item.country}</small>
              </span>
              <span>{item.games}</span>
              <strong>{item.points} pts</strong>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
