import { Router } from "express";
import RankingController from "../controllers/RankingController.js";

const router = Router();

router.get("/", RankingController.geral);

router.get("/modalidade/:id", RankingController.porModalidade);

router.get("/grupo/:id", RankingController.porGrupo);

export default router;