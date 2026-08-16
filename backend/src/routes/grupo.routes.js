import { Router } from "express";

import {
    listarGrupos,
    criarGrupo,
    sortearGrupos,
    editarGrupo,
    removerGrupo
} from "../controllers/GrupoController.js";


const router = Router();


router.get("/", listarGrupos);
router.post("/", criarGrupo);
router.post("/sortear", sortearGrupos);
router.put("/:id", editarGrupo);
router.delete("/:id", removerGrupo);


export default router;