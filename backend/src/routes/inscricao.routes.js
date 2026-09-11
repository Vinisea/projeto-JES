import { Router } from "express";

import {
    criarInscricao,
    listarInscricoes,
    buscarInscricaoPorId
} from "../controllers/InscricaoController.js";

import { verifyToken } from "../middlewares/verifyToken.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

router.get("/", listarInscricoes);

router.get("/:id", verifyToken, buscarInscricaoPorId);

router.post("/", verifyToken, requireAdmin, criarInscricao);

export default router;