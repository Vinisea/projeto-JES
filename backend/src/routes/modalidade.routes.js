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


const router = Router();


router.get("/", listarModalidades);
router.get("/:id", buscarModalidadePorId);

router.post("/", verifyToken, criarModalidade);
router.put("/:id", verifyToken, editarModalidade);
router.delete("/:id", verifyToken, removerModalidade);
router.get("/:id/resultado-final", verifyToken, obterResultadoFinalModalidade);


export default router;