import AdminLayout from "../components/AdminLayout.jsx";
import { useEffect, useState } from "react";
import { buscarResumoDashboard } from "../services/dashboardService.js";

const stats = [
  { label: "Modalidades", value: "8", detail: "Cadastradas", color: "orange" },
  { label: "Atletas", value: "126", detail: "Inscritos", color: "blue" },
  { label: "Equipes", value: "24", detail: "Participantes", color: "lime" },
  { label: "Partidas", value: "32", detail: "Agendadas", color: "purple" },
];

export default function Dashboard() {
  return (
    
    <AdminLayout title="Dashboard" description="Visão geral dos Jogos Internos JES 2026.">
      <section className="stats-grid">{stats.map((stat) => <article className={`stat-card ${stat.color}`} key={stat.label}><span>{stat.label}</span><strong>{stat.value}</strong><small>{stat.detail}</small></article>)}</section>
      <section className="admin-panels">
        <article className="admin-panel"><div className="panel-heading"><h2>Próximas partidas</h2><span>Ver todas</span></div><div className="admin-match"><span className="match-time">09:00</span><div><strong>9º B <small>vs</small> 9º A</strong><small>Voleibol Masculino • Quadra 1</small></div><span className="match-badge">Hoje</span></div><div className="admin-match"><span className="match-time">10:30</span><div><strong>2º EM A <small>vs</small> 1º EM B</strong><small>Fut7 Masculino • Campo 1</small></div><span className="match-badge">Hoje</span></div></article>
        <article className="admin-panel"><div className="panel-heading"><h2>Ações rápidas</h2></div><div className="quick-actions"><button>+ Nova partida</button><button>+ Cadastrar atleta</button><button>+ Criar equipe</button></div></article>
      </section>
    </AdminLayout>
  );
}