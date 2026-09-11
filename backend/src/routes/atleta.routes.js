import { Router } from "express";

import {
    listarAtletas,
    buscarAtletaPorId,
    criarAtleta,
    editarAtleta,
    removerAtleta,
    transferirEquipe
} from "../controllers/AtletaController.js";

import { verifyToken } from "../middlewares/verifyToken.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";


const router = Router();


router.get("/", listarAtletas);
router.get("/:id", buscarAtletaPorId);

router.post("/", verifyToken, requireAdmin, criarAtleta);
router.put("/:id", verifyToken, requireAdmin, editarAtleta);
router.delete("/:id", verifyToken, requireAdmin, removerAtleta);
router.patch("/:id/equipe", verifyToken, requireAdmin, transferirEquipe);


export default router;