import { Router } from "express";

import {
    criarInscricao,
    listarInscricoes,
    buscarInscricaoPorId
} from "../controllers/InscricaoController.js";


const router = Router();


router.get("/", listarInscricoes);
router.get("/:id", buscarInscricaoPorId);
router.post("/", criarInscricao);


export default router;