import { Router } from "express";
import { 
    listarRankingGeral,
    listarRankingPorGrupo,
    listarRankingPorModalidade,
    listarRankingPorTurma
 } from "../controllers/RankingController.js";

const router = Router();

router.get("/geral", listarRankingGeral);
router.get("/grupo/:grupoId", listarRankingPorGrupo);
router.get("/modalidade/:modalidadeId", listarRankingPorModalidade);
router.get("/turma/turma:id", listarRankingPorTurma);

export default router;