import bcrypt from "bcrypt";
import {
  usuario,
  modalidade,
  grupo,
  equipe,
  atleta,
  inscricao,
  confronto,
} from "../models/index.js";

const hashSenha = async (senha) => bcrypt.hash(senha, 10);

const criarConfrontoSeed = async (dados) => {
  await confronto.findOrCreate({
    where: {
      id_equipe_1: dados.id_equipe_1,
      id_equipe_2: dados.id_equipe_2,
      id_modalidade: dados.id_modalidade,
      fase: dados.fase,
    },
    defaults: dados,
  });
};

const popularSeriesEscolares = async () => {
  const admin = await usuario.findOne({ where: { tipo_usuario: "Administrador" } });
  for (const dados of [
    ["Basquete Masculino", "Partidas de 4 períodos, com cinco jogadores por equipe.", "Masculino"],
    ["Handebol Feminino", "Partidas coletivas com dois tempos de 20 minutos.", "Feminino"],
    ["Queimada Mista", "Partidas por equipes com eliminação dos jogadores atingidos.", "Masculino"],
    ["Atletismo Masculino", "Provas individuais com classificação por tempo.", "Masculino"],
  ]) {
    await modalidade.findOrCreate({ where: { nome_modalidade: dados[0] }, defaults: { nome_modalidade: dados[0], regras: dados[1], categoria: dados[2] } });
  }
  const modalidades = await modalidade.findAll();
  const series = ["6º", "7º", "8º", "9º"];
  const letras = "ABCDEFGH".split("");
  const agora = new Date();

  for (const modalidadeAtual of modalidades) {
    const equipesPorSerie = [];
    for (const serie of series) {
      const [serieGrupo] = await grupo.findOrCreate({
        where: { nome_grupo: `${serie} ano`, id_modalidade: modalidadeAtual.id_modalidade },
        defaults: { nome_grupo: `${serie} ano`, id_modalidade: modalidadeAtual.id_modalidade },
      });
      const equipes = [];
      for (const letra of letras) {
        const turma = `${serie} ${letra}`;
        const [equipeAtual] = await equipe.findOrCreate({
          where: { nome_equipe: `${turma} - ${modalidadeAtual.nome_modalidade}` },
          defaults: { nome_equipe: `${turma} - ${modalidadeAtual.nome_modalidade}`, pontuacao_geral: 0, id_usuario: admin.id_usuario, id_grupo: serieGrupo.id_grupo },
        });
        if (equipeAtual.id_grupo !== serieGrupo.id_grupo) await equipeAtual.update({ id_grupo: serieGrupo.id_grupo });
        equipes.push(equipeAtual);
      }
      equipesPorSerie.push(equipes);
    }

    for (const [serieIndex, equipes] of equipesPorSerie.entries()) {
      for (let index = 0; index < equipes.length; index += 2) {
        await criarConfrontoSeed({
          data_hora: new Date(agora.getTime() + (serieIndex + index + 1) * 3600000),
          local_partida: "A definir",
          placar_equipe_1: index === 0 ? 2 : 1,
          placar_equipe_2: 0,
          fase: "Grupos",
          status_confronto: "Finalizado",
          id_equipe_1: equipes[index].id_equipe,
          id_equipe_2: equipes[index + 1].id_equipe,
          id_equipe_vencedora: equipes[index].id_equipe,
          id_modalidade: modalidadeAtual.id_modalidade,
          id_grupo: equipes[index].id_grupo,
        });
      }
    }

    const mataMata = equipesPorSerie[0].slice(0, 8);
    for (let index = 0; index < mataMata.length; index += 2) {
      await criarConfrontoSeed({ data_hora: agora, local_partida: "A definir", placar_equipe_1: 3, placar_equipe_2: 1, fase: "Quartas", status_confronto: "Finalizado", id_equipe_1: mataMata[index].id_equipe, id_equipe_2: mataMata[index + 1].id_equipe, id_equipe_vencedora: mataMata[index].id_equipe, id_modalidade: modalidadeAtual.id_modalidade, id_grupo: mataMata[index].id_grupo });
    }
    await criarConfrontoSeed({ data_hora: agora, local_partida: "A definir", placar_equipe_1: 2, placar_equipe_2: 1, fase: "Semifinal", status_confronto: "Finalizado", id_equipe_1: mataMata[0].id_equipe, id_equipe_2: mataMata[2].id_equipe, id_equipe_vencedora: mataMata[0].id_equipe, id_modalidade: modalidadeAtual.id_modalidade, id_grupo: mataMata[0].id_grupo });
    await criarConfrontoSeed({ data_hora: agora, local_partida: "A definir", placar_equipe_1: modalidadeAtual.nome_modalidade === "Basquete Masculino" ? 1 : 4, placar_equipe_2: modalidadeAtual.nome_modalidade === "Basquete Masculino" ? 1 : 2, fase: "Final", status_confronto: modalidadeAtual.nome_modalidade === "Basquete Masculino" ? "Em andamento" : "Finalizado", id_equipe_1: mataMata[0].id_equipe, id_equipe_2: mataMata[4].id_equipe, id_equipe_vencedora: modalidadeAtual.nome_modalidade === "Basquete Masculino" ? null : mataMata[0].id_equipe, id_modalidade: modalidadeAtual.id_modalidade, id_grupo: mataMata[0].id_grupo });
  }
};

