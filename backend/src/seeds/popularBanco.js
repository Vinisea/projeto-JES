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

const hashSenha = (senha) => bcrypt.hash(senha, 10);

const criarConfronto = (dados) => confronto.create(dados);

export async function popularBancoInicial() {
  if (await usuario.count()) return;

  const [admin, arbitro, docente] = await Promise.all([
    usuario.create({
      nome: "Administrador JES",
      email: "admin@adminArena.com",
      senha: await hashSenha("Admin@123"),
      tipo_usuario: "Administrador",
    }),
    usuario.create({
      nome: "João Árbitro",
      email: "arbitro@adminArena.com",
      senha: await hashSenha("Arbitro@123"),
      tipo_usuario: "Arbitro",
    }),
    usuario.create({
      nome: "Maria Docente",
      email: "docente@adminArena.com",
      senha: await hashSenha("Docente@123"),
      tipo_usuario: "Docente",
    }),
  ]);

  const [futsal, volei, basquete] = await modalidade.bulkCreate([
    {
      nome_modalidade: "Futsal Masculino",
      regras: "Partidas de 40 minutos, com cinco jogadores por equipe.",
      categoria: "Masculino",
    },
    {
      nome_modalidade: "Vôlei Feminino",
      regras: "Partidas em melhor de três sets.",
      categoria: "Feminino",
    },
    {
      nome_modalidade: "Basquete Masculino",
      regras: "Partidas de quatro períodos.",
      categoria: "Masculino",
    },
  ]);

  const grupos = await grupo.bulkCreate([
    { nome_grupo: "Ensino Médio", id_modalidade: futsal.id_modalidade },
    { nome_grupo: "Ensino Fundamental", id_modalidade: futsal.id_modalidade },
    { nome_grupo: "8º e 9º anos", id_modalidade: volei.id_modalidade },
    { nome_grupo: "Ensino Médio", id_modalidade: basquete.id_modalidade },
  ]);

  const equipes = await equipe.bulkCreate([
    { nome_equipe: "1º EM A", pontuacao_geral: 0, id_usuario: admin.id_usuario, id_grupo: grupos[0].id_grupo },
    { nome_equipe: "1º EM B", pontuacao_geral: 0, id_usuario: arbitro.id_usuario, id_grupo: grupos[0].id_grupo },
    { nome_equipe: "2º EM A", pontuacao_geral: 0, id_usuario: docente.id_usuario, id_grupo: grupos[0].id_grupo },
    { nome_equipe: "8º A", pontuacao_geral: 0, id_usuario: admin.id_usuario, id_grupo: grupos[2].id_grupo },
    { nome_equipe: "8º B", pontuacao_geral: 0, id_usuario: arbitro.id_usuario, id_grupo: grupos[2].id_grupo },
    { nome_equipe: "9º A", pontuacao_geral: 0, id_usuario: docente.id_usuario, id_grupo: grupos[2].id_grupo },
    { nome_equipe: "2º EM B", pontuacao_geral: 0, id_usuario: admin.id_usuario, id_grupo: grupos[3].id_grupo },
    { nome_equipe: "3º EM A", pontuacao_geral: 0, id_usuario: arbitro.id_usuario, id_grupo: grupos[3].id_grupo },
  ]);

  await atleta.bulkCreate(
    equipes.flatMap((time, index) => [
      {
        nome_aluno: `Atleta ${index + 1}A`,
        matricula: 20260000 + index * 2 + 1,
        turma: time.nome_equipe,
        id_equipe: time.id_equipe,
      },
      {
        nome_aluno: `Atleta ${index + 1}B`,
        matricula: 20260000 + index * 2 + 2,
        turma: time.nome_equipe,
        id_equipe: time.id_equipe,
      },
    ]),
  );

  await inscricao.bulkCreate([
    ...equipes.slice(0, 3).map((time) => ({ id_equipe: time.id_equipe, id_modalidade: futsal.id_modalidade })),
    ...equipes.slice(3, 6).map((time) => ({ id_equipe: time.id_equipe, id_modalidade: volei.id_modalidade })),
    ...equipes.slice(6).map((time) => ({ id_equipe: time.id_equipe, id_modalidade: basquete.id_modalidade })),
  ]);

  await criarConfronto({
    data_hora: new Date("2026-09-15T18:00:00"),
    local_partida: "Ginásio Central",
    placar_equipe_1: 3,
    placar_equipe_2: 1,
    fase: "Grupos",
    status_confronto: "Finalizado",
    id_equipe_1: equipes[0].id_equipe,
    id_equipe_2: equipes[1].id_equipe,
    id_equipe_vencedora: equipes[0].id_equipe,
    id_modalidade: futsal.id_modalidade,
    id_grupo: grupos[0].id_grupo,
  });

  await criarConfronto({
    data_hora: new Date("2026-09-18T19:30:00"),
    local_partida: "Quadra 2",
    placar_equipe_1: 0,
    placar_equipe_2: 0,
    fase: "Grupos",
    status_confronto: "Agendado",
    id_equipe_1: equipes[1].id_equipe,
    id_equipe_2: equipes[2].id_equipe,
    id_modalidade: futsal.id_modalidade,
    id_grupo: grupos[0].id_grupo,
  });

  await criarConfronto({
    data_hora: new Date(),
    local_partida: "Quadra 1",
    placar_equipe_1: 1,
    placar_equipe_2: 1,
    fase: "Final",
    status_confronto: "Em andamento",
    id_equipe_1: equipes[3].id_equipe,
    id_equipe_2: equipes[4].id_equipe,
    id_modalidade: volei.id_modalidade,
    id_grupo: grupos[2].id_grupo,
  });
}
