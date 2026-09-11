import { useEffect, useState } from "react";
import { listarChaveamento } from "../services/partidaService.js";
import { listarModalidades } from "../services/modalidadeService.js";

const fases = ["Grupos", "Quartas", "Semifinal", "Final"];

function confrontoLabel(confronto) {
  return `${confronto.equipe_mandante?.nome_equipe || "A definir"} x ${confronto.equipe_visitante?.nome_equipe || "A definir"}`;
}

export default function Chaveamento() {
  const [modalidades, setModalidades] = useState([]);
  const [modalidadeSelecionada, setModalidadeSelecionada] = useState("");
  const [chaveamentos, setChaveamentos] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    listarModalidades()
      .then((dados) => {
        setModalidades(dados);
      })
      .catch(() => setErro("Não foi possível carregar as modalidades."));
  }, []);

  useEffect(() => {
    listarChaveamento(modalidadeSelecionada ? { modalidade: modalidadeSelecionada } : {})
      .then((dados) => setChaveamentos(dados.modalidades || []))
      .catch(() => setErro("Não foi possível carregar o chaveamento."));
  }, [modalidadeSelecionada]);

  return (
    <main className="page-shell inner-page">
      <section className="inner-header">
        <span className="eyebrow">JES 2026</span>
        <h1>Chaveamento</h1>
        <p>Acompanhe o caminho das equipes até a final.</p>
      </section>

      <label className="select-label" htmlFor="modalidade-chaveamento">Modalidade</label>
      <select
        id="modalidade-chaveamento"
        className="page-select"
        value={modalidadeSelecionada}
        onChange={(event) => setModalidadeSelecionada(event.target.value)}
      >
        <option value="">Todas as modalidades</option>
        {modalidades.map((modalidade) => (
          <option key={modalidade.id_modalidade} value={modalidade.id_modalidade}>
            {modalidade.nome_modalidade} • {modalidade.categoria}
          </option>
        ))}
      </select>

      {erro && <div className="empty-state">{erro}</div>}

      <section className="brackets" aria-label="Chaveamentos por modalidade">
        {chaveamentos.map((modalidade) => (
          <article className="bracket-sport" key={modalidade.id_modalidade}>
            <header><h2>{modalidade.nome_modalidade}</h2><span>{modalidade.categoria}</span></header>
            <div className="series-brackets">
              {modalidade.series.map((serie) => <section className="series-bracket" key={serie.id_grupo || serie.nome_grupo}><h3>{serie.nome_grupo}</h3><div className="bracket">
                {fases.map((fase) => (
                  <div className="bracket-column" key={fase}>
                    <h4>{fase}</h4>
                    {(serie.fases[fase] || []).map((confronto) => (
                      <article className={confronto.id_equipe_vencedora ? "bracket-match winner" : "bracket-match"} key={confronto.id_confronto}>
                        <span>{confrontoLabel(confronto)}</span>
                        <strong>{confronto.placar_equipe_1 ?? 0} <small>x</small> {confronto.placar_equipe_2 ?? 0}</strong>
                        <small>{confronto.status_confronto} • {confronto.local_partida}</small>
                      </article>
                    ))}
                    {!serie.fases[fase]?.length && <div className="bracket-empty">Sem confrontos</div>}
                  </div>
                ))}
              </div></section>)}
            </div>
          </article>
        ))}
        {!chaveamentos.length && <div className="empty-state">Nenhum chaveamento foi criado.</div>}
      </section>
    </main>
  );
}
