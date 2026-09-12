import {
describe,
test,
expect,
beforeAll,
beforeEach
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
equipe
} from "../src/models/index.js";

const JWT_SECRET =
process.env.JWT_SECRET ||
"Segredo_Mais_Segredo_Dos_Jogos_Internos";

let usuarioAdmin;
let tokenAdmin;
let tokenDocente;
let modalidadeTeste;

beforeAll(async () => {
await conn.sync({ force: true });
});

beforeEach(async () => {
await grupo.destroy({ where: {} });
await equipe.destroy({ where: {} });
await modalidade.destroy({ where: {} });
await usuario.destroy({ where: {} });

usuarioAdmin = await usuario.create({
    nome: "Administrador Teste",
    email: "admin@teste.com",
    senha: bcrypt.hashSync("Senha@123", 10),
    tipo_usuario: "Administrador"
});

tokenAdmin = jwt.sign(
    {
        id: usuarioAdmin.id_usuario,
        email: usuarioAdmin.email,
        tipo_usuario: usuarioAdmin.tipo_usuario
    },
    JWT_SECRET
);

tokenDocente = jwt.sign(
    {
        id: usuarioAdmin.id_usuario,
        email: usuarioAdmin.email,
        tipo_usuario: "Docente"
    },
    JWT_SECRET
);

modalidadeTeste = await modalidade.create({
    nome_modalidade: "Futsal",
    regras: "Regras do futsal",
    categoria: "Masculino"
});

});

describe("GET /api/grupos", () => {

test("Deve listar grupos com status 200", async () => {

    await grupo.create({
        nome_grupo: "Grupo A",
        id_modalidade: modalidadeTeste.id_modalidade
    });

    const response = await request(app)
        .get("/api/grupos");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].nome_grupo).toBe("Grupo A");
});

});

describe("GET /api/grupos/", () => {

test("Deve retornar 404 ao buscar grupo inexistente", async () => {

    const response = await request(app)
        .get("/api/grupos/999");

    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("Grupo não encontrado");
});

test("Deve retornar um grupo existente com status 200", async () => {

    const grupoCriado = await grupo.create({
        nome_grupo: "Grupo A",
        id_modalidade: modalidadeTeste.id_modalidade
    });

    const response = await request(app)
        .get(`/api/grupos/${grupoCriado.id_grupo}`);

    expect(response.status).toBe(200);
    expect(response.body.nome_grupo).toBe("Grupo A");
});

});

describe("POST /api/grupos", () => {

test("Deve retornar 401 ao tentar criar grupo sem autenticação", async () => {

    const response = await request(app)
        .post("/api/grupos")
        .send({
            nome_grupo: "Grupo B",
            id_modalidade: modalidadeTeste.id_modalidade
        });

    expect(response.status).toBe(401);
    expect(response.body.msg).toContain("não fornecido");
});

test("Deve retornar 404 ao criar grupo com modalidade inexistente", async () => {

    const response = await request(app)
        .post("/api/grupos")
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({
            nome_grupo: "Grupo B",
            id_modalidade: 999
        });

    expect(response.status).toBe(404);
    expect(response.body.msg).toBe(
        "A modalidade informada não existe"
    );
});

test("Deve criar um grupo com administrador", async () => {

    const response = await request(app)
        .post("/api/grupos")
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({
            nome_grupo: "Grupo C",
            id_modalidade: modalidadeTeste.id_modalidade
        });

    expect(response.status).toBe(201);
    expect(response.body.nome_grupo).toBe("Grupo C");
    expect(Number(response.body.id_modalidade)).toBe(
        modalidadeTeste.id_modalidade
    );
});

test("Deve bloquear criação de grupo por usuário sem permissão", async () => {

    const response = await request(app)
        .post("/api/grupos")
        .set("Authorization", `Bearer ${tokenDocente}`)
        .send({
            nome_grupo: "Grupo D",
            id_modalidade: modalidadeTeste.id_modalidade
        });

    expect(response.status).toBe(403);
    expect(response.body.msg).toBe(
        "Acesso permitido apenas para administradores."
    );
});

});

