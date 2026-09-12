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
import { usuario } from "../src/models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET =
process.env.JWT_SECRET || "Segredo_Mais_Segredo_Dos_Jogos_Internos";

let usuarioAdmin;
let usuarioTeste;

beforeAll(async () => {
await conn.sync({ force: true });
});

beforeEach(async () => {
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
    email: "teste@teste.com",
    senha: senhaHash,
    tipo_usuario: "Docente"
});

});

describe("POST /api/auth/login", () => {

test("Deve retornar 400 ao tentar logar sem email ou senha", async () => {

    const response = await request(app)
        .post("/api/auth/login")
        .send({});

    expect(response.status).toBe(400);
    expect(response.body.msg).toContain("obriogatórios");
});

test("Deve retornar 401 quando as credenciais são inválidas", async () => {

    const response = await request(app)
        .post("/api/auth/login")
        .send({
            email: "naoexiste@teste.com",
            senha: "12345678"
        });

    expect(response.status).toBe(401);
    expect(response.body.msg).toBe("Credenciais inválidas.");
});

test("Deve autenticar um usuário válido", async () => {

    const response = await request(app)
        .post("/api/auth/login")
        .send({
            email: "admin@teste.com",
            senha: "12345678"
        });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
});

test("Deve rejeitar senha incorreta para login", async () => {

    const response = await request(app)
        .post("/api/auth/login")
        .send({
            email: "teste@teste.com",
            senha: "senhaerrada"
        });

    expect(response.status).toBe(401);
    expect(response.body.msg).toBe("Credenciais inválidas.");
});


});

describe("POST /api/auth/logout", () => {

test("Deve rejeitar token com formato inválido no cabeçalho", async () => {

    const response = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", "Token abc");

    expect(response.status).toBe(401);
    expect(response.body.msg).toContain("inválido");
});

test("Deve bloquear acesso sem token no logout", async () => {

    const response = await request(app)
        .post("/api/auth/logout");

    expect(response.status).toBe(401);
    expect(response.body.msg).toContain("não fornecido");
});

test("Deve retornar sucesso no logout quando o token é válido", async () => {

    const token = jwt.sign(
        {
            id: usuarioAdmin.id_usuario,
            email: usuarioAdmin.email,
            tipo_usuario: usuarioAdmin.tipo_usuario
        },
        JWT_SECRET
    );

    const response = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.msg).toContain(
        "Logout realizado com sucesso"
    );
});

test("Deve rejeitar token expirado", async () => {

    const token = jwt.sign(
        {
            id: usuarioAdmin.id_usuario,
            email: usuarioAdmin.email,
            tipo_usuario: usuarioAdmin.tipo_usuario
        },
        JWT_SECRET,
        {
            expiresIn: -1
        }
    );

    const response = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body.msg).toContain("expirado");
});

});

describe("GET /api/auth/me", () => {

test("Deve rejeitar request sem token em /me", async () => {

    const response = await request(app)
        .get("/api/auth/me");

    expect(response.status).toBe(401);
    expect(response.body.msg).toContain("não fornecido");
});

});
