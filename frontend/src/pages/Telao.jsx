import { useEffect, useMemo, useState } from "react";
import { listarPartidasDoTelao } from "../services/partidaService.js";
import {
  conectarPartida,
  desconectarPartida,
  ouvirAtualizacaoPartida,
  socket,
} from "../services/socket.js";

function normalizarPartida(item) {
  return {
    ...item,
    id_confronto: item.id_confronto ?? item.id_consfronto ?? item.id,
    nome_modalidade: item.modalidade?.nome_modalidade ?? item.nome_modalidade ?? "JES",
    nome_grupo: item.grupo?.nome_grupo ?? item.nome_grupo ?? "COMPETIÇÃO",
    equipe_1: item.equipe_mandante?.nome_equipe ?? item.equipe_1 ?? "Equipe A",
    equipe_2: item.equipe_visitante?.nome_equipe ?? item.equipe_2 ?? "Equipe B",
    local_partida: item.local_partida ?? "Local não informado",
    placar_equipe_1: item.placar_equipe_1 ?? 0,
    placar_equipe_2: item.placar_equipe_2 ?? 0,
  };
}

export default function Telao() {
  const [partidas, setPartidas] = useState([]);
  const [partidaSelecionada, setPartidaSelecionada] = useState(null);
  const [erro, setErro] = useState("");
  const [conectado, setConectado] = useState(socket.connected);
  const [modoDemo, setModoDemo] = useState(false);

  useEffect(() => {
    let ativo = true;

    listarPartidasDoTelao()
      .then((resposta) => {
        if (!ativo) return;
        const lista = Array.isArray(resposta) ? resposta : resposta?.partidas ?? [];
        const aoVivo = lista
          .filter((item) => item.status_confronto === "Em andamento")
          .map(normalizarPartida);
        setPartidas(aoVivo);
        setPartidaSelecionada(aoVivo[0] ?? null);
        setModoDemo(false);
      })
      .catch(() => {
        if (!ativo) return;
        setErro("Não foi possível carregar as partidas ao vivo.");
        setPartidas([]);
        setPartidaSelecionada(null);
        setModoDemo(false);
      });

    const onConnect = () => setConectado(true);
    const onDisconnect = () => setConectado(false);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      ativo = false;
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const partidaId = partidaSelecionada?.id_confronto;

  useEffect(() => {
    const id = partidaId;
    if (!id || id === "demo") return undefined;

    conectarPartida(id);
    const removerListener = ouvirAtualizacaoPartida((atualizacao) => {
      if (String(atualizacao.id_confronto) !== String(id)) return;
      setPartidaSelecionada((atual) => ({ ...atual, ...atualizacao }));
    });
    return () => {
      removerListener();
      desconectarPartida(id);
    };
  }, [partidaId]);

  const partida = useMemo(() => partidaSelecionada ?? partidas[0] ?? null, [partidaSelecionada, partidas]);

  if (!partida) {
    return (
      <main className="telao-page">
        <div className="telao-status-bar">
          <span className="telao-brand">ARENA JES</span>
          <span className={conectado ? "telao-connection online" : "telao-connection"}>
            {conectado ? "● CONECTADO" : "○ DESCONECTADO"}
          </span>
        </div>
        <section className="telao-card telao-empty">
          <span className="telao-live"><i /> JOGOS AO VIVO</span>
          <strong>Nenhuma partida em andamento</strong>
          <small>O placar aparecerá aqui quando o árbitro iniciar um confronto.</small>
        </section>
      </main>
    );
  }

  return (
    <main className="telao-page">
      <div className="telao-status-bar">
        <span className="telao-brand">ARENA JES</span>
        <span className={conectado ? "telao-connection online" : "telao-connection"}>
          {conectado ? "● CONECTADO" : "○ DESCONECTADO"}
        </span>
      </div>

      {erro && <p className="telao-notice">{erro}</p>}
      {modoDemo && !erro && <p className="telao-notice">Modo demonstração</p>}

      <section className="telao-card" aria-live="polite">
        <span className="telao-live"><i /> JOGOS AO VIVO</span>
        <p className="telao-competition">{partida.nome_modalidade} — {partida.nome_grupo}</p>
        <div className="telao-scoreboard">
          <strong>{partida.equipe_1}</strong>
          <div className="telao-score">
            <span>{partida.placar_equipe_1}</span>
            <small>×</small>
            <span>{partida.placar_equipe_2}</span>
          </div>
          <strong>{partida.equipe_2}</strong>
        </div>
        <div className="telao-location">{partida.local_partida}</div>
        <div className="telao-state">{partida.status_confronto?.toUpperCase() ?? "EM ANDAMENTO"}</div>
      </section>
    </main>
  );
}
