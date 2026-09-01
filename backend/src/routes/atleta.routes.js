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


const router = Router();


router.get("/", listarAtletas);
router.get("/:id", buscarAtletaPorId);

router.post("/", verifyToken, criarAtleta);
router.put("/:id", verifyToken, editarAtleta);
router.delete("/:id", verifyToken, removerAtleta);
router.patch("/:id/equipe", verifyToken, transferirEquipe);


export default router;