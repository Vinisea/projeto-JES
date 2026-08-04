import { Router } from "express";
import GrupoController from "../controllers/GrupoController.js";

const router = Router();

router.get("/", GrupoController.listar);
router.get("/:id", GrupoController.buscarPorId);

router.post("/", GrupoController.criar);

router.put("/:id", GrupoController.atualizar);

router.delete("/:id", GrupoController.remover);

router.get("/:id/equipes", GrupoController.listarEquipes);

router.post("/:id/equipes", GrupoController.adicionarEquipe);

router.delete("/:id/equipes/:equipeId", GrupoController.removerEquipe);

router.post("/:id/sortear", GrupoController.sortearEquipes);

export default router;