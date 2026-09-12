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
let grupoTeste;
let equipe1;
let equipe2;


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
        nome: "Usuario Ranking",
        email: "ranking@teste.com",
        senha: "12345678",
        tipo_usuario: "Administrador"
    });


    modalidadeTeste = await modalidade.create({
        nome_modalidade: "Futsal",
        regras: "Regras do futsal",
        categoria: "Masculino"
    });


    grupoTeste = await grupo.create({
        nome_grupo: "Grupo A",
        id_modalidade: modalidadeTeste.id_modalidade
    });


    equipe1 = await equipe.create({
        nome_equipe: "Leões",
        id_usuario: usuarioTeste.id_usuario,
        id_grupo: grupoTeste.id_grupo
    });


    equipe2 = await equipe.create({
        nome_equipe: "Tubarões",
        id_usuario: usuarioTeste.id_usuario,
        id_grupo: grupoTeste.id_grupo
    });
});


describe("GET /api/ranking/geral", () => {

    test("Deve retornar o ranking geral com status 200", async () => {
        await confronto.create({
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
            .get("/api/ranking/geral");


        expect(response.status).toBe(200);
        expect(response.body.titulo)
            .toBe("Ranking Geral do Campeonato");
        expect(Array.isArray(response.body.ranking))
            .toBe(true);
        expect(response.body.ranking).toHaveLength(2);
    });


    test("Deve retornar ranking vazio quando não houver resultados finalizados", async () => {
        const response = await request(app)
            .get("/api/ranking/geral");


        expect(response.status).toBe(200);
        expect(response.body.ranking).toEqual([]);
    });


    test("Deve atribuir pontuação geral de acordo com a posição", async () => {
        await confronto.create({
            data_hora: "2026-09-10T10:00:00.000Z",
            local_partida: "Ginásio Central",
            placar_equipe_1: 3,
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
            .get("/api/ranking/geral");


        expect(response.status).toBe(200);


        const primeiro = response.body.ranking[0];
        const segundo = response.body.ranking[1];


        expect(primeiro.posicao).toBe("1º");
        expect(primeiro.equipe).toBe("Leões");
        expect(primeiro.pontos_gerais).toBe(100);


        expect(segundo.posicao).toBe("2º");
        expect(segundo.equipe).toBe("Tubarões");
        expect(segundo.pontos_gerais).toBe(70);
    });
});


describe("GET /api/ranking/grupo/:grupoId", () => {

    test("Deve retornar o ranking por grupo com status 200", async () => {
        await confronto.create({
            data_hora: "2026-09-10T10:00:00.000Z",
            local_partida: "Ginásio Central",
            placar_equipe_1: 3,
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
            .get(`/api/ranking/grupo/${grupoTeste.id_grupo}`);


        expect(response.status).toBe(200);
        expect(response.body.grupo).toBe("Grupo A");
        expect(response.body.id_modalidade)
            .toBe(modalidadeTeste.id_modalidade);
        expect(Array.isArray(response.body.ranking))
            .toBe(true);
        expect(response.body.ranking).toHaveLength(2);
    });


    test("Deve retornar 404 para grupo inexistente", async () => {
        const response = await request(app)
            .get("/api/ranking/grupo/99999");


        expect(response.status).toBe(404);
        expect(response.body.msg)
            .toBe("Grupo não encontrado.");
    });


    test("Deve calcular vitória e derrota no ranking do grupo", async () => {
        await confronto.create({
            data_hora: "2026-09-10T10:00:00.000Z",
            local_partida: "Ginásio Central",
            placar_equipe_1: 4,
            placar_equipe_2: 2,
            fase: "Grupos",
            status_confronto: "Finalizado",
            id_equipe_1: equipe1.id_equipe,
            id_equipe_2: equipe2.id_equipe,
            id_equipe_vencedora: equipe1.id_equipe,
            id_modalidade: modalidadeTeste.id_modalidade,
            id_grupo: grupoTeste.id_grupo
        });


        const response = await request(app)
            .get(`/api/ranking/grupo/${grupoTeste.id_grupo}`);


        const primeiro = response.body.ranking[0];
        const segundo = response.body.ranking[1];


        expect(primeiro.vitorias).toBe(1);
        expect(primeiro.derrotas).toBe(0);
        expect(primeiro.pontos).toBe(3);


        expect(segundo.vitorias).toBe(0);
        expect(segundo.derrotas).toBe(1);
        expect(segundo.pontos).toBe(0);
    });


    test("Deve calcular gols e saldo no ranking do grupo", async () => {
        await confronto.create({
            data_hora: "2026-09-10T10:00:00.000Z",
            local_partida: "Ginásio Central",
            placar_equipe_1: 5,
            placar_equipe_2: 2,
            fase: "Grupos",
            status_confronto: "Finalizado",
            id_equipe_1: equipe1.id_equipe,
            id_equipe_2: equipe2.id_equipe,
            id_equipe_vencedora: equipe1.id_equipe,
            id_modalidade: modalidadeTeste.id_modalidade,
            id_grupo: grupoTeste.id_grupo
        });


        const response = await request(app)
            .get(`/api/ranking/grupo/${grupoTeste.id_grupo}`);


        const primeiro = response.body.ranking[0];
        const segundo = response.body.ranking[1];


        expect(primeiro.gols_marcados).toBe(5);
        expect(primeiro.gols_sofridos).toBe(2);
        expect(primeiro.saldo).toBe(3);


        expect(segundo.gols_marcados).toBe(2);
        expect(segundo.gols_sofridos).toBe(5);
        expect(segundo.saldo).toBe(-3);
    });
});


describe("GET /api/ranking/modalidade/:modalidadeId", () => {

    test("Deve retornar o ranking por modalidade com status 200", async () => {
        await confronto.create({
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
            .get(`/api/ranking/modalidade/${modalidadeTeste.id_modalidade}`);


        expect(response.status).toBe(200);
        expect(response.body.modalidade)
            .toBe("Futsal");
        expect(response.body.categoria)
            .toBe("Masculino");
        expect(Array.isArray(response.body.grupos))
            .toBe(true);
        expect(response.body.grupos).toHaveLength(1);
    });


    test("Deve retornar 404 para modalidade inexistente", async () => {
        const response = await request(app)
            .get("/api/ranking/modalidade/99999");


        expect(response.status).toBe(404);
        expect(response.body.msg)
            .toBe("Modalidade não encontrada.");
    });


    test("Deve retornar ranking vazio quando o grupo não possuir resultados finalizados", async () => {
        const response = await request(app)
            .get(`/api/ranking/modalidade/${modalidadeTeste.id_modalidade}`);


        expect(response.status).toBe(200);
        expect(response.body.grupos).toHaveLength(1);
        expect(response.body.grupos[0].ranking).toHaveLength(2);


        expect(response.body.grupos[0].ranking[0].pontos)
            .toBe(0);
        expect(response.body.grupos[0].ranking[1].pontos)
            .toBe(0);
    });
});


describe("GET /api/ranking/turma/:turmaId", () => {

    test("Deve informar que o ranking por turma ainda não foi implementado", async () => {
        const response = await request(app)
            .get("/api/ranking/turma/5");


        expect(response.status).toBe(501);
        expect(response.body.msg)
            .toBe("Ranking por turma ainda não implementado.");
    });
});