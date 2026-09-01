import { Router } from "express";
import {
    buscarRegulamento,
    editarRegulamento
} from "../controllers/RegulamentoController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

router.get("/", buscarRegulamento);
router.put("/", verifyToken, editarRegulamento);

export default router;