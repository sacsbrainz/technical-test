import express from "express";
import bodyParser from "body-parser";
import { authRoutes } from "./routes/authRoutes";
import { emailRoutes } from "./routes/emailRoutes";
import { userRoutes } from "./routes/userRoutes";
import Redis from "ioredis";
import { authenticate } from "./middlewares/authMiddleware";
import verifyEmail from "./middlewares/verifyEmailMiddleware";
import { createTables } from "./utils/db";
import Logger from "./utils/logger";
import morganMiddleware from "./middlewares/morganMiddleware";
import rateLimiterUsingThirdParty from "./middlewares/rateLimiterMiddleware";
import cors from "cors";

// Create an Express application
const app = express();

export const redis = new Redis({
  port: 6379,
  host: "localhost",
  family: 4,
  db: 0,
});

// Middleware
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(morganMiddleware); // Log HTTP requests
app.use(rateLimiterUsingThirdParty); // Rate limit requests (using third-party library
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
); // Enable CORS for all routes

// Mount authentication routes
app.use("/api/auth", authRoutes);

// Middleware to protect routes after this point (require authentication)
app.use(authenticate);
app.use(verifyEmail);

// Mount user and email routes (protected routes)
app.use("/api/users", userRoutes);
app.use("/api/email", emailRoutes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, async () => {
  Logger.info(`Server is running on port ${port}`);

  // create tables if they don't exist
  await createTables();
});

export default app;
