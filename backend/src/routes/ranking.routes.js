import { Router } from "express";
import { 
    listarRankingGeral,
    listarRankingPorGrupo,
    listarRankingPorModalidade,
    listarRankingPorTurma
 } from "../controllers/RankingController.js";

const router = Router();

router.get("/", listarRankingGeral);
router.get("/", listarRankingPorGrupo);
router.get("/", listarRankingPorModalidade);
router.get("/", listarRankingPorTurma);

export default router;