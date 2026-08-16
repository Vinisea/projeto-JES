import { Router } from "express";

import {
    listarAtletas,
    buscarAtletaPorId,
    criarAtleta,
    editarAtleta,
    removerAtleta,
    transferirEquipe
} from "../controllers/AtletaController.js";


const router = Router();


router.get("/", listarAtletas);
router.get("/:id", buscarAtletaPorId);
router.post("/", criarAtleta);
router.put("/:id", editarAtleta);
router.delete("/:id", removerAtleta);

router.patch("/:id/equipe", transferirEquipe);


export default router;