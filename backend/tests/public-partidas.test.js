import {
    describe,
    test,
    expect,
    beforeAll,
    beforeEach
} from "vitest";

import request from "supertest";

import app from "../src/app.js";

import { conn } from "../src/config/conn.js";

import {
    usuario,
    equipe,
    modalidade,
    grupo,
    confronto
} from "../src/models/index.js";


let usuarioTeste;
let modalidadeTeste;
let modalidadeTeste2;
let equipe1;
let equipe2;
let equipe3;
let grupoTeste;


beforeAll(async () => {
    await conn.sync({ force: true });
});


beforeEach(async () => {
    await confronto.destroy({ where: {} });
    await equipe.destroy({ where: {} });
    await grupo.destroy({ where: {} });
    await modalidade.destroy({ where: {} });
    await usuario.destroy({ where: {} });


    usuarioTeste = await usuario.create({
        nome: "Usuario Teste",
        email: "public@teste.com",
        senha: "12345678",
        tipo_usuario: "Administrador"
    });


    modalidadeTeste = await modalidade.create({
        nome_modalidade: "Futebol",
        regras: "Regras do futebol",
        categoria: "Masculino"
    });


    modalidadeTeste2 = await modalidade.create({
        nome_modalidade: "Basquete",
        regras: "Regras do basquete",
        categoria: "Masculino"
    });


    grupoTeste = await grupo.create({
        nome_grupo: "Grupo A",
        id_modalidade: modalidadeTeste.id_modalidade
    });


    equipe1 = await equipe.create({
        nome_equipe: "Tubarões",
        id_usuario: usuarioTeste.id_usuario,
        id_grupo: grupoTeste.id_grupo
    });


    equipe2 = await equipe.create({
        nome_equipe: "Leões",
        id_usuario: usuarioTeste.id_usuario,
        id_grupo: grupoTeste.id_grupo
    });


    equipe3 = await equipe.create({
        nome_equipe: "Águias",
        id_usuario: usuarioTeste.id_usuario,
        id_grupo: grupoTeste.id_grupo
    });
});


