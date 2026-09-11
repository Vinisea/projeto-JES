import { Router } from "express";

import {
    listarEquipes,
    buscarEquipePorId,
    criarEquipe,
    editarEquipe,
    removerEquipe,
    adicionarAtleta,
    removerAtleta,
    listarAtletas
} from "../controllers/EquipeController.js";

import { listarPontuacaoEquipe } from "../controllers/RankingController.js";

import { verifyToken } from "../middlewares/verifyToken.js";

import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

router.get("/", listarEquipes);
router.get("/:id/pontuacao", listarPontuacaoEquipe);
router.get("/:id", buscarEquipePorId);

router.post("/", verifyToken, requireAdmin, criarEquipe);
router.put("/:id", verifyToken, requireAdmin, editarEquipe);
router.delete("/:id", verifyToken, requireAdmin, removerEquipe);

router.get("/:id/atletas", listarAtletas);
router.post("/:id/atletas", verifyToken, adicionarAtleta);
router.delete("/:id/atletas/:atletaId", verifyToken, removerAtleta);


export default router;