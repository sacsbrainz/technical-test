import { me } from "@/controllers/userController";
import express from "express"; 

const router = express.Router();

// User profile route
router.get("/me", me);

export { router as userRoutes };
