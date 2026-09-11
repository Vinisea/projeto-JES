import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  criarGrupo,
  editarGrupo,
  listarEquipesDoGrupo,
  listarGrupos,
  removerGrupo,
  removerEquipeDoGrupo,
} from "../services/grupoService.js";

const gruposDemo = [
  { id_grupo: "demo-a", nome_grupo: "Grupo A", nome_modalidade: "Futset", equipes: [{ id_equipe: 1, nome_equipe: "1º EM A" }, { id_equipe: 2, nome_equipe: "1º EM B" }] },
  { id_grupo: "demo-b", nome_grupo: "Grupo B", nome_modalidade: "Voleibol", equipes: [{ id_equipe: 3, nome_equipe: "2º EM A" }, { id_equipe: 4, nome_equipe: "2º EM B" }] },
];

export default function Grupos() {
  const [grupos, setGrupos] = useState([]);
  const [formulario, setFormulario] = useState(null);
  const [grupoAberto, setGrupoAberto] = useState(null);
  const [equipes, setEquipes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [modoDemo, setModoDemo] = useState(false);

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const dados = await listarGrupos();
      setGrupos(Array.isArray(dados) ? dados : []);
      setModoDemo(false);
    } catch {
      setGrupos(gruposDemo);
      setModoDemo(true);
      setErro("A API de grupos não respondeu. A tela está em modo demonstração.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => carregar(), 0);
    return () => clearTimeout(timer);
  }, []);

  function novoGrupo() {
    setFormulario({ id: null, nome_grupo: "", id_modalidade: "" });
  }

  function editar(grupo) {
    setFormulario({ id: grupo.id_grupo, nome_grupo: grupo.nome_grupo ?? "", id_modalidade: grupo.id_modalidade ?? "" });
  }

  async function salvar(event) {
    event.preventDefault();
    setSalvando(true);
    setErro("");
    try {
      if (modoDemo) {
        setGrupos((atual) => formulario.id ? atual.map((g) => g.id_grupo === formulario.id ? { ...g, ...formulario } : g) : [...atual, { ...formulario, id_grupo: `demo-${Date.now()}`, equipes: [] }]);
      } else if (formulario.id) {
        await editarGrupo(formulario.id, { nome_grupo: formulario.nome_grupo, id_modalidade: formulario.id_modalidade });
        await carregar();
      } else {
        await criarGrupo({ nome_grupo: formulario.nome_grupo, id_modalidade: formulario.id_modalidade });
        await carregar();
      }
      setFormulario(null);
    } catch (error) {
      setErro(error.response?.data?.msg || error.response?.data?.message || "Não foi possível salvar o grupo.");
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(grupo) {
    if (!window.confirm(`Excluir o ${grupo.nome_grupo}?`)) return;
    try {
      if (modoDemo) setGrupos((atual) => atual.filter((g) => g.id_grupo !== grupo.id_grupo));
      else { await removerGrupo(grupo.id_grupo); await carregar(); }
    } catch { setErro("Não foi possível excluir o grupo."); }
  }

  async function gerenciar(grupo) {
    setGrupoAberto(grupo);
    try {
      const dados = modoDemo ? (grupo.equipes ?? []) : await listarEquipesDoGrupo(grupo.id_grupo);
      setEquipes(dados);
    } catch { setEquipes(grupo.equipes ?? []); setErro("Não foi possível carregar as equipes do grupo."); }
  }

  async function removerEquipe(equipe) {
    if (!window.confirm(`Remover ${equipe.nome_equipe} do grupo?`)) return;
    if (modoDemo) setEquipes((atual) => atual.filter((item) => item.id_equipe !== equipe.id_equipe));
    else {
      try { await removerEquipeDoGrupo(grupoAberto.id_grupo, equipe.id_equipe); setEquipes((atual) => atual.filter((item) => item.id_equipe !== equipe.id_equipe)); }
      catch { setErro("Não foi possível remover a equipe."); }
    }
  }

  return (
    <main className="page-shell inner-page groups-page">
      <section className="inner-header groups-header">
        <div><span className="eyebrow">ADMINISTRAÇÃO</span><h1>Grupos</h1><p>Organize as equipes antes de gerar as partidas.</p></div>
        <button className="primary-button" type="button" onClick={novoGrupo}>+ Novo grupo</button>
      </section>
      {erro && <div className="form-error">{erro}</div>}
      {carregando ? <div className="empty-state">Carregando grupos...</div> : grupos.length === 0 ? <div className="empty-state">Nenhum grupo cadastrado.</div> : <section className="groups-grid">{grupos.map((grupo) => <article className="group-card" key={grupo.id_grupo}><div className="group-card-top"><span className="group-accent" /><span>{grupo.nome_modalidade ?? "Modalidade"}</span></div><h2>{grupo.nome_grupo}</h2><p>{grupo.equipes?.length ?? 0} equipes</p><div className="group-team-list">{(grupo.equipes ?? []).slice(0, 4).map((equipe) => <span key={equipe.id_equipe}>{equipe.nome_equipe}</span>)}{!grupo.equipes?.length && <small>Nenhuma equipe vinculada</small>}</div><div className="group-actions"><button type="button" onClick={() => gerenciar(grupo)}>Gerenciar</button><button type="button" onClick={() => editar(grupo)}>Editar</button><button type="button" className="danger-button" onClick={() => excluir(grupo)}>Excluir</button></div></article>)}</section>}

      {formulario && <div className="modal-backdrop"><form className="modal-card" onSubmit={salvar}><button className="modal-close" type="button" onClick={() => setFormulario(null)}>×</button><span className="eyebrow">GRUPO</span><h2>{formulario.id ? "Editar grupo" : "Novo grupo"}</h2><label>Nome do grupo<input value={formulario.nome_grupo} onChange={(e) => setFormulario({ ...formulario, nome_grupo: e.target.value })} placeholder="Grupo A" required /></label><label>ID da modalidade<input value={formulario.id_modalidade} onChange={(e) => setFormulario({ ...formulario, id_modalidade: e.target.value })} placeholder="Opcional" /></label><button className="primary-button" disabled={salvando}>{salvando ? "Salvando..." : "Salvar grupo"}</button></form></div>}

      {grupoAberto && <div className="modal-backdrop"><section className="modal-card group-manage-modal"><button className="modal-close" type="button" onClick={() => setGrupoAberto(null)}>×</button><span className="eyebrow">EQUIPES DO GRUPO</span><h2>{grupoAberto.nome_grupo}</h2><p>Equipes vinculadas atualmente.</p>{equipes.length ? <div className="managed-team-list">{equipes.map((equipe) => <div className="managed-team" key={equipe.id_equipe}><strong>{equipe.nome_equipe}</strong><button type="button" className="danger-button" onClick={() => removerEquipe(equipe)}>Remover</button></div>)}</div> : <div className="empty-state">Nenhuma equipe vinculada. Adicione equipes pela tela de inscrições.</div>}<Link className="secondary-button" to="/admin/chaveamento">Ir para chaveamento</Link></section></div>}
    </main>
  );
}
