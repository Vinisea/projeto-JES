import {
    describe,
    test,
    expect,
    beforeAll,
    beforeEach
} from "vitest";

import request from "supertest";
import jwt from "jsonwebtoken";

import app from "../src/app.js";
import { conn } from "../src/config/conn.js";
import { turma, usuario } from "../src/models/index.js";

const JWT_SECRET =
    process.env.JWT_SECRET ||
    "Segredo_Mais_Segredo_Dos_Jogos_Internos";

let usuarioTeste;

const criarToken = () =>
    jwt.sign(
        {
            id: usuarioTeste.id_usuario,
            email: usuarioTeste.email,
            tipo_usuario: usuarioTeste.tipo_usuario
        },
        JWT_SECRET
    );

beforeAll(async () => {
    await conn.sync({ force: true });
});

beforeEach(async () => {
    await turma.destroy({ where: {} });
    await usuario.destroy({ where: {} });

    usuarioTeste = await usuario.create({
        nome: "Usuario Teste",
        email: "turma@teste.com",
        senha: "12345678",
        tipo_usuario: "Administrador"
    });
});

describe("GET /api/turmas", () => {
    test("Deve listar turmas cadastradas", async () => {
        await turma.create({
            nome_turma: "Turma Alpha",
            serie: "2025"
        });

        const response = await request(app)
            .get("/api/turmas");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].nome_turma).toBe("Turma Alpha");
    });

    test("Deve retornar lista vazia quando não houver turmas", async () => {
        const response = await request(app)
            .get("/api/turmas");

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });
});

describe("POST /api/turmas", () => {
    test("Deve retornar 401 ao tentar criar turma sem autenticação", async () => {
        const response = await request(app)
            .post("/api/turmas")
            .send({
                nome_turma: "Turma Sem Token",
                serie: "2025"
            });

        expect(response.status).toBe(401);
    });

    test("Deve criar uma turma com token válido", async () => {
        const token = criarToken();

        const response = await request(app)
            .post("/api/turmas")
            .set("Authorization", `Bearer ${token}`)
            .send({
                nome_turma: "Turma Nova",
                serie: "2025"
            });

        expect(response.status).toBe(201);
        expect(response.body.nome_turma).toBe("Turma Nova");
        expect(response.body.serie).toBe("2025");
    });

    test("Deve retornar erro ao criar turma sem nome", async () => {
        const token = criarToken();

        const response = await request(app)
            .post("/api/turmas")
            .set("Authorization", `Bearer ${token}`)
            .send({
                serie: "2025"
            });

        expect(response.status).toBe(400);
    });
});

describe("GET /api/turmas/:id", () => {
    test("Deve buscar uma turma por id", async () => {
        const turmaCriada = await turma.create({
            nome_turma: "Turma Busca",
            serie: "2026"
        });

        const response = await request(app)
            .get(`/api/turmas/${turmaCriada.id_turma}`);

        expect(response.status).toBe(200);
        expect(Number(response.body.id_turma))
            .toBe(turmaCriada.id_turma);
        expect(response.body.nome_turma).toBe("Turma Busca");
    });

    test("Deve retornar 404 ao buscar turma inexistente", async () => {
        const response = await request(app)
            .get("/api/turmas/999999");

        expect(response.status).toBe(404);
        expect(response.body.msg)
            .toContain("Turma não encontrada");
    });
});

describe("PUT /api/turmas/:id", () => {
    test("Deve atualizar uma turma com token válido", async () => {
        const turmaCriada = await turma.create({
            nome_turma: "Turma Antiga",
            serie: "2024"
        });

        const token = criarToken();

        const response = await request(app)
            .put(`/api/turmas/${turmaCriada.id_turma}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                nome_turma: "Turma Atualizada",
                serie: "2025"
            });

        expect(response.status).toBe(200);
        expect(response.body.nome_turma).toBe("Turma Atualizada");
        expect(response.body.serie).toBe("2025");
    });

    test("Deve retornar 401 ao tentar atualizar sem autenticação", async () => {
        const turmaCriada = await turma.create({
            nome_turma: "Turma Antiga",
            serie: "2024"
        });

        const response = await request(app)
            .put(`/api/turmas/${turmaCriada.id_turma}`)
            .send({
                nome_turma: "Turma Atualizada"
            });

        expect(response.status).toBe(401);
    });

    test("Deve retornar 404 ao atualizar turma inexistente", async () => {
        const token = criarToken();

        const response = await request(app)
            .put("/api/turmas/999999")
            .set("Authorization", `Bearer ${token}`)
            .send({
                nome_turma: "Turma Atualizada"
            });

        expect(response.status).toBe(404);
        expect(response.body.msg)
            .toContain("Turma não encontrada");
    });
});

describe("DELETE /api/turmas/:id", () => {
    test("Deve remover uma turma existente", async () => {
        const turmaCriada = await turma.create({
            nome_turma: "Turma Delete",
            serie: "2024"
        });

        const token = criarToken();

        const response = await request(app)
            .delete(`/api/turmas/${turmaCriada.id_turma}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(204);
    });

    test("Deve retornar 401 ao tentar remover sem autenticação", async () => {
        const turmaCriada = await turma.create({
            nome_turma: "Turma Delete",
            serie: "2024"
        });

        const response = await request(app)
            .delete(`/api/turmas/${turmaCriada.id_turma}`);

        expect(response.status).toBe(401);
    });

    test("Deve retornar 404 ao remover turma inexistente", async () => {
        const token = criarToken();

        const response = await request(app)
            .delete("/api/turmas/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.msg)
            .toContain("Turma não encontrada");
    });
});