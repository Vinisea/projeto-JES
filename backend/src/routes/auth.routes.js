import { Router } from "express";
import AuthController from "../controllers/AuthController.js";

const router = Router();

router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.get("/me", AuthController.me);

export default router;