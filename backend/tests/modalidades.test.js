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
    grupo,
    equipe,
    confronto
} from "../src/models/index.js";

const JWT_SECRET =
    process.env.JWT_SECRET ||
    "Segredo_Mais_Segredo_Dos_Jogos_Internos";

let usuarioAdmin;
let usuarioTeste;
let modalidadeTeste;
let tokenAdmin;
let tokenUsuario;

beforeAll(async () => {
    await conn.sync({ force: true });
});

beforeEach(async () => {
    await confronto.destroy({ where: {} });
    await equipe.destroy({ where: {} });
    await grupo.destroy({ where: {} });
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

describe("GET /api/modalidades", () => {
    test("Deve listar as modalidades com status 200", async () => {
        const response = await request(app)
            .get("/api/modalidades");

        expect(response.status).toBe(200);
        expect(response.ok).toBeTruthy();
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].nome_modalidade).toBe("Futsal");
    });
});

describe("GET /api/modalidades/:id", () => {
    test("Deve retornar uma modalidade existente", async () => {
        const response = await request(app)
            .get(`/api/modalidades/${modalidadeTeste.id_modalidade}`);

        expect(response.status).toBe(200);
        expect(response.ok).toBeTruthy();
        expect(response.body.nome_modalidade).toBe("Futsal");
        expect(response.body.categoria).toBe("Masculino");
    });

    test("Deve retornar 404 ao buscar modalidade inexistente", async () => {
        const response = await request(app)
            .get("/api/modalidades/999");

        expect(response.status).toBe(404);
        expect(response.body.message).toBe(
            "Modalidade não encontrada"
        );
    });
});

describe("POST /api/modalidades", () => {
    test("Deve retornar 401 ao criar modalidade sem autenticação", async () => {
        const response = await request(app)
            .post("/api/modalidades")
            .send({
                nome_modalidade: "Basquete",
                regras: "Regras do basquete",
                categoria: "Masculino"
            });

        expect(response.status).toBe(401);
        expect(response.body.msg).toContain("não fornecido");
    });

    test("Deve retornar 403 ao criar modalidade com usuário não administrador", async () => {
        const response = await request(app)
            .post("/api/modalidades")
            .set("Authorization", `Bearer ${tokenUsuario}`)
            .send({
                nome_modalidade: "Vôlei",
                regras: "Regras do vôlei",
                categoria: "Feminino"
            });

        expect(response.status).toBe(403);
        expect(response.body.msg).toBe(
            "Acesso permitido apenas para administradores."
        );
    });

    test("Deve criar modalidade com usuário administrador", async () => {
        const response = await request(app)
            .post("/api/modalidades")
            .set("Authorization", `Bearer ${tokenAdmin}`)
            .send({
                nome_modalidade: "Tênis",
                regras: "Regras do tênis",
                categoria: "Masculino"
            });

        expect(response.status).toBe(201);
        expect(response.ok).toBeTruthy();
        expect(response.body.nome_modalidade).toBe("Tênis");
        expect(response.body.categoria).toBe("Masculino");
    });
});

describe("PUT /api/modalidades/:id", () => {
    test("Deve retornar 401 ao editar modalidade sem autenticação", async () => {
        const response = await request(app)
            .put(`/api/modalidades/${modalidadeTeste.id_modalidade}`)
            .send({
                nome_modalidade: "Futsal Atualizado"
            });

        expect(response.status).toBe(401);
        expect(response.body.msg).toContain("não fornecido");
    });

    test("Deve editar modalidade com administrador", async () => {
        const response = await request(app)
            .put(`/api/modalidades/${modalidadeTeste.id_modalidade}`)
            .set("Authorization", `Bearer ${tokenAdmin}`)
            .send({
                nome_modalidade: "Futsal Atualizado",
                regras: "Novas regras",
                categoria: "Feminino"
            });

        expect(response.status).toBe(200);
        expect(response.body.nome_modalidade).toBe(
            "Futsal Atualizado"
        );
        expect(response.body.categoria).toBe("Feminino");
    });

    test("Deve retornar 404 ao editar modalidade inexistente", async () => {
        const response = await request(app)
            .put("/api/modalidades/999")
            .set("Authorization", `Bearer ${tokenAdmin}`)
            .send({
                nome_modalidade: "Nova modalidade"
            });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe(
            "Modalidade não encontrada"
        );
    });

    test("Deve retornar 401 ao editar com token inválido", async () => {
        const response = await request(app)
            .put(`/api/modalidades/${modalidadeTeste.id_modalidade}`)
            .set("Authorization", "Bearer token-invalido")
            .send({
                nome_modalidade: "Futsal 2"
            });

        expect(response.status).toBe(401);
        expect(response.body.msg).toContain("inválido");
    });
});

