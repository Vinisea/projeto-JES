import { useEffect, useState } from "react";
import { buscarRankingGeral, buscarRankingPorModalidade } from "../services/rankingService.js";
import { listarModalidades } from "../services/modalidadeService.js";

export default function Ranking() {
  const [teams, setTeams] = useState([]);
  const [erro, setErro] = useState("");
  const [modalidades, setModalidades] = useState([]);
  const [modalidadeSelecionada, setModalidadeSelecionada] = useState("");
  const [rankingModalidade, setRankingModalidade] = useState(null);

  useEffect(() => {
    buscarRankingGeral()
      .then((dados) => setTeams(dados.ranking || []))
      .catch(() => setErro("Não foi possível carregar o ranking."));
    listarModalidades().then(setModalidades).catch(() => setErro("Não foi possível carregar as modalidades."));
  }, []);

  useEffect(() => {
    if (!modalidadeSelecionada) {
      return;
    }
    buscarRankingPorModalidade(modalidadeSelecionada)
      .then(setRankingModalidade)
      .catch(() => setErro("Não foi possível carregar a classificação da modalidade."));
  }, [modalidadeSelecionada]);

  function selecionarModalidade(event) {
    setModalidadeSelecionada(event.target.value);
    if (!event.target.value) setRankingModalidade(null);
  }

  const renderRows = (lista, chave) => lista.map((item, index) => (
    <div className="table-row" key={`${chave}-${item.nome_equipe}`}>
      <span className={`rank-number ${["orange", "lime", "purple", "blue", "red"][index % 5]}`}>{item.posicao}</span>
      <span className="team-name"><strong>{item.nome_equipe}</strong><small>• {item.jogos} jogos</small></span>
      <span>{item.vitorias}V / {item.empates}E</span>
      <strong>{item.pontos} pts</strong>
    </div>
  ));

  return (
    <main className="page-shell inner-page">
      <section className="inner-header">
        <span className="eyebrow">JES 2026</span>
        <h1>Classificação geral</h1>
        <p>Acompanhe a pontuação das turmas nos Jogos Internos SESI.</p>
      </section>

      <section className="table-card">
        <div className="table-title">
          <h2>{rankingModalidade ? `Classificação: ${rankingModalidade.modalidade}` : "Liderança geral"}</h2>
          <select className="ranking-selector" value={modalidadeSelecionada} onChange={selecionarModalidade} aria-label="Filtrar classificação por modalidade">
            <option value="">Geral</option>
            {modalidades.map((modalidade) => <option key={modalidade.id_modalidade} value={modalidade.id_modalidade}>{modalidade.nome_modalidade}</option>)}
          </select>
        </div>
        {erro && <div className="empty-state">{erro}</div>}
        <div className="classification-table">
          <div className="table-row table-head">
            <span>#</span>
            <span>Equipe</span>
            <span>Jogos</span>
            <span>Pontos</span>
          </div>
          {!rankingModalidade && teams.map((item, index) => <div className="table-row" key={item.equipe}><span className={`rank-number ${["orange", "lime", "purple", "blue", "red"][index % 5]}`}>{item.posicao}</span><span className="team-name"><strong>{item.equipe}</strong><small>• {item.modalidades_disputadas} modalidades</small></span><span>{item.primeiros_lugares} ouros</span><strong>{item.pontos_gerais} pts</strong></div>)}
          {rankingModalidade?.grupos?.map((grupo) => <div className="ranking-group" key={grupo.id_grupo}><h3>{grupo.nome_grupo}</h3>{renderRows(grupo.ranking, grupo.id_grupo)}</div>)}
        </div>
      </section>
    </main>
  );
}
