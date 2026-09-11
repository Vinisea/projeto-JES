import { Router } from "express";

import {
    listarModalidades,
    buscarModalidadePorId,
    criarModalidade,
    editarModalidade,
    removerModalidade,
    obterResultadoFinalModalidade
} from "../controllers/ModalidadeController.js";

import { verifyToken } from "../middlewares/verifyToken.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

router.get("/", listarModalidades);

router.get("/:id", buscarModalidadePorId);

router.post("/", verifyToken, requireAdmin, criarModalidade);

router.put("/:id", verifyToken, requireAdmin, editarModalidade);

router.delete("/:id", verifyToken, requireAdmin, removerModalidade);

router.get("/:id/resultado-final", verifyToken, obterResultadoFinalModalidade);

export default router;