import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";

const partidasDemo = [
  { id: "p1", modalidade: "Futsal", grupo: "Grupo A", equipeA: "1º EM A", equipeB: "1º EM B", data: "2026-09-10", horario: "10:00", local: "Quadra 1", status: "Agendada" },
  { id: "p2", modalidade: "Voleibol", grupo: "Grupo B", equipeA: "8º A", equipeB: "8º B", data: "2026-09-10", horario: "11:30", local: "Quadra 2", status: "Agendada" },
  { id: "p3", modalidade: "Fut7", grupo: "Grupo A", equipeA: "2º EM A", equipeB: "2º EM B", data: "2026-09-11", horario: "09:00", local: "Campo 1", status: "Em andamento" },
];

const camposIniciais = { modalidade: "Futsal", grupo: "Grupo A", equipeA: "", equipeB: "", data: "", horario: "", local: "Quadra 1" };

function normalizarPartida(item, index = 0) {
  return {
    id: item.id_partida || item.id_confronto || item.id || `partida-${index}`,
    modalidade: item.nome_modalidade || item.modalidade?.nome_modalidade || item.modalidade || "Futsal",
    grupo: item.nome_grupo || item.grupo?.nome_grupo || item.grupo || "Grupo A",
    equipeA: item.equipeA || item.equipe_a?.nome_equipe || item.equipe_1?.nome_equipe || "Equipe A",
    equipeB: item.equipeB || item.equipe_b?.nome_equipe || item.equipe_2?.nome_equipe || "Equipe B",
    data: item.data || item.data_hora?.slice?.(0, 10) || "",
    horario: item.horario || item.data_hora?.slice?.(11, 16) || "",
    local: item.local || item.local_partida || "A definir",
    status: item.status || item.status_confronto || "Agendada",
  };
}

function extrairLista(resposta) {
  const dados = resposta?.data ?? resposta;
  if (Array.isArray(dados)) return dados;
  return dados?.partidas || dados?.confrontos || dados?.data || dados?.rows || [];
}

