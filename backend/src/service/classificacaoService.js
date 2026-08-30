//Função de calcular equipe
export const calcularEstatisticasEquipes = (equipes, confrontos) => {
  // 1. Inicializa o mapa de estatísticas para TODAS as equipes do grupo
  // (Garante que equipes sem jogos também apareçam na tabela com 0 pontos)
  const tabelaMap = {};

  equipes.forEach((eq) => {
    tabelaMap[eq.id_equipe] = {
      id_equipe: eq.id_equipe,
      nome_equipe: eq.nome_equipe || eq.nome,
      jogos: 0,
      vitorias: 0,
      empates: 0,
      derrotas: 0,
      pontos: 0,
      gols_marcados: 0,
      gols_sofridos: 0,
      saldo: 0
    };
  });

  // 2. Processa cada confronto FINALIZADO
  confrontos.forEach((conf) => {
    // Ignora se o confronto não for finalizado
    if (conf.status_confronto !== "Finalizado") return;

    const id1 = conf.id_equipe_1;
    const id2 = conf.id_equipe_2;
    const p1 = Number(conf.placar_equipe_1) || 0;
    const p2 = Number(conf.placar_equipe_2) || 0;

    const eq1 = tabelaMap[id1];
    const eq2 = tabelaMap[id2];

    // Se as equipes existirem no mapa do grupo
    if (eq1 && eq2) {
      // +1 jogo para cada
      eq1.jogos += 1;
      eq2.jogos += 1;

      // Gols marcados e sofridos
      eq1.gols_marcados += p1;
      eq1.gols_sofridos += p2;
      eq2.gols_marcados += p2;
      eq2.gols_sofridos += p1;

      // Vitória / Empate / Derrota
      if (p1 > p2) {
        // Vitória Equipe 1
        eq1.vitorias += 1;
        eq1.pontos += 3;
        eq2.derrotas += 1;
      } else if (p2 > p1) {
        // Vitória Equipe 2
        eq2.vitorias += 1;
        eq2.pontos += 3;
        eq1.derrotas += 1;
      } else {
        // Empate
        eq1.empates += 1;
        eq1.pontos += 1;
        eq2.empates += 1;
        eq2.pontos += 1;
      }

      // Atualiza o saldo
      eq1.saldo = eq1.gols_marcados - eq1.gols_sofridos;
      eq2.saldo = eq2.gols_marcados - eq2.gols_sofridos;
    }
  });

  return Object.values(tabelaMap);
};


//Função de classificar equipe
export const classificarEquipes = (tabelaArray) => {
  const ordenada = tabelaArray.sort((a, b) => {
    // 1º Critério: Pontos
    if (b.pontos !== a.pontos) return b.pontos - a.pontos;

    // 2º Critério: Número de Vitórias
    if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;

    // 3º Critério: Saldo de Gols
    if (b.saldo !== a.saldo) return b.saldo - a.saldo;

    // 4º Critério: Gols Marcados (Gols Pró)
    if (b.gols_marcados !== a.gols_marcados) return b.gols_marcados - a.gols_marcados;

    // 5º Critério: Nome (Ordem Alfabética)
    return a.nome_equipe.localeCompare(b.nome_equipe);
  });

  // Adiciona o rótulo da posição (ex: 1º EM A, 2º EM A)
  return ordenada.map((eq, index) => ({
    posicao: `${index + 1}º`,
    ...eq
  }));
};