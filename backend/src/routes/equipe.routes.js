import { Router } from "express";

import {
    listarEquipes,
    buscarEquipePorId,
    criarEquipe,
    editarEquipe,
    removerEquipe,
    adicionarAtleta,
    removerAtleta,
    listarAtletas
} from "../controllers/EquipeController.js";
import { verifyToken } from "../middlewares/verifyToken.js";


const router = Router();


router.get("/", listarEquipes);
router.get("/:id", buscarEquipePorId);

router.post("/", verifyToken, criarEquipe);
router.put("/:id", verifyToken, editarEquipe);
router.delete("/:id", verifyToken, removerEquipe);

router.get("/:id/atletas", listarAtletas);
router.post("/:id/atletas", verifyToken, adicionarAtleta);
router.delete("/:id/atletas/:atletaId", verifyToken, removerAtleta);


export default router;