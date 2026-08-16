import { Router } from "express";

import {
    loginUsuario,
    logoutUsuario,
    usuarioLogado
} from "../controllers/AuthController.js";


const router = Router();


router.post("/login", loginUsuario);
router.post("/logout", logoutUsuario);
router.get("/me", usuarioLogado);


export default router;