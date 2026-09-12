import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout.jsx";
import { listarModalidades } from "../services/modalidadeService.js";
import { listarGrupos } from "../services/grupoService.js";
import { gerarChaveamento } from "../services/partidaService.js";

export default function AdminChaveamento() {
  const [modalidades, setModalidades] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [formulario, setFormulario] = useState({ id_modalidade: "", id_grupo: "", fase: "Grupos", ids_equipe: [] });
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    Promise.all([listarModalidades(), listarGrupos()])
      .then(([modalidadesResponse, gruposResponse]) => {
        setModalidades(modalidadesResponse);
        setGrupos(gruposResponse);
      })
      .catch(() => setErro("Não foi possível carregar modalidades e grupos."));
  }, []);

  const gruposFiltrados = grupos.filter((grupo) => String(grupo.id_modalidade) === formulario.id_modalidade);
  const grupoSelecionado = grupos.find((grupo) => String(grupo.id_grupo) === formulario.id_grupo);
  const equipes = grupoSelecionado?.equipes || [];

  function alterar(campo, valor) {
    setMensagem("");
    setErro("");
    setFormulario((atual) => ({ ...atual, [campo]: valor, ...(campo === "id_modalidade" ? { id_grupo: "", ids_equipe: [] } : {}), ...(campo === "id_grupo" ? { ids_equipe: [] } : {}) }));
  }

  function alternarEquipe(idEquipe) {
    setFormulario((atual) => ({
      ...atual,
      ids_equipe: atual.ids_equipe.includes(idEquipe)
        ? atual.ids_equipe.filter((id) => id !== idEquipe)
        : [...atual.ids_equipe, idEquipe],
    }));
  }

  async function criar(event) {
    event.preventDefault();
    setSalvando(true);
    setMensagem("");
    setErro("");
    try {
      const resposta = await gerarChaveamento({
        id_grupo: Number(formulario.id_grupo),
        ids_equipe: formulario.ids_equipe,
        fase: formulario.fase,
      });
      setMensagem(`${resposta.quantidade} confrontos criados com sucesso.`);
    } catch (error) {
      setErro(error.response?.data?.message || "Não foi possível criar o chaveamento.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <AdminLayout title="Chaveamento" description="Gere os confrontos de cada grupo sem misturar modalidades.">
      <section className="admin-panel bracket-generator">
        <div className="panel-heading"><h2>Novo chaveamento</h2><span>Selecione modalidade e série</span></div>
        {mensagem && <div className="form-success">{mensagem}</div>}
        {erro && <div className="form-error">{erro}</div>}
        <form className="admin-form" onSubmit={criar}>
          <div className="admin-form-grid">
            <label>Modalidade<select value={formulario.id_modalidade} onChange={(event) => alterar("id_modalidade", event.target.value)} required><option value="">Selecione</option>{modalidades.map((modalidade) => <option key={modalidade.id_modalidade} value={modalidade.id_modalidade}>{modalidade.nome_modalidade} • {modalidade.categoria}</option>)}</select></label>
            <label>Série<select value={formulario.id_grupo} onChange={(event) => alterar("id_grupo", event.target.value)} required disabled={!formulario.id_modalidade}><option value="">Selecione</option>{gruposFiltrados.map((grupo) => <option key={grupo.id_grupo} value={grupo.id_grupo}>{grupo.nome_grupo}</option>)}</select></label>
            <label>Fase<select value={formulario.fase} onChange={(event) => alterar("fase", event.target.value)}><option>Grupos</option><option>Quartas</option><option>Semifinal</option><option>Final</option></select></label>
          </div>
          {formulario.id_grupo && <div className="team-picker"><div className="team-picker-heading"><strong>Equipes do grupo</strong><span>{formulario.ids_equipe.length} selecionadas</span></div><div className="team-picker-grid">{equipes.map((equipe) => <button type="button" key={equipe.id_equipe} className={formulario.ids_equipe.includes(equipe.id_equipe) ? "team-choice selected" : "team-choice"} onClick={() => alternarEquipe(equipe.id_equipe)}><span className="team-choice-mark">{formulario.ids_equipe.includes(equipe.id_equipe) ? "✓" : "+"}</span><strong>{equipe.nome_equipe}</strong><small>{equipe.atletas?.length || 0} atletas</small></button>)}</div><small className="team-picker-hint">Selecione pelo menos duas equipes. As partidas entre todas as selecionadas serão geradas automaticamente.</small></div>}
            <button className="panel-button" type="submit" disabled={salvando || formulario.ids_equipe.length < 2}>{salvando ? "Gerando..." : "Criar chaveamento"}</button>
        </form>
      </section>
    </AdminLayout>
  );
}
