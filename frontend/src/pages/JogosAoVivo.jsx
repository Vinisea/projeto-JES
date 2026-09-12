import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { listarPartidas } from "../services/partidaService.js";

export default function JogosAoVivo() {
  const [tab, setTab] = useState("Ao vivo");
  const [jogos, setJogos] = useState([]);
  const [erro, setErro] = useState("");
  const [searchParams] = useSearchParams();
  const modalidade = searchParams.get("modalidade") || "";

  useEffect(() => {
    listarPartidas(modalidade ? { modalidade } : {})
      .then(setJogos)
      .catch(() => setErro("Não foi possível carregar os jogos."));
  }, [modalidade]);

  const visibleGames = jogos.filter((game) =>
    tab === "Ao vivo" ? game.status_confronto === "Em andamento" : game.status_confronto === "Agendado",
  );

  return (
    <main className="page-shell inner-page">
      <section className="inner-header">
        <span className="eyebrow">JES 2026</span>
        <h1>
          <span className="live-dot" /> {modalidade ? "Jogos da modalidade" : "Jogos ao vivo"}
        </h1>
        <p>Acompanhe os confrontos que estão acontecendo agora{modalidade ? " nesta modalidade" : ""}.</p>
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

      {erro && <div className="empty-state">{erro}</div>}

      <section className="games-list">
        {visibleGames.map((game) => (
          <article className="game-card" key={game.id_confronto}>
            <div className="game-meta">
              <span
                className={
                  game.status_confronto === "Em andamento" ? "status live" : "status next"
                }
              >
                {game.status_confronto === "Em andamento" ? "Ao vivo" : "Próximo"}
              </span>
              <span>
                {new Date(game.data_hora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} • {game.local_partida}
              </span>
            </div>
            <div className="game-body">
              <div>
                <strong>{game.equipe_mandante?.nome_equipe}</strong>
                <small>{game.modalidade?.nome_modalidade}</small>
              </div>
              <div className="score">
                {game.placar_equipe_1 ?? "-"} <span>x</span> {game.placar_equipe_2 ?? "-"}
              </div>
              <div className="away">
                <strong>{game.equipe_visitante?.nome_equipe}</strong>
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
