import { useState } from "react";

const jogos = [
  {
    time: "09:00",
    sport: "Voleibol Masculino",
    court: "Quadra 1",
    home: "2º B",
    away: "1º A",
    status: "Ao vivo",
    homeScore: 2,
    awayScore: 1,
  },
  {
    time: "10:30",
    sport: "Fut7 Masculino",
    court: "Campo 1",
    home: "2º  A",
    away: "3º  B",
    status: "Próximo",
    homeScore: null,
    awayScore: null,
  },
  {
    time: "13:30",
    sport: "Queimado Feminino",
    court: "Quadra 2",
    home: "1º A",
    away: "1º B",
    status: "Próximo",
    homeScore: null,
    awayScore: null,
  },
];

export default function JogosAoVivo() {
  const [tab, setTab] = useState("Ao vivo");
  const visibleGames = jogos.filter((game) =>
    tab === "Ao vivo" ? game.status === "Ao vivo" : game.status === "Próximo",
  );

  return (
    <main className="page-shell inner-page">
      <section className="inner-header">
        <span className="eyebrow">JES 2026</span>
        <h1>
          <span className="live-dot" /> Jogos ao vivo
        </h1>
        <p>Acompanhe os confrontos que estão acontecendo agora.</p>
      </section>

      <div className="filters">
        {["Ao vivo", "Próximos jogos"].map((item) => (
          <button
            key={item}
            className={
              tab === item ? "filter-button selected" : "filter-button"
            }
            onClick={() => setTab(item)}
          >
            {item === "Ao vivo" ? "◉" : "□"} &nbsp; {item}
          </button>
        ))}
      </div>

      <section className="games-list">
        {visibleGames.map((game) => (
          <article className="game-card" key={`${game.time}-${game.sport}`}>
            <div className="game-meta">
              <span
                className={
                  game.status === "Ao vivo" ? "status live" : "status next"
                }
              >
                {game.status}
              </span>
              <span>
                {game.time} • {game.court}
              </span>
            </div>
            <div className="game-body">
              <div>
                <strong>{game.home}</strong>
                <small>{game.sport}</small>
              </div>
              <div className="score">
                {game.homeScore ?? "–"} <span>x</span> {game.awayScore ?? "–"}
              </div>
              <div className="away">
                <strong>{game.away}</strong>
                <small>JES 2026</small>
              </div>
            </div>
          </article>
        ))}
        {visibleGames.length === 0 && (
          <div className="empty-state">Nenhum jogo nesta categoria.</div>
        )}
      </section>
    </main>
  );
}
