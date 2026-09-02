import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";

const gruposIniciais = [
  {
    id: "demo-a",
    nome: "Grupo A",
    modalidade: "Futsal",
    equipes: ["1º EM A", "1º EM B", "2º EM A", "2º EM B"],
  },
  {
    id: "demo-b",
    nome: "Grupo B",
    modalidade: "Voleibol",
    equipes: ["8º A", "8º B", "9º A"],
  },
];

const modalidades = ["Futsal", "Voleibol", "Basquete", "Handebol", "Fut7"];

function normalizarGrupo(grupo, index = 0) {
  const equipes = grupo.equipes || grupo.Equipes || grupo.equipe || [];
  return {
    id: grupo.id_grupo || grupo.id || grupo.idGrupo || `grupo-${index}`,
    nome: grupo.nome_grupo || grupo.nome || `Grupo ${String.fromCharCode(65 + index)}`,
    modalidade:
      grupo.nome_modalidade || grupo.modalidade?.nome_modalidade || grupo.modalidade || "Futsal",
    equipes: Array.isArray(equipes)
      ? equipes.map((equipe) =>
          typeof equipe === "string"
            ? equipe
            : equipe.nome_equipe || equipe.nome || "Equipe sem nome",
        )
      : [],
  };
}

function extrairLista(resposta) {
  const dados = resposta?.data ?? resposta;
  if (Array.isArray(dados)) return dados;
  return dados?.grupos || dados?.data || dados?.rows || [];
}

