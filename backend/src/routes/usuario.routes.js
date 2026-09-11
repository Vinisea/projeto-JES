import { Router } from "express";
import {
    listarUsuario, 
    buscarUsuarioPorId,
    criarUsuario,
    editarUsuario,
    removerUsuario
} from "../controllers/UsuarioController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = Router();

router.get("/", verifyToken, authorizeRoles("Administrador"), listarUsuario);
router.get("/:id", verifyToken, authorizeRoles("Administrador"), buscarUsuarioPorId);

router.post("/", verifyToken, authorizeRoles("Administrador"), criarUsuario);
router.put("/:id", verifyToken, authorizeRoles("Administrador"), editarUsuario);
router.delete("/:id", verifyToken, authorizeRoles("Administrador"), removerUsuario);

export default router;