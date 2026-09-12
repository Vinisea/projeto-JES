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
import { equipe, atleta } from "../src/models/index.js";
import bcrypt from "bcrypt";
import { equipe, atleta, usuario } from "../src/models/index.js";

const JWT_SECRET =
process.env.JWT_SECRET ||
"Segredo_Mais_Segredo_Dos_Jogos_Internos";

let tokenAdmin;
let tokenDocente;

beforeAll(async () => {
await conn.sync({ force: true });
});

let usuarioTeste;

beforeEach(async () => {
    await atleta.destroy({ where: {} });
    await equipe.destroy({ where: {} });
    await usuario.destroy({ where: {} });

    usuarioTeste = await usuario.create({
        nome: "Administrador Teste",
        email: "admin@teste.com",
        senha: bcrypt.hashSync("Senha@123", 10),
        tipo_usuario: "Administrador"
    });

    tokenAdmin = jwt.sign(
        {
            id: usuarioTeste.id_usuario,
            email: usuarioTeste.email,
            tipo_usuario: usuarioTeste.tipo_usuario
        },
        JWT_SECRET
    );

    tokenDocente = jwt.sign(
        {
            id: usuarioTeste.id_usuario,
            email: usuarioTeste.email,
            tipo_usuario: "Docente"
        },
        JWT_SECRET
    );
});


tokenAdmin = jwt.sign(
    {
        id: 1,
        email: "admin@teste.com",
        tipo_usuario: "Administrador"
    },
    JWT_SECRET
);

tokenDocente = jwt.sign(
    {
        id: 2,
        email: "docente@teste.com",
        tipo_usuario: "Docente"
    },
    JWT_SECRET
);


describe("GET /api/equipes", () => {


test("Deve listar equipes com status 200", async () => {

    await equipe.create({
        nome_equipe: "Leões FC",
        id_usuario: usuarioTeste.id_usuario
    });

    const response = await request(app)
        .get("/api/equipes");

    expect(response.status).toBe(200);
    expect(response.body.count).toBe(1);
    expect(response.body.rows[0].nome_equipe).toBe("Leões FC");
});

test("Deve retornar 404 quando não existem equipes cadastradas", async () => {

    const response = await request(app)
        .get("/api/equipes");

    expect(response.status).toBe(404);
    expect(response.body.msg).toBe(
        "Ainda não existem equipes cadastradas"
    );
});


});

describe("GET /api/equipes/:id", () => {


test("Deve retornar 404 ao buscar equipe inexistente", async () => {

    const response = await request(app)
        .get("/api/equipes/999");

    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("Equipe não encontrada");
});

test("Deve retornar uma equipe existente com status 200", async () => {

    const equipeCriada = await equipe.create({
        nome_equipe: "Leões FC",
        id_usuario: usuarioTeste.id_usuario
    });

    const response = await request(app)
        .get(`/api/equipes/${equipeCriada.id_equipe}`);

    expect(response.status).toBe(200);
    expect(response.body.nome_equipe).toBe("Leões FC");
});


});

describe("POST /api/equipes", () => {


test("Deve retornar 401 ao tentar criar equipe sem autenticação", async () => {

    const response = await request(app)
        .post("/api/equipes")
        .send({
            nome_equipe: "Vikings",
            id_usuario: usuarioTeste.id_usuario
        });

    expect(response.status).toBe(401);
    expect(response.body.msg).toContain("não fornecido");
});

test("Deve criar uma equipe com usuário administrador", async () => {

    const response = await request(app)
        .post("/api/equipes")
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({
            nome_equipe: "Vikings",
            id_usuario: usuarioTeste.id_usuario
        });

    expect(response.status).toBe(201);
    expect(response.body.nome_equipe).toBe("Vikings");
});


});

