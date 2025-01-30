import express from "express";
import { login, logout, register } from "../controllers/auth";
import { validateRegister } from "../middleware/auth";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", login);
router.post("/logout", logout);


export default router;