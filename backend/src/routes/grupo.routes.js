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
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

router.post("/sortear", verifyToken, sortearGrupos);

router.get("/", listarGrupos);
router.get("/:id", buscarGrupoPorId);

router.post("/", verifyToken, criarGrupo);
router.put("/:id", verifyToken, editarGrupo);
router.delete("/:id", verifyToken, removerGrupo);

router.get("/:id/equipes", listarEquipesDoGrupo);

router.post("/:id/equipes", verifyToken, adicionarEquipeAoGrupo);
router.delete("/:id/equipes/:equipeId", verifyToken, removerEquipeDoGrupo);

export default router;