describe("PUT /api/equipes/:id", () => {


test("Deve editar uma equipe com administrador", async () => {

    const equipeCriada = await equipe.create({
        nome_equipe: "Velhos",
        id_usuario: usuarioTeste.id_usuario
    });

    const response = await request(app)
        .put(`/api/equipes/${equipeCriada.id_equipe}`)
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({
            nome_equipe: "Nova equipe"
        });

    expect(response.status).toBe(200);
    expect(response.body.nome_equipe).toBe("Nova equipe");
});

test("Deve retornar 404 ao tentar editar equipe inexistente", async () => {

    const response = await request(app)
        .put("/api/equipes/999")
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({
            nome_equipe: "Nova equipe"
        });

    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("Equipe não encontrada");
});


});

describe("DELETE /api/equipes/:id", () => {


test("Deve bloquear exclusão de equipe com atletas vinculados", async () => {

    const equipeCriada = await equipe.create({
        nome_equipe: "Leões FC",
        id_usuario: usuarioTeste.id_usuario
    });

    await atleta.create({
        nome_aluno: "Lucas",
        matricula: 123456,
        turma: "3A",
        id_equipe: equipeCriada.id_equipe
    });

    const response = await request(app)
        .delete(`/api/equipes/${equipeCriada.id_equipe}`)
        .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(response.status).toBe(409);
    expect(response.body.msg).toContain(
        "Não é possível excluir equipe"
    );
});

test("Deve retornar 404 ao tentar remover equipe inexistente", async () => {

    const response = await request(app)
        .delete("/api/equipes/999")
        .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("Equipe não encontrada");
});

test("Deve bloquear exclusão de equipe por usuário sem permissão", async () => {

    const response = await request(app)
        .delete("/api/equipes/1")
        .set("Authorization", `Bearer ${tokenDocente}`);

    expect(response.status).toBe(403);
    expect(response.body.msg).toBe(
        "Acesso permitido apenas para administradores."
    );
});


});

describe("POST /api/equipes/:id/atletas", () => {


test("Deve adicionar um atleta a uma equipe válida", async () => {

    const equipeCriada = await equipe.create({
        nome_equipe: "Leões FC",
        id_usuario: usuarioTeste.id_usuario
    });

    const response = await request(app)
        .post(`/api/equipes/${equipeCriada.id_equipe}/atletas`)
        .set("Authorization", `Bearer ${tokenDocente}`)
        .send({
            nome_aluno: "Lucas",
            matricula: 123456,
            turma: "3A"
        });

    expect(response.status).toBe(201);
    expect(response.body.nome_aluno).toBe("Lucas");
    expect(Number(response.body.id_equipe)).toBe(
    equipeCriada.id_equipe
);
});

test("Deve retornar 404 ao adicionar atleta em equipe inexistente", async () => {

    const response = await request(app)
        .post("/api/equipes/999/atletas")
        .set("Authorization", `Bearer ${tokenDocente}`)
        .send({
            nome_aluno: "Lucas",
            matricula: 123456,
            turma: "3A"
        });

    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("Equipe não encontrada");
});

test("Deve bloquear criação de atleta sem autenticação", async () => {

    const response = await request(app)
        .post("/api/equipes/1/atletas")
        .send({
            nome_aluno: "Lucas",
            matricula: 123456,
            turma: "3A"
        });

    expect(response.status).toBe(401);
    expect(response.body.msg).toContain("não fornecido");
});


});

describe("DELETE /api/equipes/:id/atletas/:atletaId", () => {


test("Deve remover um atleta da equipe", async () => {

    const equipeCriada = await equipe.create({
        nome_equipe: "Leões FC",
        id_usuario: usuarioTeste.id_usuario
    });

    const atletaCriado = await atleta.create({
        nome_aluno: "Lucas",
        matricula: 123456,
        turma: "3A",
        id_equipe: equipeCriada.id_equipe
    });

    const response = await request(app)
        .delete(
            `/api/equipes/${equipeCriada.id_equipe}/atletas/${atletaCriado.id_atleta}`
        )
        .set("Authorization", `Bearer ${tokenDocente}`);

    expect(response.status).toBe(204);
});

test("Deve retornar 404 ao tentar remover atleta inexistente", async () => {

    const response = await request(app)
        .delete("/api/equipes/1/atletas/999")
        .set("Authorization", `Bearer ${tokenDocente}`);

    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("Atleta não encontrado");
});


});