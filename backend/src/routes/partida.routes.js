import { Router } from "express";

import {
    listarPartidas,
    buscarPartidaPorId,
    criarPartida,
    editarPartida,
    removerPartida,
    iniciarPartida,
    encerrarPartida,
    atualizarPlacar
} from "../controllers/PartidaController.js";


const router = Router();

router.get("/", listarPartidas);
router.get("/:id", buscarPartidaPorId);
router.post("/", criarPartida);
router.put("/:id", editarPartida);
router.delete("/:id", removerPartida);
router.patch("/:id/iniciar", iniciarPartida);
router.patch("/:id/encerrar", encerrarPartida);
router.patch("/:id/placar", atualizarPlacar);


export default router;