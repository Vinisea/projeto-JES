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

const router = Router();

router.get("/", listarConfrontos);

router.post("/gerar", gerarConfrontosDoGrupo);

router.get("/:id", buscarConfrontoPorId);

router.post("/", criarConfronto);

router.put("/:id", editarConfronto);

router.delete("/:id", removerConfronto);

router.patch("/:id/iniciar", iniciarConfronto);

router.patch("/:id/finalizar", finalizarConfronto);

router.patch("/:id/placar", atualizarPlacar);

export default router;