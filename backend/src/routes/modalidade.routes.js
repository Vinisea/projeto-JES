import { Router } from "express";

import {
    listarModalidades,
    buscarModalidadePorId,
    criarModalidade,
    editarModalidade,
    removerModalidade,
    obterResultadoFinalModalidade
} from "../controllers/ModalidadeController.js";


const router = Router();


router.get("/", listarModalidades);
router.get("/:id", buscarModalidadePorId);
router.post("/", criarModalidade);
router.put("/:id", editarModalidade);
router.delete("/:id", removerModalidade);
router.get("/:id/resultado-final", obterResultadoFinalModalidade);


export default router;