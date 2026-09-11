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
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

router.post("/sortear", verifyToken, requireAdmin, sortearGrupos);

router.get("/", listarGrupos);

router.get("/:id", buscarGrupoPorId);

router.post("/", verifyToken, requireAdmin, criarGrupo);

router.put("/:id", verifyToken, requireAdmin, editarGrupo);

router.delete("/:id", verifyToken, requireAdmin, removerGrupo);

router.get("/:id/equipes", listarEquipesDoGrupo);

router.post("/:id/equipes", verifyToken, requireAdmin, adicionarEquipeAoGrupo);

router.delete("/:id/equipes/:equipeId", verifyToken, requireAdmin, removerEquipeDoGrupo);

export default router;
