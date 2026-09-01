import { Router } from "express";
import {
    listarUsuario, 
    buscarUsuarioPorId,
    criarUsuario,
    editarUsuario,
    removerUsuario
} from "../controllers/UsuarioController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

router.get("/", listarUsuario);
router.get("/:id", buscarUsuarioPorId);

router.post("/", verifyToken, criarUsuario);
router.put("/:id", verifyToken, editarUsuario);
router.delete("/:id", verifyToken, removerUsuario);

export default router;