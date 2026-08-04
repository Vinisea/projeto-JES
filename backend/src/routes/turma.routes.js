import { Router } from "express";
import TurmaController from "../controllers/TurmaController.js";

const router = Router();

router.get("/", TurmaController.listar);
router.get("/:id", TurmaController.buscarPorId);
router.post("/", TurmaController.criar);
router.put("/:id", TurmaController.atualizar);
router.delete("/:id", TurmaController.remover);

export default router;