import { Router } from "express";
import {
  listarPartidasPublicas,
  obterPartidaPublica,
  listarResultadosPublicos,
  listarClassificacaoPublica,
  listarRankingPublico,
  listarChaveamentoPublico,
} from "../controllers/publicController.js";
import { listarPartidasDoTelao, buscarPartidaDoTelao } from "../controllers/TelaoController.js";

const router = Router();

router.get("/partidas", listarPartidasPublicas);
router.get("/partidas/:id", obterPartidaPublica);
router.get("/resultados", listarResultadosPublicos);
router.get("/classificacao", listarClassificacaoPublica);
router.get("/ranking", listarRankingPublico);
router.get("/chaveamento", listarChaveamentoPublico);
router.get("/telao", listarPartidasDoTelao);
router.get("/telao/:id", buscarPartidaDoTelao);

export default router;