import { Router } from "express";
import DashboardController from "../controllers/DashboardController.js";

const router = Router();

router.get("/", DashboardController.dashboard);

router.get("/estatisticas", DashboardController.estatisticas);

router.get("/proximos-jogos", DashboardController.proximosJogos);

export default router;