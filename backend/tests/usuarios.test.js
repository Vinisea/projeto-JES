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

import {
    usuario,
    equipe,
    atleta,
    inscricao,
    confronto,
    grupo,
    modalidade
} from "../src/models/index.js";

const JWT_SECRET =
    process.env.JWT_SECRET ||
    "Segredo_Mais_Segredo_Dos_Jogos_Internos";

let usuarioAdmin;

const criarToken = (
    tipo_usuario = "Administrador"
) =>
    jwt.sign(
        {
            id: usuarioAdmin.id_usuario,
            email: usuarioAdmin.email,
            tipo_usuario
        },
        JWT_SECRET
    );

beforeAll(async () => {
    await conn.sync({ force: true });
});

beforeEach(async () => {
    await confronto.destroy({ where: {} });
    await atleta.destroy({ where: {} });
    await inscricao.destroy({ where: {} });
    await equipe.destroy({ where: {} });
    await grupo.destroy({ where: {} });
    await modalidade.destroy({ where: {} });
    await usuario.destroy({ where: {} });

    usuarioAdmin = await usuario.create({
        nome: "Administrador Teste",
        email: "admin@teste.com",
        senha: "12345678",
        tipo_usuario: "Administrador"
    });
});

describe("GET /api/usuarios", () => {
    test("Deve listar usuários somente para administradores", async () => {
        await usuario.create({
            nome: "Ana Teste",
            email: "ana@teste.com",
            senha: "12345678",
            tipo_usuario: "Docente"
        });

        const token = criarToken();

        const response = await request(app)
            .get("/api/usuarios")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toHaveLength(2);
        expect(response.body.some(
            usuario => usuario.email === "ana@teste.com"
        )).toBe(true);
    });

    test("Deve retornar 401 sem token", async () => {
        const response = await request(app)
            .get("/api/usuarios");

        expect(response.status).toBe(401);
    });

    test("Deve retornar 403 para usuário sem permissão de administrador", async () => {
        const token = criarToken("Docente");

        const response = await request(app)
            .get("/api/usuarios")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(403);
        expect(response.body.msg)
            .toBe("Permissão insuficiente para esta operação.");
    });
});

