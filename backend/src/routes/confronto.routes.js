import { Router } from "express";

import {
    listarConfrontos,
    buscarConfrontoPorId,
    criarConfronto,
    editarConfronto,
    removerConfronto,
    atualizarPlacar,
    finalizarConfronto,
    iniciarConfronto,
    gerarConfrontosDoGrupo
} from "../controllers/ConfrontoController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

router.get("/", listarConfrontos);
router.get("/:id", buscarConfrontoPorId);

router.post("/gerar", verifyToken, gerarConfrontosDoGrupo);

router.post("/", verifyToken, criarConfronto);

router.put("/:id", verifyToken, editarConfronto);

router.delete("/:id", verifyToken, removerConfronto);

router.patch("/:id/iniciar", verifyToken, iniciarConfronto);

router.patch("/:id/finalizar", verifyToken, finalizarConfronto);

router.patch("/:id/placar", verifyToken, atualizarPlacar);

export default router;