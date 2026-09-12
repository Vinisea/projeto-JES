import {
    beforeAll,
    beforeEach,
    describe,
    expect,
    test
} from "vitest";

import request from "supertest";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import app from "../src/app.js";
import { conn } from "../src/config/conn.js";

import {
    usuario,
    modalidade,
    equipe,
    inscricao,
    confronto
} from "../src/models/index.js";

const JWT_SECRET =
    process.env.JWT_SECRET ||
    "Segredo_Mais_Segredo_Dos_Jogos_Internos";

let usuarioAdmin;
let usuarioTeste;
let modalidadeTeste;
let equipeTeste;
let tokenAdmin;
let tokenUsuario;

beforeAll(async () => {
    await conn.sync({ force: true });
});

beforeEach(async () => {
    await inscricao.destroy({ where: {} });
    await equipe.destroy({ where: {} });
    await modalidade.destroy({ where: {} });
    await usuario.destroy({ where: {} });

    const senhaHash = await bcrypt.hash("12345678", 10);

    usuarioAdmin = await usuario.create({
        nome: "Administrador Teste",
        email: "admin@teste.com",
        senha: senhaHash,
        tipo_usuario: "Administrador"
    });

    usuarioTeste = await usuario.create({
        nome: "Usuário Teste",
        email: "usuario@teste.com",
        senha: senhaHash,
        tipo_usuario: "Docente"
    });

    modalidadeTeste = await modalidade.create({
        nome_modalidade: "Futsal",
        regras: "Regras do futsal",
        categoria: "Masculino"
    });

    equipeTeste = await equipe.create({
        nome_equipe: "Leões",
        id_usuario: usuarioAdmin.id_usuario
    });

    tokenAdmin = jwt.sign(
        {
            id: usuarioAdmin.id_usuario,
            email: usuarioAdmin.email,
            tipo_usuario: usuarioAdmin.tipo_usuario
        },
        JWT_SECRET
    );

    tokenUsuario = jwt.sign(
        {
            id: usuarioTeste.id_usuario,
            email: usuarioTeste.email,
            tipo_usuario: usuarioTeste.tipo_usuario
        },
        JWT_SECRET
    );
});

describe("GET /api/inscricoes", () => {
    test("Deve listar inscrições com status 200", async () => {
        await inscricao.create({
            id_equipe: equipeTeste.id_equipe,
            id_modalidade: modalidadeTeste.id_modalidade
        });

        const response = await request(app)
            .get("/api/inscricoes");

        expect(response.status).toBe(200);
        expect(response.ok).toBeTruthy();
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].id_equipe).toBeDefined();
        expect(response.body[0].id_modalidade).toBeDefined();
    });
});

