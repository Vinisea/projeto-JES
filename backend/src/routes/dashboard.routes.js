import { Router } from "express";
import { buscarDashboard } from "../controllers/DashboardController.js";

const router = Router();
router.get("/", buscarDashboard);

export default router;

// import { Router } from "express";

// import {
//     dashboard,
//     estatisticas,
//     proximosJogos
// } from "../controllers/DashboardController.js";


// const router = Router();


// router.get("/", dashboard);
// router.get("/estatisticas", estatisticas);
// router.get("/proximos-jogos", proximosJogos);


// export default router;