export const popularBancoInicial = async () => {
  try {
    const adminJaExiste = await usuario.findOne({
      where: { tipo_usuario: "Administrador" },
    });

    let admin;

    if (!adminJaExiste) {
      admin = await usuario.create({
        nome: "MelhorAdmin",
        email: "admin@adminArena.com",
        senha: await hashSenha("Admin@123"),
        tipo_usuario: "Administrador",
      });
      console.log("✅ Usuário administrador criado com sucesso!");
    } else {
      admin = adminJaExiste;
    }

    if ((await modalidade.count()) === 0) {
      const futsalMasculino = await modalidade.create({
        nome_modalidade: "Futsal Masculino",
        regras: "Partidas em quadra interna, 5 jogadores por equipe, duração de 40 minutos, e regra de 3 faltas por jogador.",
        categoria: "Masculino",
      });

      const voleiFeminino = await modalidade.create({
        nome_modalidade: "Vôlei Feminino",
        regras: "Partidas em melhor de 3 sets, 6 jogadores por equipe, troca de posições obrigatória e uso de toque limitado.",
        categoria: "Feminino",
      });

      console.log("✅ Modalidades iniciais criadas com sucesso!");

      await grupo.bulkCreate([
        { nome_grupo: "6º ano", id_modalidade: futsalMasculino.id_modalidade },
        { nome_grupo: "7º ano", id_modalidade: futsalMasculino.id_modalidade },
        { nome_grupo: "8º ano", id_modalidade: voleiFeminino.id_modalidade },
        { nome_grupo: "9º ano", id_modalidade: voleiFeminino.id_modalidade },
      ]);

      console.log("✅ Grupos iniciais criados com sucesso!");
    }

    if ((await equipe.count()) === 0) {
      const arbitro = await usuario.create({
        nome: "João Arbitro",
        email: "arbitro@adminArena.com",
        senha: await hashSenha("Arbitro@123"),
        tipo_usuario: "Arbitro",
      });

      const docente = await usuario.create({
        nome: "Maria Docente",
        email: "docente@adminArena.com",
        senha: await hashSenha("Docente@123"),
        tipo_usuario: "Docente",
      });

      const modalidadesDisponiveis = await modalidade.findAll();
      const gruposDisponiveis = await grupo.findAll();

      const equipe1 = await equipe.create({
        nome_equipe: "Tigres do Campus",
        pontuacao_geral: 12,
        id_usuario: arbitro.id_usuario,
        id_grupo: gruposDisponiveis[0]?.id_grupo || null,
      });

      const equipe2 = await equipe.create({
        nome_equipe: "Panteras Universitárias",
        pontuacao_geral: 9,
        id_usuario: docente.id_usuario,
        id_grupo: gruposDisponiveis[1]?.id_grupo || null,
      });

      const equipe3 = await equipe.create({
        nome_equipe: "Amazônias Vôlei",
        pontuacao_geral: 15,
        id_usuario: arbitro.id_usuario,
        id_grupo: gruposDisponiveis[2]?.id_grupo || null,
      });

      const equipe4 = await equipe.create({
        nome_equipe: "Cruzadas Femininas",
        pontuacao_geral: 11,
        id_usuario: docente.id_usuario,
        id_grupo: gruposDisponiveis[3]?.id_grupo || null,
      });

      console.log("✅ Equipes iniciais criadas com sucesso!");

      await atleta.bulkCreate([
        { nome_aluno: "Lucas Mendes", matricula: 20241001, turma: "A1", id_equipe: equipe1.id_equipe },
        { nome_aluno: "Mateus Silva", matricula: 20241002, turma: "A1", id_equipe: equipe1.id_equipe },
        { nome_aluno: "Rafael Costa", matricula: 20241003, turma: "B2", id_equipe: equipe2.id_equipe },
        { nome_aluno: "Gabriel Souza", matricula: 20241004, turma: "B2", id_equipe: equipe2.id_equipe },
        { nome_aluno: "Isabela Rocha", matricula: 20241005, turma: "C3", id_equipe: equipe3.id_equipe },
        { nome_aluno: "Larissa Nunes", matricula: 20241006, turma: "C3", id_equipe: equipe3.id_equipe },
        { nome_aluno: "Sofia Almeida", matricula: 20241007, turma: "D4", id_equipe: equipe4.id_equipe },
        { nome_aluno: "Beatriz Lima", matricula: 20241008, turma: "D4", id_equipe: equipe4.id_equipe },
      ]);

      console.log("✅ Atletas iniciais criados com sucesso!");

      await inscricao.bulkCreate([
        { id_equipe: equipe1.id_equipe, id_modalidade: modalidadesDisponiveis[0].id_modalidade },
        { id_equipe: equipe2.id_equipe, id_modalidade: modalidadesDisponiveis[0].id_modalidade },
        { id_equipe: equipe3.id_equipe, id_modalidade: modalidadesDisponiveis[1].id_modalidade },
        { id_equipe: equipe4.id_equipe, id_modalidade: modalidadesDisponiveis[1].id_modalidade },
      ]);

      console.log("✅ Inscrições iniciais criadas com sucesso!");

      await confronto.bulkCreate([
        {
          data_hora: new Date("2026-09-15T18:00:00"),
          local_partida: "Ginásio Central",
          placar_equipe_1: 3,
          placar_equipe_2: 1,
          fase: "Grupos",
          status_confronto: "Finalizado",
          id_equipe_1: equipe1.id_equipe,
          id_equipe_2: equipe2.id_equipe,
          id_equipe_vencedora: equipe1.id_equipe,
          id_modalidade: modalidadesDisponiveis[0].id_modalidade,
          id_grupo: gruposDisponiveis[0].id_grupo,
        },
        {
          data_hora: new Date("2026-09-18T19:30:00"),
          local_partida: "Arena de Vôlei",
          placar_equipe_1: 0,
          placar_equipe_2: 0,
          fase: "Grupos",
          status_confronto: "Agendado",
          id_equipe_1: equipe3.id_equipe,
          id_equipe_2: equipe4.id_equipe,
          id_modalidade: modalidadesDisponiveis[1].id_modalidade,
          id_grupo: gruposDisponiveis[2].id_grupo,
        },
      ]);

      console.log("✅ Confrontos iniciais criados com sucesso!");
    }

    await popularSeriesEscolares();
    console.log("✅ Banco inicial populado com sucesso!");
  } catch (error) {
    console.log("❌ Erro ao popular o banco inicial:", error.message || error);
  }
};
