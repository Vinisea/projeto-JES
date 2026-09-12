import { Router } from "express";
import {
  listarUsuario,
  buscarUsuarioPorId,
  criarUsuario,
  editarUsuario,
  removerUsuario,
} from "../controllers/UsuarioController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

router.get("/", verifyToken, requireAdmin, listarUsuario);
router.get("/:id", verifyToken, requireAdmin, buscarUsuarioPorId);
router.post("/", verifyToken, requireAdmin, criarUsuario);
router.put("/:id", verifyToken, requireAdmin, editarUsuario);
router.delete("/:id", verifyToken, requireAdmin, removerUsuario);

export default router;