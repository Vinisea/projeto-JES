import { Router } from "express";
import {
  listarPartidasPublicas,
  obterPartidaPublica
} from "../controllers/publicController.js";

const router = Router();

router.get("/partidas", listarPartidasPublicas);
router.get("/partidas/:id", obterPartidaPublica);

export default router;