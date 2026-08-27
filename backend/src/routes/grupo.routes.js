import { Router } from "express";

import {
  criarGrupo,
  listarGrupos,
  buscarGrupoPorId,
  editarGrupo,
  removerGrupo,
  listarEquipesDoGrupo,
  adicionarEquipeAoGrupo,
  removerEquipeDoGrupo,
  sortearGrupos,
} from "../controllers/GrupoController.js";

const router = Router();

router.post("/sortear", sortearGrupos);

router.post("/", criarGrupo);
router.get("/", listarGrupos);
router.get("/:id", buscarGrupoPorId);
router.put("/:id", editarGrupo);
router.delete("/:id", removerGrupo);

router.get("/:id/equipes", listarEquipesDoGrupo);
router.post("/:id/equipes", adicionarEquipeAoGrupo);
router.delete("/:id/equipes/:equipeId", removerEquipeDoGrupo);

export default router;
