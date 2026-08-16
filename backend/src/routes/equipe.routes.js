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


const router = Router();


router.get("/", listarEquipes);
router.get("/:id", buscarEquipePorId);

router.post("/", criarEquipe);

router.put("/:id", editarEquipe);

router.delete("/:id", removerEquipe);

router.get("/:id/atletas", listarAtletas);
router.post("/:id/atletas", adicionarAtleta);
router.delete("/:id/atletas/:atletaId", removerAtleta);


export default router;