export default function Partidas() {
  const [partidas, setPartidas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modoDemo, setModoDemo] = useState(false);
  const [erro, setErro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [filtros, setFiltros] = useState({ modalidade: "Todas", grupo: "Todos", data: "", status: "Todos" });
  const [campos, setCampos] = useState(camposIniciais);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function carregarPartidas() {
      try {
        const resposta = await api.get("/public/partidas");
        setPartidas(extrairLista(resposta).map(normalizarPartida));
        setModoDemo(false);
      } catch (error) {
        console.warn("API de partidas indisponível; usando demonstração.", error);
        setPartidas(partidasDemo);
        setModoDemo(true);
      } finally {
        setCarregando(false);
      }
    }
    carregarPartidas();
  }, []);

  const modalidades = useMemo(() => ["Todas", ...new Set(partidas.map((partida) => partida.modalidade))], [partidas]);
  const grupos = useMemo(() => ["Todos", ...new Set(partidas.map((partida) => partida.grupo))], [partidas]);
  const partidasFiltradas = partidas.filter((partida) =>
    (filtros.modalidade === "Todas" || partida.modalidade === filtros.modalidade) &&
    (filtros.grupo === "Todos" || partida.grupo === filtros.grupo) &&
    (!filtros.data || partida.data === filtros.data) &&
    (filtros.status === "Todos" || partida.status === filtros.status),
  );

  function abrirNovaPartida() { setEditando(null); setCampos(camposIniciais); setErro(""); setModalAberto(true); }
  function abrirEdicao(partida) { setEditando(partida); setCampos({ ...partida }); setErro(""); setModalAberto(true); }
  function alterarCampo(event) { setCampos((atuais) => ({ ...atuais, [event.target.name]: event.target.value })); }

  async function salvarPartida(event) {
    event.preventDefault();
    if (!campos.equipeA.trim() || !campos.equipeB.trim() || !campos.data || !campos.horario) { setErro("Preencha equipes, data e horário."); return; }
    setSalvando(true);
    try {
      if (!modoDemo) {
        const payload = { ...campos, status: editando?.status || "Agendada" };
        if (editando) await api.put(`/confrontos/${editando.id}`, payload);
        else await api.post("/confrontos", payload);
      }
      const partidaLocal = normalizarPartida({ ...campos, id: editando?.id || `local-${Date.now()}`, status: editando?.status || "Agendada" });
      setPartidas((atuais) => editando ? atuais.map((item) => item.id === editando.id ? partidaLocal : item) : [...atuais, partidaLocal]);
      setModalAberto(false);
    } catch (error) { console.error(error); setErro("Não foi possível salvar. Confira a rota da API de partidas."); }
    finally { setSalvando(false); }
  }

  async function cancelarPartida(partida) {
    if (!window.confirm(`Cancelar a partida ${partida.equipeA} x ${partida.equipeB}?`)) return;
    try {
      if (!modoDemo) await api.delete(`/confrontos/${partida.id}`);
      setPartidas((atuais) => atuais.map((item) => item.id === partida.id ? { ...item, status: "Cancelada" } : item));
    } catch (error) { console.error(error); setErro("Não foi possível cancelar a partida."); }
  }

  return (
    <main className="page-shell matches-page">
      <section className="matches-header"><div><span className="eyebrow">ORGANIZAÇÃO DA COMPETIÇÃO</span><h1>Partidas</h1><p>Crie e acompanhe os confrontos dos Jogos Internos.</p></div><button className="primary-button" type="button" onClick={abrirNovaPartida}>+ Nova partida</button></section>
      {modoDemo && <div className="offline-notice">Exibindo partidas de demonstração. A API ainda não está respondendo.</div>}
      {erro && <div className="form-error matches-error">{erro}</div>}
      <section className="match-filters"><select value={filtros.modalidade} onChange={(event) => setFiltros({ ...filtros, modalidade: event.target.value })}>{modalidades.map((item) => <option key={item}>{item}</option>)}</select><select value={filtros.grupo} onChange={(event) => setFiltros({ ...filtros, grupo: event.target.value })}>{grupos.map((item) => <option key={item}>{item}</option>)}</select><input type="date" value={filtros.data} onChange={(event) => setFiltros({ ...filtros, data: event.target.value })} /><select value={filtros.status} onChange={(event) => setFiltros({ ...filtros, status: event.target.value })}><option>Todos</option><option>Agendada</option><option>Em andamento</option><option>Finalizada</option><option>Cancelada</option></select></section>
      {carregando ? <div className="empty-state">Carregando partidas...</div> : partidasFiltradas.length === 0 ? <div className="empty-state"><strong>Nenhuma partida encontrada</strong><span>Altere os filtros ou crie uma nova partida.</span></div> : <section className="matches-list">{partidasFiltradas.map((partida) => <article className="match-card" key={partida.id}><div className="match-card-top"><div><span className="group-label">{partida.modalidade} · {partida.grupo}</span><h2>{partida.equipeA}<span>×</span>{partida.equipeB}</h2></div><span className={`match-status ${partida.status.toLowerCase().replaceAll(" ", "-")}`}>{partida.status}</span></div><div className="match-card-info"><span>◷ {partida.data ? new Date(`${partida.data}T12:00:00`).toLocaleDateString("pt-BR") : "Data a definir"} às {partida.horario || "--:--"}</span><span>⌖ {partida.local}</span></div><div className="match-card-actions"><button type="button" onClick={() => abrirEdicao(partida)}>Editar</button><button className="cancel-action" type="button" onClick={() => cancelarPartida(partida)}>Cancelar</button></div></article>)}</section>}
      <Link className="back-link matches-back" to="/">← Voltar para o site público</Link>
      {modalAberto && <div className="modal-backdrop" role="presentation" onMouseDown={() => setModalAberto(false)}><div className="modal-card match-modal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={() => setModalAberto(false)} aria-label="Fechar">×</button><span className="eyebrow">{editando ? "EDITAR PARTIDA" : "NOVA PARTIDA"}</span><h2>{editando ? "Editar partida" : "Nova partida"}</h2><p>Preencha os dados do confronto.</p><form className="group-form" onSubmit={salvarPartida}><label>Modalidade</label><select name="modalidade" value={campos.modalidade} onChange={alterarCampo}>{modalidades.filter((item) => item !== "Todas").map((item) => <option key={item}>{item}</option>)}</select><label>Grupo</label><input name="grupo" value={campos.grupo} onChange={alterarCampo} placeholder="Grupo A" /><div className="form-two-columns"><div><label>Equipe A</label><input name="equipeA" value={campos.equipeA} onChange={alterarCampo} placeholder="1º EM A" /></div><div><label>Equipe B</label><input name="equipeB" value={campos.equipeB} onChange={alterarCampo} placeholder="1º EM B" /></div></div><div className="form-two-columns"><div><label>Data</label><input name="data" type="date" value={campos.data} onChange={alterarCampo} /></div><div><label>Horário</label><input name="horario" type="time" value={campos.horario} onChange={alterarCampo} /></div></div><label>Local</label><input name="local" value={campos.local} onChange={alterarCampo} placeholder="Quadra 1" />{erro && <div className="form-error">{erro}</div>}<button className="primary-button" type="submit" disabled={salvando}>{salvando ? "Salvando..." : editando ? "Salvar alterações" : "Criar partida"}</button></form></div></div>}
    </main>
  );
}