describe("PUT /api/grupos/", () => {

test("Deve editar um grupo com administrador", async () => {

    const grupoCriado = await grupo.create({
        nome_grupo: "Grupo A",
        id_modalidade: modalidadeTeste.id_modalidade
    });

    const response = await request(app)
        .put(`/api/grupos/${grupoCriado.id_grupo}`)
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({
            nome_grupo: "Grupo Atualizado"
        });

    expect(response.status).toBe(200);
    expect(response.body.nome_grupo).toBe("Grupo Atualizado");
});

test("Deve retornar 404 ao tentar editar grupo inexistente", async () => {

    const response = await request(app)
        .put("/api/grupos/999")
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({
            nome_grupo: "Grupo Atualizado"
        });

    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("Grupo não encontrado");
});

});

describe("DELETE /api/grupos/", () => {

test("Deve remover um grupo com administrador", async () => {

    const grupoCriado = await grupo.create({
        nome_grupo: "Grupo A",
        id_modalidade: modalidadeTeste.id_modalidade
    });

    const response = await request(app)
        .delete(`/api/grupos/${grupoCriado.id_grupo}`)
        .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(response.status).toBe(204);
});

test("Deve retornar 404 ao tentar remover grupo inexistente", async () => {

    const response = await request(app)
        .delete("/api/grupos/999")
        .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("Grupo não encontrado");
});

test("Deve bloquear remoção de grupo por usuário sem permissão", async () => {

    const response = await request(app)
        .delete("/api/grupos/999")
        .set("Authorization", `Bearer ${tokenDocente}`);

    expect(response.status).toBe(403);
    expect(response.body.msg).toBe(
        "Acesso permitido apenas para administradores."
    );
});

});

describe("GET /api/grupos//equipes", () => {

test("Deve listar as equipes de um grupo", async () => {

    const grupoCriado = await grupo.create({
        nome_grupo: "Grupo A",
        id_modalidade: modalidadeTeste.id_modalidade
    });

    await equipe.create({
        nome_equipe: "Tubarões",
        id_usuario: usuarioAdmin.id_usuario,
        id_grupo: grupoCriado.id_grupo
    });

    const response = await request(app)
        .get(`/api/grupos/${grupoCriado.id_grupo}/equipes`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].nome_equipe).toBe("Tubarões");
});

test("Deve retornar 404 ao buscar equipes de grupo inexistente", async () => {

    const response = await request(app)
        .get("/api/grupos/999/equipes");

    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("Grupo não encontrado.");
});

});

describe("POST /api/grupos//equipes", () => {

test("Deve adicionar uma equipe ao grupo com administrador", async () => {

    const grupoCriado = await grupo.create({
        nome_grupo: "Grupo A",
        id_modalidade: modalidadeTeste.id_modalidade
    });

    const equipeCriada = await equipe.create({
        nome_equipe: "Leões",
        id_usuario: usuarioAdmin.id_usuario
    });

    const response = await request(app)
        .post(`/api/grupos/${grupoCriado.id_grupo}/equipes`)
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({
            id_equipe: equipeCriada.id_equipe
        });

    expect(response.status).toBe(201);
    expect(response.body.msg).toBe(
        "Equipe adicionada ao grupo com sucesso!"
    );
});

test("Deve retornar 404 ao adicionar equipe inexistente ao grupo", async () => {

    const grupoCriado = await grupo.create({
        nome_grupo: "Grupo A",
        id_modalidade: modalidadeTeste.id_modalidade
    });

    const response = await request(app)
        .post(`/api/grupos/${grupoCriado.id_grupo}/equipes`)
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({
            id_equipe: 999
        });

    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("Equipe não encontrada.");
});

test("Deve retornar 404 ao adicionar equipe em grupo inexistente", async () => {

    const equipeCriada = await equipe.create({
        nome_equipe: "Leões",
        id_usuario: usuarioAdmin.id_usuario
    });

    const response = await request(app)
        .post("/api/grupos/999/equipes")
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({
            id_equipe: equipeCriada.id_equipe
        });

    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("Grupo não encontrado.");
});

});

