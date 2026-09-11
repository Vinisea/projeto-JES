import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";

const resumoDemo = { modalidades: 5, equipes: 24, partidas: 36, concluidas: 12 };
const partidasDemo = [
  { id: "d1", modalidade: "Futsal", grupo: "Grupo A", equipeA: "1º EM A", equipeB: "1º EM B", horario: "10:00", local: "Quadra 1", status: "Agendada" },
  { id: "d2", modalidade: "Voleibol", grupo: "Grupo B", equipeA: "8º A", equipeB: "8º B", horario: "11:30", local: "Quadra 2", status: "Agendada" },
  { id: "d3", modalidade: "Fut7", grupo: "Grupo A", equipeA: "2º EM A", equipeB: "2º EM B", horario: "09:00", local: "Campo 1", status: "Em andamento" },
];

function lista(resposta, chaves = []) {
  const dados = resposta?.data ?? resposta;
  if (Array.isArray(dados)) return dados;
  for (const chave of chaves) if (Array.isArray(dados?.[chave])) return dados[chave];
  return Array.isArray(dados?.data) ? dados.data : [];
}

function textoPartida(item) {
  return {
    id: item.id_partida || item.id_confronto || item.id,
    modalidade: item.nome_modalidade || item.modalidade?.nome_modalidade || item.modalidade || "Modalidade",
    grupo: item.nome_grupo || item.grupo?.nome_grupo || item.grupo || "Grupo",
    equipeA: item.equipeA || item.equipe_1?.nome_equipe || item.equipe_a?.nome_equipe || "Equipe A",
    equipeB: item.equipeB || item.equipe_2?.nome_equipe || item.equipe_b?.nome_equipe || "Equipe B",
    horario: item.horario || item.data_hora?.slice?.(11, 16) || "--:--",
    local: item.local || item.local_partida || "Local a definir",
    status: item.status || item.status_confronto || "Agendada",
  };
}

export default function DashboardCompeticao() {
  const [resumo, setResumo] = useState(resumoDemo);
  const [partidas, setPartidas] = useState(partidasDemo);
  const [carregando, setCarregando] = useState(true);
  const [modoDemo, setModoDemo] = useState(false);

  useEffect(() => {
    async function carregar() {
      try {
        const [dashboardResponse, partidasResponse] = await Promise.all([
          api.get("/dashboard"),
          api.get("/public/partidas"),
        ]);
        const dados = dashboardResponse.data?.dados || dashboardResponse.data || {};
        const partidasReais = lista(partidasResponse, ["partidas", "confrontos"]).map(textoPartida);
        setResumo({
          modalidades: dados.modalidades ?? dados.total_modalidades ?? resumoDemo.modalidades,
          equipes: dados.equipes ?? dados.total_equipes ?? resumoDemo.equipes,
          partidas: dados.partidas ?? dados.total_partidas ?? resumoDemo.partidas,
          concluidas: dados.concluidas ?? dados.jogos_concluidos ?? resumoDemo.concluidas,
        });
        if (partidasReais.length) setPartidas(partidasReais);
      } catch (error) {
        console.warn("Dashboard da competição usando dados de demonstração.", error);
        setModoDemo(true);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  const acontecendo = partidas.filter((partida) => partida.status.toLowerCase().includes("andamento"));
  const proximas = partidas.filter((partida) => !partida.status.toLowerCase().includes("andamento"));
  const cards = [
    { label: "Modalidades", value: resumo.modalidades, color: "orange" },
    { label: "Equipes", value: resumo.equipes, color: "blue" },
    { label: "Partidas", value: resumo.partidas, color: "lime" },
    { label: "Jogos concluídos", value: resumo.concluidas, color: "purple" },
  ];

  if (carregando) return <main className="page-shell competition-page"><div className="empty-state">Carregando dashboard da competição...</div></main>;

  return (
    <main className="page-shell competition-page">
      <section className="competition-header"><div><span className="eyebrow">VISÃO GERAL</span><h1>Dashboard da competição</h1><p>Acompanhe o andamento dos Jogos Internos JES 2026.</p></div><Link className="secondary-button" to="/partidas">Gerenciar partidas</Link></section>
      {modoDemo && <div className="offline-notice">Exibindo resumo de demonstração. A API pode ser conectada sem alterar esta tela.</div>}
      <section className="competition-stats">{cards.map((card) => <article className={`competition-stat ${card.color}`} key={card.label}><span>{card.label}</span><strong>{card.value}</strong><small>Atualizado agora</small></article>)}</section>
      <section className="competition-columns">
        <article className="competition-panel"><div className="competition-panel-heading"><div><span className="eyebrow">AGENDA</span><h2>Próximas partidas</h2></div><Link to="/partidas">Ver todas</Link></div>{proximas.length ? proximas.map((partida) => <div className="competition-match" key={partida.id}><div className="competition-match-time"><strong>{partida.horario}</strong><small>{partida.local}</small></div><div><span>{partida.modalidade} · {partida.grupo}</span><strong>{partida.equipeA} <em>×</em> {partida.equipeB}</strong></div></div>) : <div className="empty-state">Nenhuma próxima partida.</div>}</article>
        <article className="competition-panel live-panel"><div className="competition-panel-heading"><div><span className="eyebrow live-eyebrow">AO VIVO</span><h2>Partidas acontecendo agora</h2></div><span className="live-pulse">●</span></div>{acontecendo.length ? acontecendo.map((partida) => <div className="live-match" key={partida.id}><span className="live-dot" /><div><span>{partida.modalidade} · {partida.local}</span><strong>{partida.equipeA} <em>×</em> {partida.equipeB}</strong></div><b>Em jogo</b></div>) : <div className="live-empty"><span>◷</span><strong>Nenhuma partida acontecendo</strong><small>Quando um jogo começar, ele aparecerá aqui.</small></div>}</article>
      </section>
      <p className="dashboard-note">Os dados são atualizados quando a página é carregada.</p>
    </main>
  );
}
