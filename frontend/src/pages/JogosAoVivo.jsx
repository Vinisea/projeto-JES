import { useEffect, useState } from "react";
import api from "../services/api.js";

function normalizarJogo(item) {
  const status = item.status_confronto || item.status || "Agendado";
  const aoVivo = status.toLowerCase().includes("andamento");

  return {
    id: item.id_confronto || item.id,
    time: item.data_hora?.slice?.(11, 16) || "--:--",
    sport: item.modalidade?.nome_modalidade || item.nome_modalidade || "Modalidade",
    court: item.local_partida || item.local || "Local a definir",
    home: item.equipe_mandante?.nome_equipe || item.equipeA || "Equipe A",
    away: item.equipe_visitante?.nome_equipe || item.equipeB || "Equipe B",
    status: aoVivo ? "Ao vivo" : "Próximo",
    homeScore: item.placar_equipe_1 ?? null,
    awayScore: item.placar_equipe_2 ?? null,
  };
}

function extrairJogos(resposta) {
  const dados = resposta?.data ?? resposta;
  if (Array.isArray(dados)) return dados;
  return dados?.partidas || dados?.confrontos || dados?.data || [];
}

export default function JogosAoVivo() {
  const [tab, setTab] = useState("Ao vivo");
  const [jogos, setJogos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarJogos() {
      try {
        const resposta = await api.get("/public/partidas");
        setJogos(extrairJogos(resposta).map(normalizarJogo));
      } catch (error) {
        console.error("Não foi possível carregar os jogos ao vivo.", error);
        setJogos([]);
      } finally {
        setCarregando(false);
      }
    }

    carregarJogos();
  }, []);

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
        {carregando ? <div className="empty-state">Carregando jogos...</div> : visibleGames.map((game) => (
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