describe("GET /api/usuarios/:id", () => {
    test("Deve buscar um usuário pelo id", async () => {
        const usuarioCriado = await usuario.create({
            nome: "Carlos Teste",
            email: "carlos@teste.com",
            senha: "12345678",
            tipo_usuario: "Docente"        
          });

        const token = criarToken();

        const response = await request(app)
            .get(`/api/usuarios/${usuarioCriado.id_usuario}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Number(response.body.id_usuario))
            .toBe(usuarioCriado.id_usuario);
        expect(response.body.email).toBe("carlos@teste.com");
    });

    test("Deve retornar 404 para usuário inexistente", async () => {
        const token = criarToken();

        const response = await request(app)
            .get("/api/usuarios/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.msg)
            .toBe("Usuário não encontrado.");
    });

    test("Deve retornar 401 sem autenticação", async () => {
        const response = await request(app)
            .get("/api/usuarios/1");

        expect(response.status).toBe(401);
    });
});

describe("POST /api/usuarios", () => {
    test("Deve criar um usuário com dados válidos", async () => {
        const token = criarToken();

        const response = await request(app)
            .post("/api/usuarios")
            .set("Authorization", `Bearer ${token}`)
            .send({
                nome: "Bruno Teste",
                email: "bruno@teste.com",
                senha: "12345678",
                tipo_usuario: "Docente"
            });

        expect(response.status).toBe(201);
        expect(response.body.nome).toBe("Bruno Teste");
        expect(response.body.email).toBe("bruno@teste.com");
        expect(response.body.tipo_usuario).toBe("Docente");
    });

    test("Deve retornar 400 sem dados obrigatórios", async () => {
        const token = criarToken();

        const response = await request(app)
            .post("/api/usuarios")
            .set("Authorization", `Bearer ${token}`)
            .send({
                nome: "Sem Email"
            });

        expect(response.status).toBe(400);
        expect(response.body.msg)
            .toContain(
                "nome, email, senha e tipo_usuario são obrigatórios"
            );
    });

    test("Deve retornar 400 ao criar usuário com e-mail vazio", async () => {
        const token = criarToken();

        const response = await request(app)
            .post("/api/usuarios")
            .set("Authorization", `Bearer ${token}`)
            .send({
                nome: "Teste",
                email: "",
                senha: "12345678",
                tipo_usuario: "Docente"
            });

        expect(response.status).toBe(400);
        expect(response.body.msg)
            .toContain("obrigatórios");
    });

    test("Deve retornar 400 ao criar usuário com e-mail duplicado", async () => {
        const token = criarToken();

        const response = await request(app)
            .post("/api/usuarios")
            .set("Authorization", `Bearer ${token}`)
            .send({
                nome: "Outro Administrador",
                email: "admin@teste.com",
                senha: "12345678",
                tipo_usuario: "Administrador"
            });

        expect(response.status).toBe(400);
    });

    test("Deve retornar 401 sem autenticação", async () => {
        const response = await request(app)
            .post("/api/usuarios")
            .send({
                nome: "Sem Token",
                email: "semtoken@teste.com",
                senha: "12345678",
                tipo_usuario: "Docente"
            });

        expect(response.status).toBe(401);
    });
});

describe("PUT /api/usuarios/:id", () => {
    test("Deve atualizar um usuário existente", async () => {
        const usuarioCriado = await usuario.create({
            nome: "Maria Teste",
            email: "maria@teste.com",
            senha: "12345678",
            tipo_usuario: "Docente"
        });

        const token = criarToken();

        const response = await request(app)
            .put(`/api/usuarios/${usuarioCriado.id_usuario}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                nome: "Maria Silva"
            });

        expect(response.status).toBe(200);
        expect(response.body.nome).toBe("Maria Silva");
    });

    test("Deve atualizar a senha de um usuário", async () => {
        const usuarioCriado = await usuario.create({
            nome: "Pedro Teste",
            email: "pedro@teste.com",
            senha: "12345678",
            tipo_usuario: "Docente"
        });

        const token = criarToken();

        const response = await request(app)
            .put(`/api/usuarios/${usuarioCriado.id_usuario}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                senha: "novasenha123"
            });

        expect(response.status).toBe(200);

        const usuarioAtualizado = await usuario.scope("comSenha")
            .findByPk(usuarioCriado.id_usuario);

        expect(usuarioAtualizado.senha)
            .not.toBe("novasenha123");
    });

    test("Deve retornar 404 ao atualizar usuário inexistente", async () => {
        const token = criarToken();

        const response = await request(app)
            .put("/api/usuarios/999999")
            .set("Authorization", `Bearer ${token}`)
            .send({
                nome: "Novo Nome"
            });

        expect(response.status).toBe(404);
        expect(response.body.msg)
            .toBe("Usuário não encontrado.");
    });

    test("Deve retornar 401 sem autenticação", async () => {
        const usuarioCriado = await usuario.create({
            nome: "Sem Token",
            email: "put@teste.com",
            senha: "12345678",
            tipo_usuario: "Docente"
        });

        const response = await request(app)
            .put(`/api/usuarios/${usuarioCriado.id_usuario}`)
            .send({
                nome: "Alterado"
            });

        expect(response.status).toBe(401);
    });
});

describe("DELETE /api/usuarios/:id", () => {
    test("Deve remover um usuário existente", async () => {
        const usuarioCriado = await usuario.create({
            nome: "Pedro Teste",
            email: "pedro@teste.com",
            senha: "12345678",
            tipo_usuario: "Docente"
        });

        const token = criarToken();

        const response = await request(app)
            .delete(`/api/usuarios/${usuarioCriado.id_usuario}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(204);

        const usuarioRemovido = await usuario.findByPk(
            usuarioCriado.id_usuario
        );

        expect(usuarioRemovido).toBeNull();
    });

    test("Deve retornar 404 ao remover usuário inexistente", async () => {
        const token = criarToken();

        const response = await request(app)
            .delete("/api/usuarios/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.msg)
            .toBe("Usuário não encontrado.");
    });

    test("Deve retornar 401 sem autenticação", async () => {
        const usuarioCriado = await usuario.create({
            nome: "Sem Token",
            email: "delete@teste.com",
            senha: "12345678",
            tipo_usuario: "Docente"
        });

        const response = await request(app)
            .delete(`/api/usuarios/${usuarioCriado.id_usuario}`);

        expect(response.status).toBe(401);
    });
});