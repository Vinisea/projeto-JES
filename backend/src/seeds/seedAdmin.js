import bcrypt from "bcrypt";
import { usuario } from "../models/index.js";

export const criarAdminInicial = async () => {
  try {
    const adminExiste = await usuario.findOne({
      where: { tipo_usuario: "Administrador" },
    });

    if (!adminExiste) {
        const hashSenha = await bcrypt.hash("adminLindo", 10);
        await usuario.create({
            nome: "MelhorAdmin",
            email: "adminLindo@adminArena.com",
            senha: hashSenha,
            tipo_usuario: "Administrador"
        })
        console.log("✅ Usuário Admin criado com sucesso!")
    }
  } catch (error) {
    console.log("❌ Erro ao gerar o usuario admin")
  }
};
