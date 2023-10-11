import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/**
 * Middleware to authenticate requests using JWT.
 * It checks for the presence of a valid JWT token in the Authorization header.
 * If the token is valid, it decodes the token and adds the user information to the request object.
 * If the token is invalid or missing, it sends a 401 Unauthorized response.
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify and decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (!decoded || typeof decoded === "string") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.id = decoded.id;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
