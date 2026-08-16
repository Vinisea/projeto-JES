import { Router } from "express";
import {
    criarTurma,
    editarTurma,
    listarTurma,
    removerTurma,
    buscarTurmaPorId
} from "../controllers/TurmaController.js"

const router = Router();

router.get("/", listarTurma);
router.get("/:id", buscarTurmaPorId);
router.post("/", criarTurma);
router.put("/:id", editarTurma);
router.delete("/:id", removerTurma);

export default router;