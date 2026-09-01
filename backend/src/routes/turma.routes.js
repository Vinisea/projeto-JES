import { Router } from "express";
import {
    criarTurma,
    editarTurma,
    listarTurma,
    removerTurma,
    buscarTurmaPorId
} from "../controllers/TurmaController.js"
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

router.get("/", listarTurma);
router.get("/:id", buscarTurmaPorId);

router.post("/", verifyToken, criarTurma);
router.put("/:id", verifyToken, editarTurma);
router.delete("/:id", verifyToken, removerTurma);

export default router;