import express from "express";
import request from "supertest";
import jwt from "jsonwebtoken";
import { describe, expect, it } from "vitest";
import { verifyToken } from "./verifyToken.js";

const secret = process.env.JWT_SECRET || "Segredo_Mais_Segredo_Dos_Jogos_Internos";

const createApp = () => {
  const app = express();
  app.get("/protected", verifyToken, (req, res) => res.json({ user: req.usuario }));
  return app;
};

describe("verifyToken", () => {
  it("rejects a request without Authorization", async () => {
    const response = await request(createApp()).get("/protected");
    expect(response.status).toBe(401);
    expect(response.body.msg).toContain("não fornecido");
  });

  it("rejects malformed Authorization headers", async () => {
    const response = await request(createApp())
      .get("/protected")
      .set("Authorization", "Basic abc");
    expect(response.status).toBe(401);
    expect(response.body.msg).toContain("inválido");
  });

  it("rejects invalid tokens", async () => {
    const response = await request(createApp())
      .get("/protected")
      .set("Authorization", "Bearer invalid-token");
    expect(response.status).toBe(401);
    expect(response.body.msg).toBe("Token inválido.");
  });

  it("rejects expired tokens", async () => {
    const token = jwt.sign({ id: 1 }, secret, { expiresIn: -1 });
    const response = await request(createApp())
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(401);
    expect(response.body.msg).toContain("expirado");
  });

  it("attaches a verified payload", async () => {
    const token = jwt.sign({ id: 1, tipo_usuario: "Administrador" }, secret);
    const response = await request(createApp())
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.user.id).toBe(1);
  });
});
