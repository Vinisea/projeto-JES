import { Router } from "express";
import {
    buscarRegulamento,
    editarRegulamento
} from "../controllers/RegulamentoController.js";

const router = Router();

router.get("/", buscarRegulamento);
router.put("/", editarRegulamento);

export default router;