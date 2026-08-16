import { Router } from "express";

import {
    listarModalidades,
    buscarModalidadePorId,
    criarModalidade,
    editarModalidade,
    removerModalidade
} from "../controllers/ModalidadeController.js";


const router = Router();


router.get("/", listarModalidades);
router.get("/:id", buscarModalidadePorId);
router.post("/", criarModalidade);
router.put("/:id", editarModalidade);
router.delete("/:id", removerModalidade);


export default router;