describe("GET /api/public/partidas", () => {

    test("Deve retornar 400 para um status inválido", async () => {
        const response = await request(app)
            .get("/api/public/partidas")
            .query({ status: "invalido" });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
    });


    test("Deve listar as partidas públicas", async () => {
        await confronto.create({
            data_hora: "2026-09-10T10:00:00.000Z",
            local_partida: "Ginásio Central",
            placar_equipe_1: 2,
            placar_equipe_2: 1,
            fase: "Grupos",
            status_confronto: "Agendado",
            id_equipe_1: equipe1.id_equipe,
            id_equipe_2: equipe2.id_equipe,
            id_modalidade: modalidadeTeste.id_modalidade,
            id_grupo: grupoTeste.id_grupo
        });


        const response = await request(app)
            .get("/api/public/partidas");


        expect(response.status).toBe(200);
        expect(response.ok).toBeTruthy();
        expect(response.body).toHaveLength(1);
        expect(response.body[0]).toHaveProperty("id_confronto");
        expect(response.body[0]).toHaveProperty("data_hora");
        expect(response.body[0]).toHaveProperty("modalidade");
        expect(response.body[0]).toHaveProperty("grupo");
        expect(response.body[0]).toHaveProperty("equipe_mandante");
        expect(response.body[0]).toHaveProperty("equipe_visitante");
    });


    test("Deve filtrar partidas por modalidade e status", async () => {
        await confronto.create({
            data_hora: "2026-09-10T10:00:00.000Z",
            local_partida: "Ginásio Central",
            fase: "Grupos",
            status_confronto: "Agendado",
            id_equipe_1: equipe1.id_equipe,
            id_equipe_2: equipe2.id_equipe,
            id_modalidade: modalidadeTeste.id_modalidade,
            id_grupo: grupoTeste.id_grupo
        });


        await confronto.create({
            data_hora: "2026-09-11T10:00:00.000Z",
            local_partida: "Quadra Norte",
            fase: "Grupos",
            status_confronto: "Finalizado",
            id_equipe_1: equipe2.id_equipe,
            id_equipe_2: equipe3.id_equipe,
            id_modalidade: modalidadeTeste2.id_modalidade,
            id_grupo: null
        });


        const response = await request(app)
            .get("/api/public/partidas")
            .query({
                modalidade: modalidadeTeste.id_modalidade,
                status: "AGENDADO"
            });


        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].status_confronto).toBe("Agendado");
        expect(
            Number(response.body[0].modalidade.id_modalidade)
        ).toBe(modalidadeTeste.id_modalidade);
    });


    test("Deve aceitar status em letras minúsculas", async () => {
        await confronto.create({
            data_hora: "2026-09-10T10:00:00.000Z",
            local_partida: "Ginásio Central",
            fase: "Grupos",
            status_confronto: "Finalizado",
            id_equipe_1: equipe1.id_equipe,
            id_equipe_2: equipe2.id_equipe,
            id_modalidade: modalidadeTeste.id_modalidade,
            id_grupo: grupoTeste.id_grupo
        });


        const response = await request(app)
            .get("/api/public/partidas")
            .query({ status: "finalizado" });


        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].status_confronto).toBe("Finalizado");
    });


    test("Deve filtrar partidas por data", async () => {
        await confronto.create({
            data_hora: "2026-09-10T10:00:00.000Z",
            local_partida: "Ginásio Central",
            fase: "Grupos",
            status_confronto: "Agendado",
            id_equipe_1: equipe1.id_equipe,
            id_equipe_2: equipe2.id_equipe,
            id_modalidade: modalidadeTeste.id_modalidade,
            id_grupo: grupoTeste.id_grupo
        });


        await confronto.create({
            data_hora: "2026-09-11T10:00:00.000Z",
            local_partida: "Quadra Norte",
            fase: "Grupos",
            status_confronto: "Agendado",
            id_equipe_1: equipe2.id_equipe,
            id_equipe_2: equipe3.id_equipe,
            id_modalidade: modalidadeTeste.id_modalidade,
            id_grupo: grupoTeste.id_grupo
        });


        const response = await request(app)
            .get("/api/public/partidas")
            .query({ data: "2026-09-10" });


        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].data_hora).toContain("2026-09-10");
    });


    test("Deve retornar 400 para modalidade inválida", async () => {
        const response = await request(app)
            .get("/api/public/partidas")
            .query({ modalidade: "abc" });


        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
    });


    test("Deve ordenar as partidas pela data", async () => {
        await confronto.create({
            data_hora: "2026-09-12T10:00:00.000Z",
            local_partida: "Local 1",
            fase: "Grupos",
            status_confronto: "Agendado",
            id_equipe_1: equipe1.id_equipe,
            id_equipe_2: equipe2.id_equipe,
            id_modalidade: modalidadeTeste.id_modalidade,
            id_grupo: grupoTeste.id_grupo
        });


        await confronto.create({
            data_hora: "2026-09-10T10:00:00.000Z",
            local_partida: "Local 2",
            fase: "Grupos",
            status_confronto: "Agendado",
            id_equipe_1: equipe2.id_equipe,
            id_equipe_2: equipe3.id_equipe,
            id_modalidade: modalidadeTeste.id_modalidade,
            id_grupo: grupoTeste.id_grupo
        });


        const response = await request(app)
            .get("/api/public/partidas");


        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);


        expect(
            new Date(response.body[0].data_hora).getTime()
        ).toBeLessThan(
            new Date(response.body[1].data_hora).getTime()
        );
    });
});


describe("GET /api/public/partidas/:id", () => {

    test("Deve retornar uma partida existente", async () => {
        const partida = await confronto.create({
            data_hora: "2026-09-10T10:00:00.000Z",
            local_partida: "Ginásio Central",
            placar_equipe_1: 2,
            placar_equipe_2: 1,
            fase: "Grupos",
            status_confronto: "Finalizado",
            id_equipe_1: equipe1.id_equipe,
            id_equipe_2: equipe2.id_equipe,
            id_equipe_vencedora: equipe1.id_equipe,
            id_modalidade: modalidadeTeste.id_modalidade,
            id_grupo: grupoTeste.id_grupo
        });


        const response = await request(app)
            .get(`/api/public/partidas/${partida.id_confronto}`);


        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id_confronto");
        expect(Number(response.body.id_confronto))
            .toBe(partida.id_confronto);
        expect(response.body).toHaveProperty("equipe_mandante");
        expect(response.body).toHaveProperty("equipe_visitante");
    });


    test("Deve retornar 404 quando a partida não existir", async () => {
        const response = await request(app)
            .get("/api/public/partidas/99999");


        expect(response.status).toBe(404);
        expect(response.body.msg).toBe("Partida não encontrada.");
    });


    test("Deve retornar 400 quando o ID for inválido", async () => {
        const response = await request(app)
            .get("/api/public/partidas/abc");


        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
    });
});


