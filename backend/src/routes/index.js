import { Router } from "express";

import authRoutes from "./auth.routes.js";
import usuarioRoutes from "./usuario.routes.js";
import turmaRoutes from "./turma.routes.js";
import modalidadeRoutes from "./modalidade.routes.js";
import equipeRoutes from "./equipe.routes.js";
import atletaRoutes from "./atleta.routes.js";
import grupoRoutes from "./grupo.routes.js";
import confrontoRoutes from "./confronto.routes.js";
import rankingRoutes from "./ranking.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import regulamentoRoutes from "./regulamento.routes.js";
import inscricaoRoutes from "./inscricao.routes.js";
import publicRoutes from "./publicRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/public", publicRoutes)
router.use("/usuarios", usuarioRoutes);
router.use("/turmas", turmaRoutes);
router.use("/modalidades", modalidadeRoutes);
router.use("/equipes", equipeRoutes);
router.use("/atletas", atletaRoutes);
router.use("/grupos", grupoRoutes);
router.use("/confrontos", confrontoRoutes);
router.use("/ranking", rankingRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/regulamento", regulamentoRoutes);
router.use("/inscricoes", inscricaoRoutes);

export default router;