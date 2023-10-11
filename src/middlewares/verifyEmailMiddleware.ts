import { Request, Response, NextFunction } from "express";
import { getUserById } from "@/services/userService";

const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the user ID from the session
    const userId = req.id as string;

    // Retrieve the user from the redis cache
    const user = await getUserById(userId);

    // Check if the user's email is verified
    if (!user || user.is_email_verified === false) {
      return res.status(403).json({ message: "Email not verified." });
    }

    // User is verified, proceed to the next middleware or route handler
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

export default verifyEmail;
