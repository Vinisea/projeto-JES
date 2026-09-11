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
        { nome_grupo: "Grupo A", id_modalidade: futsalMasculino.id_modalidade },
        { nome_grupo: "Grupo B", id_modalidade: futsalMasculino.id_modalidade },
        { nome_grupo: "Grupo C", id_modalidade: voleiFeminino.id_modalidade },
        { nome_grupo: "Grupo D", id_modalidade: voleiFeminino.id_modalidade },
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
      });

      const equipe2 = await equipe.create({
        nome_equipe: "Panteras Universitárias",
        pontuacao_geral: 9,
        id_usuario: docente.id_usuario,
      });

      const equipe3 = await equipe.create({
        nome_equipe: "Amazônias Vôlei",
        pontuacao_geral: 15,
        id_usuario: arbitro.id_usuario,
      });

      const equipe4 = await equipe.create({
        nome_equipe: "Cruzadas Femininas",
        pontuacao_geral: 11,
        id_usuario: docente.id_usuario,
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
        },
      ]);

      console.log("✅ Confrontos iniciais criados com sucesso!");
    }

    console.log("✅ Banco inicial populado com sucesso!");
  } catch (error) {
    console.log("❌ Erro ao popular o banco inicial:", error.message || error);
  }
};
