import { Router } from "express";

import {
    criarInscricao,
    listarInscricoes,
    buscarInscricaoPorId,
    removerInscricao
} from "../controllers/InscricaoController.js";

import { verifyToken } from "../middlewares/verifyToken.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

router.get("/", listarInscricoes);

router.get("/:id", verifyToken, buscarInscricaoPorId);
router.post("/", verifyToken, criarInscricao);
router.delete("/:id", verifyToken, removerInscricao);

router.post("/", verifyToken, requireAdmin, criarInscricao);
router.delete("/:id", verifyToken, requireAdmin, removerInscricao);

export default router;