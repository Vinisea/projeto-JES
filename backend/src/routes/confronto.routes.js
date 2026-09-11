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
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

router.get("/", listarConfrontos);

router.get("/:id", buscarConfrontoPorId);

router.post("/gerar", verifyToken, requireAdmin, gerarConfrontosDoGrupo);

router.post("/", verifyToken, requireAdmin, criarConfronto);

router.put("/:id", verifyToken, requireAdmin, editarConfronto);

router.delete("/:id", verifyToken, requireAdmin, removerConfronto);

router.patch("/:id/iniciar", verifyToken, requireAdmin, iniciarConfronto);

router.patch("/:id/finalizar", verifyToken, requireAdmin, finalizarConfronto);

router.patch("/:id/placar", verifyToken, requireAdmin, atualizarPlacar);

export default router;