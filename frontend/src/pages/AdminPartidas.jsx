import { useEffect, useState } from "react";
import AdminSimplePage from "./AdminSimplePage.jsx";
import AdminForm from "../components/AdminForm.jsx";
import { atualizarPlacar, editarPartida, finalizarPartida, iniciarPartida, listarPartidas, removerPartida } from "../services/partidaService.js";

export default function AdminPartidas() {
  const [partidas, setPartidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formulario, setFormulario] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [acao, setAcao] = useState(null);
  const [placarAberto, setPlacarAberto] = useState(null);
  const [placarFormulario, setPlacarFormulario] = useState({ placar_equipe_1: 0, placar_equipe_2: 0 });
  const ordemStatus = { "Em andamento": 0, Agendado: 1, Finalizado: 2 };

  function carregar() {
    setLoading(true);
    listarPartidas()
      .then(setPartidas)
      .catch(() => setError("Não foi possível carregar as partidas."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    let ativo = true;
    listarPartidas()
      .then((dados) => { if (ativo) setPartidas(dados); })
      .catch(() => { if (ativo) setError("Não foi possível carregar as partidas."); })
      .finally(() => { if (ativo) setLoading(false); });
    return () => { ativo = false; };
  }, []);

  function editar(id) {
    const partida = partidas.find((item) => item.id_confronto === id);
    if (partida) setFormulario({ id, data_hora: partida.data_hora.slice(0, 16), local_partida: partida.local_partida || "A definir", placar_equipe_1: partida.placar_equipe_1 ?? 0, placar_equipe_2: partida.placar_equipe_2 ?? 0 });
  }
  async function salvar(event) {
    event.preventDefault();
    setSalvando(true);
    const { id, ...dados } = formulario;
    try {
      const payload = { ...dados, placar_equipe_1: Number(dados.placar_equipe_1), placar_equipe_2: Number(dados.placar_equipe_2) };
      await editarPartida(id, payload);
      setFormulario(null); carregar();
    } catch { setError("Não foi possível cadastrar a partida."); }
    finally { setSalvando(false); }
  }

  async function excluir(id) {
    if (!window.confirm("Excluir esta partida?")) return;
    try { await removerPartida(id); carregar(); }
    catch { setError("Não foi possível excluir a partida."); }
  }

  async function executarAcao(id, tipo) {
    setAcao(`${tipo}:${id}`);
    try {
      if (tipo === "iniciar") await iniciarPartida(id);
      if (tipo === "finalizar") await finalizarPartida(id);
      if (tipo === "placar") {
        setPlacarAberto(partidas.find((item) => item.id_confronto === id));
        const partida = partidas.find((item) => item.id_confronto === id);
        setPlacarFormulario({ placar_equipe_1: partida?.placar_equipe_1 ?? 0, placar_equipe_2: partida?.placar_equipe_2 ?? 0 });
        return;
      }

      carregar();
    } catch (error) {
      setError(error.response?.data?.msg || error.response?.data?.message || "Não foi possível atualizar a partida.");
    } finally {
      setAcao(null);
    }

  }

  async function salvarPlacar(event) {
    event.preventDefault();
    setAcao(`placar:${placarAberto.id_confronto}`);
    try {
      await atualizarPlacar(placarAberto.id_confronto, {
        placar_equipe_1: Number(placarFormulario.placar_equipe_1),
        placar_equipe_2: Number(placarFormulario.placar_equipe_2),
      });
      setPlacarAberto(null);
      carregar();
    } catch (error) {
      setError(error.response?.data?.msg || "Não foi possível atualizar o placar.");
    } finally {
      setAcao(null);
    }
  }

  return (
    <AdminSimplePage
      title="Partidas"
      description="Cadastre confrontos e atualize placares."
      button={null}
      rows={[...partidas].sort((a, b) => (ordemStatus[a.status_confronto] ?? 9) - (ordemStatus[b.status_confronto] ?? 9) || new Date(a.data_hora) - new Date(b.data_hora)).map((partida) => [
        `${partida.equipe_mandante?.nome_equipe || partida.id_equipe_1} x ${partida.equipe_visitante?.nome_equipe || partida.id_equipe_2}`,
        `${partida.modalidade?.nome_modalidade || "Modalidade"} • ${partida.fase} • ${partida.status_confronto}`,
        partida.id_confronto,
      ])}
      loading={loading}
      error={error}
      onEdit={editar}
      onRemove={excluir}
      renderRowActions={(id) => {
        const partida = partidas.find((item) => item.id_confronto === id);
        if (!partida) return null;
        return <>
          {partida.status_confronto === "Agendado" && <button type="button" className="row-action" disabled={acao} onClick={() => executarAcao(id, "iniciar")}>Iniciar</button>}
          {partida.status_confronto === "Em andamento" && <><button type="button" className="row-action" disabled={acao} onClick={() => executarAcao(id, "placar")}>Placar</button><button type="button" className="row-action" disabled={acao} onClick={() => executarAcao(id, "finalizar")}>Finalizar</button></>}
        </>;
      }}
      children={<>{formulario && <AdminForm title="Editar partida" fields={[{ name: "data_hora", label: "Data e hora", type: "datetime-local" }, { name: "local_partida", label: "Local" }, { name: "placar_equipe_1", label: "Placar mandante", type: "number", min: 0 }, { name: "placar_equipe_2", label: "Placar visitante", type: "number", min: 0 }]} values={formulario} onChange={(name, value) => setFormulario({ ...formulario, [name]: value })} onSubmit={salvar} onCancel={() => setFormulario(null)} saving={salvando} />}{placarAberto && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setPlacarAberto(null); }}><form className="modal-card score-modal" onSubmit={salvarPlacar}><button className="modal-close" type="button" onClick={() => setPlacarAberto(null)} aria-label="Fechar">×</button><span className="eyebrow">ATUALIZAÇÃO AO VIVO</span><h2>Alterar placar</h2><p>{placarAberto.equipe_mandante?.nome_equipe} x {placarAberto.equipe_visitante?.nome_equipe}</p><div className="score-inputs"><label>{placarAberto.equipe_mandante?.nome_equipe}<input type="number" min="0" value={placarFormulario.placar_equipe_1} onChange={(event) => setPlacarFormulario({ ...placarFormulario, placar_equipe_1: event.target.value })} /></label><strong>x</strong><label>{placarAberto.equipe_visitante?.nome_equipe}<input type="number" min="0" value={placarFormulario.placar_equipe_2} onChange={(event) => setPlacarFormulario({ ...placarFormulario, placar_equipe_2: event.target.value })} /></label></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setPlacarAberto(null)}>Cancelar</button><button type="submit" className="panel-button" disabled={Boolean(acao)}>Salvar placar</button></div></form></div>}</>}
    />
  );
}
