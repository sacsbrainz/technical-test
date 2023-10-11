import { login, register } from "@/controllers/authController";
import express from "express";

const router = express.Router();

// User registration route
router.post("/register", register);

// User login route
router.post("/login", login);

export { router as authRoutes };
