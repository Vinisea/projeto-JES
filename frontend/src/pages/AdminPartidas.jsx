import { useEffect, useState } from "react";
import AdminSimplePage from "./AdminSimplePage.jsx";
import AdminForm from "../components/AdminForm.jsx";
import { editarPartida, listarPartidas, removerPartida } from "../services/partidaService.js";

export default function AdminPartidas() {
  const [partidas, setPartidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formulario, setFormulario] = useState(null);
  const [salvando, setSalvando] = useState(false);

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
    if (partida) setFormulario({ id, data_hora: partida.data_hora.slice(0, 16), local_partida: partida.local_partida, id_equipe_1: partida.id_equipe_1, id_equipe_2: partida.id_equipe_2, id_modalidade: partida.id_modalidade, fase: partida.fase, status_confronto: partida.status_confronto, placar_equipe_1: partida.placar_equipe_1 ?? 0, placar_equipe_2: partida.placar_equipe_2 ?? 0 });
  }
  async function salvar(event) {
    event.preventDefault();
    setSalvando(true);
    const { id, ...dados } = formulario;
    try {
      const payload = { ...dados, id_equipe_1: Number(dados.id_equipe_1), id_equipe_2: Number(dados.id_equipe_2), id_modalidade: Number(dados.id_modalidade), placar_equipe_1: Number(dados.placar_equipe_1), placar_equipe_2: Number(dados.placar_equipe_2) };
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

  return (
    <AdminSimplePage
      title="Partidas"
      description="Cadastre confrontos e atualize placares."
      button={null}
      rows={partidas.map((partida) => [
        `${partida.equipe_mandante?.nome_equipe || partida.id_equipe_1} x ${partida.equipe_visitante?.nome_equipe || partida.id_equipe_2}`,
        `${partida.modalidade?.nome_modalidade || "Modalidade"} • ${partida.fase} • ${partida.status_confronto}`,
        partida.id_confronto,
      ])}
      loading={loading}
      error={error}
      onEdit={editar}
      onRemove={excluir}
      children={formulario && <AdminForm title={formulario.id ? "Editar partida" : "Nova partida"} fields={[{ name: "data_hora", label: "Data e hora", type: "datetime-local" }, { name: "local_partida", label: "Local" }, { name: "id_equipe_1", label: "ID equipe mandante", type: "number" }, { name: "id_equipe_2", label: "ID equipe visitante", type: "number" }, { name: "id_modalidade", label: "ID modalidade", type: "number" }, { name: "fase", label: "Fase", type: "select", options: ["Grupos", "Quartas", "Semifinal", "Final"] }, { name: "status_confronto", label: "Status", type: "select", options: ["Agendado", "Em andamento", "Finalizado"] }, { name: "placar_equipe_1", label: "Placar mandante", type: "number", min: 0 }, { name: "placar_equipe_2", label: "Placar visitante", type: "number", min: 0 }]} values={formulario} onChange={(name, value) => setFormulario({ ...formulario, [name]: value })} onSubmit={salvar} onCancel={() => setFormulario(null)} saving={salvando} />}
    />
  );
}
