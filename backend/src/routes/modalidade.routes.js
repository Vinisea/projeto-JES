import { Router } from "express";
import ModalidadeController from "../controllers/ModalidadeController.js";

const router = Router();

router.get("/", ModalidadeController.listar);
router.get("/:id", ModalidadeController.buscarPorId);
router.post("/", ModalidadeController.criar);
router.put("/:id", ModalidadeController.atualizar);
router.delete("/:id", ModalidadeController.remover);

export default router;