export default function Grupos() {
  const [grupos, setGrupos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [modoDemo, setModoDemo] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [grupoSelecionado, setGrupoSelecionado] = useState(null);
  const [nome, setNome] = useState("");
  const [modalidade, setModalidade] = useState("Futsal");
  const [salvando, setSalvando] = useState(false);

  async function carregarGrupos() {
    setCarregando(true);
    setErro("");

    try {
      const resposta = await api.get("/grupos");
      const lista = extrairLista(resposta).map(normalizarGrupo);
      setGrupos(lista);
      setModoDemo(false);
    } catch (error) {
      console.warn("API de grupos indisponível; usando dados de demonstração.", error);
      setGrupos(gruposIniciais);
      setModoDemo(true);
      setErro("");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarGrupos();
  }, []);

  const totalEquipes = useMemo(
    () => grupos.reduce((total, grupo) => total + grupo.equipes.length, 0),
    [grupos],
  );

  function abrirNovoGrupo() {
    setNome("");
    setModalidade("Futsal");
    setModalAberto(true);
  }

  async function criarGrupo(event) {
    event.preventDefault();
    if (!nome.trim()) return;

    setSalvando(true);
    const novoGrupo = {
      nome_grupo: nome.trim(),
      modalidade,
      equipes: [],
    };

    try {
      if (!modoDemo) {
        const resposta = await api.post("/grupos", novoGrupo);
        const salvo = normalizarGrupo(resposta.data, grupos.length);
        setGrupos((atuais) => [...atuais, salvo]);
      } else {
        setGrupos((atuais) => [
          ...atuais,
          { ...novoGrupo, id: `demo-${Date.now()}`, nome: novoGrupo.nome_grupo },
        ]);
      }
      setModalAberto(false);
    } catch (error) {
      console.error("Erro ao criar grupo:", error);
      setErro("Não foi possível criar o grupo. Verifique o backend.");
    } finally {
      setSalvando(false);
    }
  }

  function removerEquipe(nomeEquipe) {
    if (!grupoSelecionado) return;

    setGrupos((atuais) =>
      atuais.map((grupo) =>
        grupo.id === grupoSelecionado.id
          ? { ...grupo, equipes: grupo.equipes.filter((equipe) => equipe !== nomeEquipe) }
          : grupo,
      ),
    );
    setGrupoSelecionado((atual) => ({
      ...atual,
      equipes: atual.equipes.filter((equipe) => equipe !== nomeEquipe),
    }));
  }

  return (
    <main className="page-shell groups-page">
      <section className="groups-header">
        <div>
          <span className="eyebrow">ORGANIZAÇÃO DA COMPETIÇÃO</span>
          <h1>Grupos</h1>
          <p>Monte os grupos e organize as equipes por modalidade.</p>
        </div>
        <button className="primary-button" type="button" onClick={abrirNovoGrupo}>
          + Novo Grupo
        </button>
      </section>

      {modoDemo && (
        <div className="offline-notice">
          Exibindo grupos de demonstração. A API ainda não está respondendo.
        </div>
      )}
      {erro && <div className="form-error groups-error">{erro}</div>}

      <section className="groups-summary">
        <div><strong>{grupos.length}</strong><span>grupos criados</span></div>
        <div><strong>{totalEquipes}</strong><span>equipes distribuídas</span></div>
      </section>

      {carregando ? (
        <div className="empty-state">Carregando grupos...</div>
      ) : grupos.length === 0 ? (
        <div className="empty-state groups-empty">
          <strong>Nenhum grupo criado ainda</strong>
          <span>Comece criando o primeiro grupo da competição.</span>
          <button className="secondary-button" type="button" onClick={abrirNovoGrupo}>Criar primeiro grupo</button>
        </div>
      ) : (
        <section className="groups-grid">
          {grupos.map((grupo) => (
            <article className="group-card" key={grupo.id}>
              <div className="group-card-top">
                <div>
                  <span className="group-label">{grupo.modalidade}</span>
                  <h2>{grupo.nome}</h2>
                </div>
                <span className="group-count">{grupo.equipes.length} equipes</span>
              </div>

              <div className="group-teams">
                {grupo.equipes.length === 0 ? (
                  <span className="group-no-teams">Nenhuma equipe adicionada</span>
                ) : (
                  grupo.equipes.map((equipe) => <span key={equipe}>{equipe}</span>)
                )}
              </div>

              <button className="group-manage" type="button" onClick={() => setGrupoSelecionado(grupo)}>
                Gerenciar <span>→</span>
              </button>
            </article>
          ))}
        </section>
      )}

      <Link className="back-link groups-back" to="/">← Voltar para o site público</Link>

      {modalAberto && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setModalAberto(false)}>
          <div className="modal-card" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setModalAberto(false)} aria-label="Fechar">×</button>
            <span className="eyebrow">NOVA CONFIGURAÇÃO</span>
            <h2>Novo Grupo</h2>
            <p>Defina um nome e uma modalidade para começar.</p>
            <form className="group-form" onSubmit={criarGrupo}>
              <label htmlFor="grupo-nome">Nome</label>
              <input id="grupo-nome" value={nome} onChange={(event) => setNome(event.target.value)} placeholder="Ex.: Grupo A" autoFocus />
              <label htmlFor="grupo-modalidade">Modalidade</label>
              <select id="grupo-modalidade" value={modalidade} onChange={(event) => setModalidade(event.target.value)}>
                {modalidades.map((item) => <option key={item}>{item}</option>)}
              </select>
              <button className="primary-button" type="submit" disabled={salvando}>
                {salvando ? "Criando..." : "Criar grupo"}
              </button>
            </form>
          </div>
        </div>
      )}

      {grupoSelecionado && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setGrupoSelecionado(null)}>
          <div className="modal-card manage-modal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setGrupoSelecionado(null)} aria-label="Fechar">×</button>
            <span className="eyebrow">{grupoSelecionado.modalidade}</span>
            <h2>{grupoSelecionado.nome}</h2>
            <p>Equipes deste grupo</p>
            <div className="manage-team-list">
              {grupoSelecionado.equipes.length === 0 ? (
                <span className="group-no-teams">Este grupo ainda não possui equipes.</span>
              ) : (
                grupoSelecionado.equipes.map((equipe) => (
                  <div className="manage-team-row" key={equipe}>
                    <span>{equipe}</span>
                    <button type="button" onClick={() => removerEquipe(equipe)}>Remover</button>
                  </div>
                ))
              )}
            </div>
            <button className="secondary-button modal-action" type="button" onClick={() => setGrupoSelecionado(null)}>Concluir</button>
          </div>
        </div>
      )}
    </main>
  );
}
