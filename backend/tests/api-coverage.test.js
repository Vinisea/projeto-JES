import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import request from "supertest";
import {
beforeAll,
beforeEach,
describe,
expect,
test
} from "vitest";

import app from "../src/app.js";
import { conn } from "../src/config/conn.js";
import { usuario } from "../src/models/index.js";

const JWT_SECRET =
process.env.JWT_SECRET ||
"Segredo_Mais_Segredo_Dos_Jogos_Internos";

const criarUsuario = async (overrides = {}) => {
const dados = {
nome: "Usuário Teste",
email: "[usuario@teste.com](mailto:usuario@teste.com)",
senha: bcrypt.hashSync("Senha@123", 10),
tipo_usuario: "Administrador",
...overrides,
};

return usuario.create(dados);


};

beforeAll(async () => {
await conn.sync({ force: true });
}, 30000);

beforeEach(async () => {
await usuario.destroy({ where: {} });
});

describe("POST /api/auth/login", () => {

  test("Deve retornar 400 quando o email e a senha não forem informados", async () => {

    const response = await request(app)
        .post("/api/auth/login")
        .send({});

    expect(response.status).toBe(400);
    expect(response.body.msg).toMatch(/email.*senha|senha.*email/i);
});

test("Deve retornar 401 para credenciais inválidas", async () => {

    const response = await request(app)
        .post("/api/auth/login")
        .send({
            email: "nao@existe.com",
            senha: "Senha@123"
        });

    expect(response.status).toBe(401);
    expect(response.body.msg).toBe("Credenciais inválidas.");
});

test("Deve autenticar um usuário com dados válidos", async () => {

    await criarUsuario({
        nome: "Admin Login",
        email: "admin-login@teste.com",
        senha: bcrypt.hashSync("Senha@123", 10),
        tipo_usuario: "Administrador"
    });

    const response = await request(app)
        .post("/api/auth/login")
        .send({
            email: "admin-login@teste.com",
            senha: "Senha@123"
        });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
    expect(response.body.usuarioId).toBeDefined();
});

});

describe("GET /api/auth/me", () => {

test("Deve retornar 401 quando o token não for enviado", async () => {

    const response = await request(app)
        .get("/api/auth/me");

    expect(response.status).toBe(401);
    expect(response.body.msg).toContain("não fornecido");
});

test("Deve retornar os dados do usuário autenticado com token válido", async () => {

    const usuarioCriado = await criarUsuario({
        nome: "Usuário Autenticado",
        email: "logado@teste.com",
        senha: bcrypt.hashSync("Senha@123", 10),
        tipo_usuario: "Docente"
    });

    const token = jwt.sign(
        {
            id: usuarioCriado.id_usuario,
            email: usuarioCriado.email,
            tipo_usuario: usuarioCriado.tipo_usuario
        },
        JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
        id_usuario: usuarioCriado.id_usuario,
        email: "logado@teste.com",
        tipo_usuario: "Docente"
    });
});


});
