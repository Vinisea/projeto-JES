import { useEffect, useState } from "react";
import AdminSimplePage from "./AdminSimplePage.jsx";
import AdminForm from "../components/AdminForm.jsx";
import { criarEquipe, editarEquipe, listarEquipes, removerEquipe } from "../services/equipeService.js";
import { listarAtletas, transferirAtleta } from "../services/atletaService.js";

export default function AdminEquipes() {
  const [equipes, setEquipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formulario, setFormulario] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [atletas, setAtletas] = useState([]);
  const [transferindo, setTransferindo] = useState(null);

  function carregar() {
    setLoading(true);
    Promise.all([listarEquipes(), listarAtletas()])
      .then(([dadosEquipes, dadosAtletas]) => {
        setEquipes(dadosEquipes.rows || []);
        setAtletas(dadosAtletas.rows || []);
      })
      .catch(() => setError("Não foi possível carregar as equipes."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    let ativo = true;
    Promise.all([listarEquipes(), listarAtletas()])
      .then(([dadosEquipes, dadosAtletas]) => {
        if (!ativo) return;
        setEquipes(dadosEquipes.rows || []);
        setAtletas(dadosAtletas.rows || []);
      })
      .catch(() => { if (ativo) setError("Não foi possível carregar as equipes."); })
      .finally(() => { if (ativo) setLoading(false); });
    return () => { ativo = false; };
  }, []);

  function adicionar() { setFormulario({ id: null, nome_equipe: "", id_usuario: "", id_grupo: "" }); }
  function editar(id) {
    const equipe = equipes.find((item) => item.id_equipe === id);
    if (equipe) setFormulario({ id, nome_equipe: equipe.nome_equipe, id_usuario: equipe.id_usuario, id_grupo: equipe.id_grupo || "" });
  }
  async function salvar(event) {
    event.preventDefault();
    setSalvando(true);
    const { id, ...dados } = formulario;
    try {
      const payload = { ...dados, id_usuario: Number(dados.id_usuario), id_grupo: dados.id_grupo ? Number(dados.id_grupo) : null };
      if (id) await editarEquipe(id, payload); else await criarEquipe(payload);
      setFormulario(null); carregar();
    } catch { setError("Não foi possível salvar a equipe."); }
    finally { setSalvando(false); }
  }

  async function excluir(id) {
    if (!window.confirm("Excluir esta equipe?")) return;
    try { await removerEquipe(id); carregar(); }
    catch { setError("Não foi possível excluir a equipe."); }
  }

  async function adicionarAtleta(idAtleta) {
    if (!formulario?.id) return;
    setTransferindo(idAtleta);
    try { await transferirAtleta(idAtleta, formulario.id); carregar(); }
    catch { setError("Não foi possível adicionar o atleta à equipe."); }
    finally { setTransferindo(null); }
  }

  const atletasDisponiveis = atletas.filter((atleta) => !atleta.id_equipe);

  return (
    <AdminSimplePage
      title="Equipes"
      description="Organize as equipes e turmas participantes."
      button="+ Nova equipe"
      rows={equipes.map((equipe) => [equipe.nome_equipe, `${equipe.atletas?.length || 0} atletas • ${equipe.pontuacao_geral || 0} pts`, equipe.id_equipe])}
      loading={loading}
      error={error}
      onAdd={adicionar}
      onEdit={editar}
      onRemove={excluir}
      children={<>{formulario && <AdminForm title={formulario.id ? "Editar equipe" : "Nova equipe"} fields={[{ name: "nome_equipe", label: "Nome da equipe" }, { name: "id_usuario", label: "ID do responsável", type: "number" }, { name: "id_grupo", label: "ID do grupo", type: "number", required: false }]} values={formulario} onChange={(name, value) => setFormulario({ ...formulario, [name]: value })} onSubmit={salvar} onCancel={() => setFormulario(null)} saving={salvando} />}{formulario?.id && <section className="athlete-picker admin-panel"><div className="panel-heading"><h2>Atletas disponíveis</h2><span>Selecione para adicionar à equipe</span></div><div className="athlete-picker-list">{atletasDisponiveis.map((atleta) => <button className="athlete-choice" type="button" key={atleta.id_atleta} onClick={() => adicionarAtleta(atleta.id_atleta)} disabled={transferindo === atleta.id_atleta}><strong>{atleta.nome_aluno}</strong><small>{atleta.turma} • matrícula {atleta.matricula}</small><span>{transferindo === atleta.id_atleta ? "Adicionando..." : "+ Adicionar"}</span></button>)}{!atletasDisponiveis.length && <div className="empty-state">Todos os atletas já estão em uma equipe.</div>}</div></section>}</>}
    />
  );
}
