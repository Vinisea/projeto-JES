import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarModalidades } from "../services/modalidadeService.js";

const colors = ["orange", "lime", "blue", "red", "purple"];

export default function Modalidades() {
  const [selectedFilter, setSelectedFilter] = useState("Todas");
  const [modalidades, setModalidades] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    listarModalidades()
      .then(setModalidades)
      .catch(() => setErro("Não foi possível carregar as modalidades."));
  }, []);

  const filters = ["Todas", ...new Set(modalidades.map((item) => item.categoria))];

  const visibleSports =
    selectedFilter === "Todas"
      ? modalidades
      : modalidades.filter((item) => item.categoria === selectedFilter);

  return (
    <main className="page-shell inner-page">
      <section className="inner-header">
        <span className="eyebrow">JES 2026</span>
        <h1>Modalidades</h1>
        <p>
          Tema: Campeões da Copa do Mundo. Escolha um esporte para ver
          jogadores, jogos e classificação.
        </p>
      </section>

      <div className="filters" aria-label="Filtrar modalidades">
        {filters.map((filter) => (
          <button
            key={filter}
            className={
              selectedFilter === filter
                ? "filter-button selected"
                : "filter-button"
            }
            onClick={() => setSelectedFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <section className="sports-grid inner-grid">
        {visibleSports.map((sport, index) => (
          <Link className="sport-card" to="/ao-vivo" key={sport.id_modalidade}>
            <span className={`sport-line ${colors[index % colors.length]}`} />
            <span className={`sport-icon ${colors[index % colors.length]}`}>◉</span>
            <span className="sport-content">
              <strong>{sport.nome_modalidade}</strong>
              <small>{sport.categoria}</small>
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
