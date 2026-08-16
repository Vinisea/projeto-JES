import { Router } from "express";
import {
    listarUsuario, 
    buscarUsuarioPorId,
    criarUsuario,
    editarUsuario,
    removerUsuario
} from "../controllers/UsuarioController.js";

const router = Router();

router.get("/", listarUsuario);
router.get("/:id", buscarUsuarioPorId);
router.post("/", criarUsuario);
router.put("/:id", editarUsuario);
router.delete("/:id", removerUsuario);

export default router;