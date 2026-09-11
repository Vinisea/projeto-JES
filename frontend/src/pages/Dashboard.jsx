import AdminLayout from "../components/AdminLayout.jsx";
import { useEffect, useState } from "react";
import { buscarResumoDashboard } from "../services/dashboardService.js";
import { listarPartidas } from "../services/partidaService.js";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [resumo, setResumo] = useState(null);
  const [partidas, setPartidas] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    Promise.all([buscarResumoDashboard(), listarPartidas()])
      .then(([dadosResumo, dadosPartidas]) => {
        setResumo(dadosResumo);
        setPartidas(dadosPartidas.slice(0, 3));
      })
      .catch(() => setErro("Não foi possível carregar os dados do dashboard."));
  }, []);

  const stats = resumo
    ? [
        { label: "Modalidades", value: resumo.modalidades, detail: "Cadastradas", color: "orange" },
        { label: "Atletas", value: resumo.atletas, detail: "Inscritos", color: "blue" },
        { label: "Equipes", value: resumo.equipes, detail: "Participantes", color: "lime" },
        { label: "Partidas", value: resumo.partidas, detail: "Agendadas", color: "purple" },
      ]
    : [];

  return (
    <AdminLayout
      title="Dashboard"
      description="Visão geral dos Jogos Internos JES 2026."
    >
      {erro && <div className="empty-state">{erro}</div>}
      <section className="stats-grid">
        {stats.map((stat) => (
          <article className={`stat-card ${stat.color}`} key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            <small>{stat.detail}</small>
          </article>
        ))}
      </section>
      <section className="admin-panels">
        <article className="admin-panel">
          <div className="panel-heading">
            <h2>Próximas partidas</h2>
            <span>Ver todas</span>
          </div>
          {partidas.map((partida) => (
            <div className="admin-match" key={partida.id_confronto}>
              <span className="match-time">{new Date(partida.data_hora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
              <div>
                <strong>{partida.equipe_mandante?.nome_equipe} <small>vs</small> {partida.equipe_visitante?.nome_equipe}</strong>
                <small>{partida.modalidade?.nome_modalidade} • {partida.local_partida}</small>
              </div>
              <span className="match-badge">{partida.status_confronto}</span>
            </div>
          ))}
          {!partidas.length && resumo && <div className="empty-state">Nenhuma partida cadastrada.</div>}
        </article>
        <article className="admin-panel">
          <div className="panel-heading">
            <h2>Ações rápidas</h2>
          </div>
          <div className="quick-actions">
            <Link to="/admin/partidas">+ Nova partida</Link>
            <Link to="/admin/atletas">+ Cadastrar atleta</Link>
            <Link to="/admin/equipes">+ Criar equipe</Link>
          </div>
        </article>
      </section>
    </AdminLayout>
  );
}
