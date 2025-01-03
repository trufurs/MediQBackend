import { Router } from "express";
import { register , login } from "../controllers/authController.js";
const router = Router();

router.route("/login").get(login);
router.route("/register").post(register);
//router.route("/fp").post();

export default router