import {
  emailVerification,
  resendEmailVerification,
} from "@/controllers/emailController";
import express from "express";

const router = express.Router();

// Email verification route
router.get("/verify-email/:token", emailVerification);

// resend verification email route
router.post("/resend-verification-email", resendEmailVerification);

export { router as emailRoutes };