describe("GET /api/public/resultados", () => {

    test("Deve listar somente resultados finalizados", async () => {
        await confronto.create({
            data_hora: "2026-09-10T10:00:00.000Z",
            local_partida: "Ginásio Central",
            placar_equipe_1: 3,
            placar_equipe_2: 1,
            fase: "Grupos",
            status_confronto: "Finalizado",
            id_equipe_1: equipe1.id_equipe,
            id_equipe_2: equipe2.id_equipe,
            id_equipe_vencedora: equipe1.id_equipe,
            id_modalidade: modalidadeTeste.id_modalidade,
            id_grupo: grupoTeste.id_grupo
        });


        await confronto.create({
            data_hora: "2026-09-11T10:00:00.000Z",
            local_partida: "Ginásio Central",
            fase: "Grupos",
            status_confronto: "Agendado",
            id_equipe_1: equipe2.id_equipe,
            id_equipe_2: equipe3.id_equipe,
            id_modalidade: modalidadeTeste.id_modalidade,
            id_grupo: grupoTeste.id_grupo
        });


        const response = await request(app)
            .get("/api/public/resultados");


        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].status_confronto)
            .toBe("Finalizado");
    });


    test("Deve aceitar filtros nos resultados públicos", async () => {
        await confronto.create({
            data_hora: "2026-09-10T10:00:00.000Z",
            local_partida: "Ginásio Central",
            fase: "Grupos",
            status_confronto: "Finalizado",
            id_equipe_1: equipe1.id_equipe,
            id_equipe_2: equipe2.id_equipe,
            id_modalidade: modalidadeTeste.id_modalidade,
            id_grupo: grupoTeste.id_grupo
        });


        const response = await request(app)
            .get("/api/public/resultados")
            .query({
                modalidade: modalidadeTeste.id_modalidade,
                grupo: grupoTeste.id_grupo
            });


        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].status_confronto)
            .toBe("Finalizado");
    });
});


describe("GET /api/public/classificacao", () => {

    test("Deve retornar a classificação de um grupo", async () => {
        await confronto.create({
            data_hora: "2026-09-10T10:00:00.000Z",
            local_partida: "Ginásio Central",
            placar_equipe_1: 2,
            placar_equipe_2: 0,
            fase: "Grupos",
            status_confronto: "Finalizado",
            id_equipe_1: equipe1.id_equipe,
            id_equipe_2: equipe2.id_equipe,
            id_equipe_vencedora: equipe1.id_equipe,
            id_modalidade: modalidadeTeste.id_modalidade,
            id_grupo: grupoTeste.id_grupo
        });


        const response = await request(app)
            .get("/api/public/classificacao")
            .query({ grupo: grupoTeste.id_grupo });


        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);

        expect(response.body[0]).toHaveProperty("id_grupo");
        expect(response.body[0]).toHaveProperty("nome_grupo");
        expect(response.body[0]).toHaveProperty("ranking");

        expect(response.body[0].ranking).toHaveLength(3);

        const primeiro = response.body[0].ranking[0];

        expect(primeiro.posicao).toBe(1);
        expect(Number(primeiro.id_equipe))
            .toBe(equipe1.id_equipe);
        expect(primeiro.jogos).toBe(1);
        expect(primeiro.vitorias).toBe(1);
        expect(primeiro.pontos).toBe(3);
        expect(primeiro.gols_marcados).toBe(2);
        expect(primeiro.gols_sofridos).toBe(0);
        expect(primeiro.saldo).toBe(2);
    });


    test("Deve retornar todos os grupos quando nenhum grupo for informado", async () => {
        const grupo2 = await grupo.create({
            nome_grupo: "Grupo B",
            id_modalidade: modalidadeTeste.id_modalidade
        });


        const response = await request(app)
            .get("/api/public/classificacao");


        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
    });


    test("Deve retornar 404 quando o grupo não existir", async () => {
        const response = await request(app)
            .get("/api/public/classificacao")
            .query({ grupo: 99999 });


        expect(response.status).toBe(404);
        expect(response.body.msg).toBe("Grupo não encontrado.");
    });


    test("Deve retornar 400 quando o grupo for inválido", async () => {
        const response = await request(app)
            .get("/api/public/classificacao")
            .query({ grupo: "abc" });


        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
    });


    test("Deve calcular empates e derrotas na classificação", async () => {
        await confronto.create({
            data_hora: "2026-09-10T10:00:00.000Z",
            local_partida: "Ginásio Central",
            placar_equipe_1: 1,
            placar_equipe_2: 1,
            fase: "Grupos",
            status_confronto: "Finalizado",
            id_equipe_1: equipe1.id_equipe,
            id_equipe_2: equipe2.id_equipe,
            id_modalidade: modalidadeTeste.id_modalidade,
            id_grupo: grupoTeste.id_grupo
        });


        const response = await request(app)
            .get("/api/public/classificacao")
            .query({ grupo: grupoTeste.id_grupo });


        expect(response.status).toBe(200);


        const ranking = response.body[0].ranking;

        const time1 = ranking.find(
            (team) => Number(team.id_equipe) === equipe1.id_equipe
        );

        const time2 = ranking.find(
            (team) => Number(team.id_equipe) === equipe2.id_equipe
        );


        expect(time1.empates).toBe(1);
        expect(time1.pontos).toBe(1);

        expect(time2.empates).toBe(1);
        expect(time2.pontos).toBe(1);
    });
});