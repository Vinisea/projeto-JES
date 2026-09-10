import { Router } from "express";
import {
  listarPartidasPublicas,
  obterPartidaPublica,
  listarResultadosPublicos,
  listarClassificacaoPublica,
  listarRankingPublico,
} from "../controllers/publicController.js";

const router = Router();

router.get("/partidas", listarPartidasPublicas);
router.get("/partidas/:id", obterPartidaPublica);
router.get("/resultados", listarResultadosPublicos);
router.get("/classificacao", listarClassificacaoPublica);
router.get("/ranking", listarRankingPublico);

export default router;