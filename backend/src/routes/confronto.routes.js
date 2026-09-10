import { Router } from "express";

import {
    listarConfrontos,
    buscarConfrontoPorId,
    criarConfronto,
    editarConfronto,
    removerConfronto,
    atualizarPlacar,
    finalizarConfronto,
    iniciarConfronto,
    gerarConfrontosDoGrupo
} from "../controllers/ConfrontoController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = Router();

router.get("/", listarConfrontos);
router.get("/:id", buscarConfrontoPorId);

router.post("/gerar", verifyToken, authorizeRoles("Administrador", "Arbitro"), gerarConfrontosDoGrupo);

router.post("/", verifyToken, authorizeRoles("Administrador", "Arbitro"), criarConfronto);

router.put("/:id", verifyToken, authorizeRoles("Administrador", "Arbitro"), editarConfronto);

router.delete("/:id", verifyToken, authorizeRoles("Administrador"), removerConfronto);

router.patch("/:id/iniciar", verifyToken, authorizeRoles("Administrador", "Arbitro"), iniciarConfronto);

router.patch("/:id/finalizar", verifyToken, authorizeRoles("Administrador", "Arbitro"), finalizarConfronto);

router.patch("/:id/placar", verifyToken, authorizeRoles("Administrador", "Arbitro"), atualizarPlacar);

export default router;