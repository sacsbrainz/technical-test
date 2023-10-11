import { Request, Response } from "express";
import dotenv from "dotenv";
import { getUserById } from "@/services/userService";
dotenv.config();

export async function me(req: Request, res: Response) {
  try {
    const userId = req.id as string;
    const user = await getUserById(userId);

    if (!user) {
      res.status(404).json({ error: "Failed to get user" });
      return;
    }

    // return user without password
    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
    
  } catch (error) {
    res.status(500).json({ error: "Failed to get user" });
  }
}
