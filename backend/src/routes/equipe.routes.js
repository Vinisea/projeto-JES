import { Router } from "express";
import EquipeController from "../controllers/EquipeController.js";

const router = Router();

router.get("/", EquipeController.listar);
router.get("/:id", EquipeController.buscarPorId);

router.post("/", EquipeController.criar);

router.put("/:id", EquipeController.atualizar);

router.delete("/:id", EquipeController.remover);

router.get("/:id/atletas", EquipeController.listarAtletas);

router.post("/:id/atletas", EquipeController.adicionarAtleta);

router.delete("/:id/atletas/:atletaId", EquipeController.removerAtleta);

export default router;