describe("DELETE /api/modalidades/:id", () => {
    test("Deve retornar 401 ao remover modalidade sem autenticação", async () => {
        const response = await request(app)
            .delete(`/api/modalidades/${modalidadeTeste.id_modalidade}`);

        expect(response.status).toBe(401);
        expect(response.body.msg).toContain("não fornecido");
    });

    test("Deve retornar 404 ao remover modalidade inexistente", async () => {
        const response = await request(app)
            .delete("/api/modalidades/999")
            .set("Authorization", `Bearer ${tokenAdmin}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe(
            "Modalidade não encontrada"
        );
    });

    test("Deve remover modalidade com administrador", async () => {
        const modalidadeRemover = await modalidade.create({
            nome_modalidade: "Basquete",
            regras: "Regras do basquete",
            categoria: "Masculino"
        });

        const response = await request(app)
            .delete(`/api/modalidades/${modalidadeRemover.id_modalidade}`)
            .set("Authorization", `Bearer ${tokenAdmin}`);

        expect(response.status).toBe(204);

        const modalidadeExcluida = await modalidade.findByPk(
            modalidadeRemover.id_modalidade
        );

        expect(modalidadeExcluida).toBeNull();
    });
});

describe("GET /api/modalidades/:id/resultado-final", () => {
    test("Deve retornar 401 ao consultar resultado final sem autenticação", async () => {
        const response = await request(app)
            .get(
                `/api/modalidades/${modalidadeTeste.id_modalidade}/resultado-final`
            );

        expect(response.status).toBe(401);
        expect(response.body.msg).toContain("não fornecido");
    });

    test("Deve retornar 404 ao consultar resultado final de modalidade inexistente", async () => {
        const response = await request(app)
            .get("/api/modalidades/999/resultado-final")
            .set("Authorization", `Bearer ${tokenAdmin}`);

        expect(response.status).toBe(404);
        expect(response.body.msg).toBe(
            "Modalidade não encontrada."
        );
    });

    test("Deve calcular o resultado final da modalidade", async () => {
        const grupoTeste = await grupo.create({
            nome_grupo: "Grupo A",
            id_modalidade: modalidadeTeste.id_modalidade
        });

        const equipe1 = await equipe.create({
            nome_equipe: "Leões",
            id_usuario: usuarioAdmin.id_usuario,
            id_grupo: grupoTeste.id_grupo
        });

        const equipe2 = await equipe.create({
            nome_equipe: "Águias",
            id_usuario: usuarioAdmin.id_usuario,
            id_grupo: grupoTeste.id_grupo
        });

        await confronto.create({
            data_hora: new Date(),
            local_partida: "Quadra Principal",
            placar_equipe_1: 3,
            placar_equipe_2: 1,
            fase: "Grupos",
            status_confronto: "Finalizado",
            id_equipe_1: equipe1.id_equipe,
            id_equipe_2: equipe2.id_equipe,
            id_modalidade: modalidadeTeste.id_modalidade,
            id_grupo: grupoTeste.id_grupo
        });

        const response = await request(app)
            .get(
                `/api/modalidades/${modalidadeTeste.id_modalidade}/resultado-final`
            )
            .set("Authorization", `Bearer ${tokenAdmin}`);

        expect(response.status).toBe(200);
        expect(response.ok).toBeTruthy();

        expect(response.body.modalidade).toBe("Futsal");
        expect(response.body.categoria).toBe("Masculino");
        expect(response.body.total_equipes).toBe(2);

        expect(response.body.podio).toHaveLength(2);
        expect(response.body.classificacao_completa).toHaveLength(2);

        expect(response.body.classificacao_completa[0].nome_equipe)
            .toBe("Leões");

        expect(response.body.classificacao_completa[0].posicao)
            .toBe("1º");

        expect(response.body.classificacao_completa[0].pontos_partida)
            .toBe(3);

        expect(response.body.classificacao_completa[0].vitorias)
            .toBe(1);

        expect(response.body.classificacao_completa[0].pontos_gerais_conquistados)
            .toBe(100);

        expect(response.body.classificacao_completa[1].nome_equipe)
            .toBe("Águias");

        expect(response.body.classificacao_completa[1].posicao)
            .toBe("2º");

        expect(response.body.classificacao_completa[1].pontos_partida)
            .toBe(0);

        expect(response.body.classificacao_completa[1].pontos_gerais_conquistados)
            .toBe(70);
    });
});