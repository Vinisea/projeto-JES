import { Router } from "express";
import AtletaController from "../controllers/AtletaController.js";

const router = Router();

router.get("/", AtletaController.listar);
router.get("/:id", AtletaController.buscarPorId);
router.post("/", AtletaController.criar);
router.put("/:id", AtletaController.atualizar);
router.delete("/:id", AtletaController.remover);

export default router;