describe("GET /api/inscricoes/:id", () => {
    test("Deve retornar 401 ao buscar inscrição sem autenticação", async () => {
        const response = await request(app)
            .get("/api/inscricoes/1");

        expect(response.status).toBe(401);
        expect(response.body.msg).toContain("não fornecido");
    });

    test("Deve retornar 404 ao buscar inscrição inexistente", async () => {
        const response = await request(app)
            .get("/api/inscricoes/999")
            .set("Authorization", `Bearer ${tokenAdmin}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Inscrição não encontrada");
    });

    test("Deve retornar uma inscrição existente", async () => {
        const novaInscricao = await inscricao.create({
            id_equipe: equipeTeste.id_equipe,
            id_modalidade: modalidadeTeste.id_modalidade
        });

        const response = await request(app)
            .get(`/api/inscricoes/${novaInscricao.id_inscricao}`)
            .set("Authorization", `Bearer ${tokenAdmin}`);

        expect(response.status).toBe(200);
        expect(response.ok).toBeTruthy();
        expect(response.body.id_inscricao).toBe(novaInscricao.id_inscricao);
        expect(Number(response.body.id_equipe)).toBe(equipeTeste.id_equipe);
        expect(Number(response.body.id_modalidade)).toBe(
            modalidadeTeste.id_modalidade
        );
    });
});

describe("POST /api/inscricoes", () => {
    test("Deve retornar 401 ao criar inscrição sem autenticação", async () => {
        const response = await request(app)
            .post("/api/inscricoes")
            .send({
                id_equipe: equipeTeste.id_equipe,
                id_modalidade: modalidadeTeste.id_modalidade
            });

        expect(response.status).toBe(401);
        expect(response.body.msg).toContain("não fornecido");
    });

    test("Deve retornar 403 ao criar inscrição com usuário que não é administrador", async () => {
        const response = await request(app)
            .post("/api/inscricoes")
            .set("Authorization", `Bearer ${tokenUsuario}`)
            .send({
                id_equipe: equipeTeste.id_equipe,
                id_modalidade: modalidadeTeste.id_modalidade
            });

        expect(response.status).toBe(403);
        expect(response.body.msg).toContain("administradores");
    });

    test("Deve retornar 404 quando a equipe não existir", async () => {
        const response = await request(app)
            .post("/api/inscricoes")
            .set("Authorization", `Bearer ${tokenAdmin}`)
            .send({
                id_equipe: 999,
                id_modalidade: modalidadeTeste.id_modalidade
            });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Equipe não encontrada");
    });

    test("Deve retornar 404 quando a modalidade não existir", async () => {
        const response = await request(app)
            .post("/api/inscricoes")
            .set("Authorization", `Bearer ${tokenAdmin}`)
            .send({
                id_equipe: equipeTeste.id_equipe,
                id_modalidade: 999
            });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Modalidade não encontrada");
    });

    test("Deve retornar 409 ao tentar criar inscrição duplicada", async () => {
        await inscricao.create({
            id_equipe: equipeTeste.id_equipe,
            id_modalidade: modalidadeTeste.id_modalidade
        });

        const response = await request(app)
            .post("/api/inscricoes")
            .set("Authorization", `Bearer ${tokenAdmin}`)
            .send({
                id_equipe: equipeTeste.id_equipe,
                id_modalidade: modalidadeTeste.id_modalidade
            });

        expect(response.status).toBe(409);
        expect(response.body.message).toBe(
            "A equipe já está inscrita nesta modalidade"
        );
    });

    test("Deve criar uma inscrição válida", async () => {
        const response = await request(app)
            .post("/api/inscricoes")
            .set("Authorization", `Bearer ${tokenAdmin}`)
            .send({
                id_equipe: equipeTeste.id_equipe,
                id_modalidade: modalidadeTeste.id_modalidade
            });

        expect(response.status).toBe(201);
        expect(response.ok).toBeTruthy();
        expect(response.body.id_inscricao).toBeDefined();
        expect(Number(response.body.id_equipe)).toBe(equipeTeste.id_equipe);
        expect(Number(response.body.id_modalidade)).toBe(
            modalidadeTeste.id_modalidade
        );
    });
});

describe("DELETE /api/inscricoes/:id", () => {
    test("Deve retornar 401 ao remover inscrição sem autenticação", async () => {
        const response = await request(app)
            .delete("/api/inscricoes/1");

        expect(response.status).toBe(401);
        expect(response.body.msg).toContain("não fornecido");
    });

    test("Deve retornar 403 ao remover inscrição sem ser administrador", async () => {
        const novaInscricao = await inscricao.create({
            id_equipe: equipeTeste.id_equipe,
            id_modalidade: modalidadeTeste.id_modalidade
        });

        const response = await request(app)
            .delete(`/api/inscricoes/${novaInscricao.id_inscricao}`)
            .set("Authorization", `Bearer ${tokenUsuario}`);

        expect(response.status).toBe(403);
        expect(response.body.msg).toContain("administradores");
    });

    test("Deve retornar 404 ao remover inscrição inexistente", async () => {
        const response = await request(app)
            .delete("/api/inscricoes/999")
            .set("Authorization", `Bearer ${tokenAdmin}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Inscrição não encontrada");
    });

    test("Deve remover uma inscrição válida", async () => {
        const novaInscricao = await inscricao.create({
            id_equipe: equipeTeste.id_equipe,
            id_modalidade: modalidadeTeste.id_modalidade
        });

        const response = await request(app)
            .delete(`/api/inscricoes/${novaInscricao.id_inscricao}`)
            .set("Authorization", `Bearer ${tokenAdmin}`);

        expect(response.status).toBe(204);

        const inscricaoRemovida = await inscricao.findByPk(
            novaInscricao.id_inscricao
        );

        expect(inscricaoRemovida).toBeNull();
    });


    test("Deve impedir remoção de inscrição vinculada a partidas", async () => {
    const novaInscricao = await inscricao.create({
        id_equipe: equipeTeste.id_equipe,
        id_modalidade: modalidadeTeste.id_modalidade
    });

    await confronto.create({
        data_hora: new Date(),
        local_partida: "Quadra Principal",
        fase: "Grupos",
        status_confronto: "Agendado",
        id_equipe_1: equipeTeste.id_equipe,
        id_equipe_2: equipeTeste.id_equipe,
        id_modalidade: modalidadeTeste.id_modalidade,
        id_grupo: null
    });

    const response = await request(app)
        .delete(`/api/inscricoes/${novaInscricao.id_inscricao}`)
        .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(response.status).toBe(409);
    expect(response.body.message).toBe(
        "Não é possível remover inscrição vinculada a partidas."
    );

    const inscricaoMantida = await inscricao.findByPk(
        novaInscricao.id_inscricao
    );

    expect(inscricaoMantida).not.toBeNull();
});

});