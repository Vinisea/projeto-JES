import { useState } from "react";
import { Link } from "react-router-dom";

const modalidades = [
  { name: "Futmesa", type: "Dupla", category: "Duplas", color: "orange", icon: "◎" },
  { name: "Voleibol Masculino", type: "Coletivo • masculino", category: "Coletivos", color: "lime", icon: "◉" },
  { name: "Voleibol Feminino", type: "Coletivo • feminino", category: "Coletivos", color: "blue", icon: "◉" },
  { name: "Queimado Feminino", type: "Coletivo • feminino", category: "Coletivos", color: "red", icon: "◎" },
  { name: "Queimado Masculino", type: "Coletivo • masculino", category: "Coletivos", color: "purple", icon: "◎" },
  { name: "Fut7 Masculino", type: "Coletivo • masculino", category: "Coletivos", color: "orange", icon: "◉" },
  { name: "Fut7 Feminino", type: "Coletivo • feminino", category: "Coletivos", color: "lime", icon: "◉" },
  { name: "Atletismo 100m", type: "Individual", category: "Individuais", color: "blue", icon: "♧" },
];

const filters = ["Todas", "Coletivos", "Individuais", "Duplas"];

export default function Modalidades() {
  const [selectedFilter, setSelectedFilter] = useState("Todas");

  const visibleSports = selectedFilter === "Todas"
    ? modalidades
    : modalidades.filter((item) => item.category === selectedFilter);

  return (
    <main className="page-shell inner-page">
      <section className="inner-header">
        <span className="eyebrow">JES 2026</span>
        <h1>Modalidades</h1>
        <p>Tema: Campeões da Copa do Mundo. Escolha um esporte para ver jogadores, jogos e classificação.</p>
      </section>

      <div className="filters" aria-label="Filtrar modalidades">
        {filters.map((filter) => (
          <button
            key={filter}
            className={selectedFilter === filter ? "filter-button selected" : "filter-button"}
            onClick={() => setSelectedFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <section className="sports-grid inner-grid">
        {visibleSports.map((sport) => (
          <Link className="sport-card" to="/ao-vivo" key={sport.name}>
            <span className={`sport-line ${sport.color}`} />
            <span className={`sport-icon ${sport.color}`}>{sport.icon}</span>
            <span className="sport-content">
              <strong>{sport.name}</strong>
              <small>{sport.type}</small>
            </span>
            <span className="card-arrow">›</span>
          </Link>
        ))}
      </section>

      {visibleSports.length === 0 && (
        <div className="empty-state">Nenhuma modalidade encontrada.</div>
      )}
    </main>
  );
}