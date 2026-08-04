import { Router } from "express";
import PartidaController from "../controllers/PartidaController.js";

const router = Router();

router.get("/", PartidaController.listar);

router.get("/:id", PartidaController.buscarPorId);

router.post("/", PartidaController.criar);

router.put("/:id", PartidaController.atualizar);

router.delete("/:id", PartidaController.remover);

router.patch("/:id/iniciar", PartidaController.iniciar);

router.patch("/:id/placar", PartidaController.registrarPlacar);

router.patch("/:id/encerrar", PartidaController.encerrar);

export default router;