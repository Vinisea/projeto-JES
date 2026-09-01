import { Router } from "express";

import {
    loginUsuario,
    logoutUsuario,
    usuarioLogado
} from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/verifyToken.js";


const router = Router();


router.post("/login", loginUsuario);
router.post("/logout", verifyToken, logoutUsuario);
router.get("/me", verifyToken, usuarioLogado);


export default router;