describe("DELETE /api/grupos//equipes/", () => {

test("Deve remover uma equipe do grupo com administrador", async () => {

    const grupoCriado = await grupo.create({
        nome_grupo: "Grupo A",
        id_modalidade: modalidadeTeste.id_modalidade
    });

    const equipeCriada = await equipe.create({
        nome_equipe: "Leões",
        id_usuario: usuarioAdmin.id_usuario,
        id_grupo: grupoCriado.id_grupo
    });

    const response = await request(app)
        .delete(
            `/api/grupos/${grupoCriado.id_grupo}/equipes/${equipeCriada.id_equipe}`
        )
        .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(response.status).toBe(200);
    expect(response.body.msg).toBe(
        "Equipe removida do grupo com sucesso!"
    );
});

test("Deve retornar 404 ao remover equipe inexistente do grupo", async () => {

    const grupoCriado = await grupo.create({
        nome_grupo: "Grupo A",
        id_modalidade: modalidadeTeste.id_modalidade
    });

    const response = await request(app)
        .delete(
            `/api/grupos/${grupoCriado.id_grupo}/equipes/999`
        )
        .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("Equipe não encontrada.");
});

});

describe("POST /api/grupos/sortear", () => {

test("Deve retornar 400 ao sortear sem id_modalidade", async () => {

    const response = await request(app)
        .post("/api/grupos/sortear")
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({});

    expect(response.status).toBe(400);
    expect(response.body.msg).toContain("id_modalidade");
});

test("Deve retornar 404 ao sortear com modalidade inexistente", async () => {

    const response = await request(app)
        .post("/api/grupos/sortear")
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({
            id_modalidade: 999
        });

    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("Modalidade não encontrada.");
});

test("Deve retornar 400 quando não existem grupos para a modalidade", async () => {

    const response = await request(app)
        .post("/api/grupos/sortear")
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({
            id_modalidade: modalidadeTeste.id_modalidade
        });

    expect(response.status).toBe(400);
    expect(response.body.msg).toContain(
        "Não há equipes inscritas"
    );
});

test("Deve retornar 400 quando existem grupos, mas nenhuma equipe está inscrita", async () => {

    await grupo.create({
        nome_grupo: "Grupo A",
        id_modalidade: modalidadeTeste.id_modalidade
    });

    const response = await request(app)
        .post("/api/grupos/sortear")
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({
            id_modalidade: modalidadeTeste.id_modalidade
        });

    expect(response.status).toBe(400);
    expect(response.body.msg).toContain(
        "Não há equipes inscritas"
    );
});

test("Deve sortear equipes entre os grupos com administrador", async () => {

    const grupoA = await grupo.create({
        nome_grupo: "Grupo A",
        id_modalidade: modalidadeTeste.id_modalidade
    });

    const grupoB = await grupo.create({
        nome_grupo: "Grupo B",
        id_modalidade: modalidadeTeste.id_modalidade
    });

    await equipe.create({
        nome_equipe: "Leões",
        id_usuario: usuarioAdmin.id_usuario,
        id_grupo: grupoA.id_grupo
    });

    await equipe.create({
        nome_equipe: "Tigres",
        id_usuario: usuarioAdmin.id_usuario,
        id_grupo: grupoB.id_grupo
    });

    const response = await request(app)
        .post("/api/grupos/sortear")
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({
            id_modalidade: modalidadeTeste.id_modalidade
        });

    expect(response.status).toBe(200);
    expect(response.body.msg).toBe(
        "Sorteio de grupos realizado com sucesso!"
    );
    expect(Array.isArray(response.body.grupos)).toBe(true);
});

test("Deve bloquear sorteio por usuário sem permissão", async () => {

    const response = await request(app)
        .post("/api/grupos/sortear")
        .set("Authorization", `Bearer ${tokenDocente}`)
        .send({
            id_modalidade: modalidadeTeste.id_modalidade
        });

    expect(response.status).toBe(403);
    expect(response.body.msg).toBe(
        "Acesso permitido apenas para administradores."
    );
});

});