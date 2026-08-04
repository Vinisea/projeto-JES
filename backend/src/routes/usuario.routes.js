import { Router } from "express";
import UsuarioController from "../controllers/UsuarioController.js";

const router = Router();

router.get("/", UsuarioController.listar);
router.get("/:id", UsuarioController.buscarPorId);
router.post("/", UsuarioController.criar);
router.put("/:id", UsuarioController.atualizar);
router.delete("/:id", UsuarioController.remover);

export default router;