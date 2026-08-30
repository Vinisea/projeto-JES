import { Router } from "express";

import {
    listarConfrontos,
    buscarConfrontoPorId,
    criarConfronto,
    editarConfronto,
    removerConfronto,
    atualizarPlacar,
    finalizarConfronto,
    iniciarConfronto
} from "../controllers/ConfrontoController.js";

const router = Router();

router.get("/", listarConfrontos);
router.get("/:id", buscarConfrontoPorId);
router.post("/", criarConfronto);
router.put("/:id", editarConfronto);
router.delete("/:id", removerConfronto);

router.patch("/:id/iniciar", iniciarConfronto);
router.patch("/:id/finalizar", finalizarConfronto);
router.patch("/:id/placar", atualizarPlacar);

export default router;