import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { findUserById, updateUserEmailVerification } from "@/models/userModel";
import { sendEmail } from "@/services/emailService";
import { getUserById } from "@/services/userService";
import { redis } from "@/app";
dotenv.config();

export async function emailVerification(req: Request, res: Response) {
  const token = req.params.token;

  if (!token) {
    res.status(400).json({ error: "Invalid token" });
    return;
  }

  // verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (!decoded || typeof decoded === "string" || req.id !== decoded.userId) {
      res.status(400).json({ error: "Invalid token" });
      return;
    }

    // update user
    const userUpdate = await updateUserEmailVerification(decoded.userId);

    if (!userUpdate) {
      res.status(400).json({ error: "Invalid token" });
      return;
    }

    // update redis cache
    const user = await findUserById(decoded.userId);
    await redis.set(`user:${decoded.userId}`, JSON.stringify(user));

    res.status(200).json({ message: "Email verified" });
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
}

export async function resendEmailVerification(req: Request, res: Response) {
  try {
    const token = jwt.sign(
      { userId: req.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    const user = await getUserById(req.id as string);

    if (!user) {
      res.status(404).json({ error: "Failed to get user" });
      return;
    }

    const emailVerification = await sendEmail(
      user.email,
      "Email Verification",
      `Click the following link to verify your email: ${process.env.APP_URL}/api/verify-email/${token}}`
    );

    if (!emailVerification) {
      res.status(500).json({ error: "Failed to send email" });
      return;
    }

    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send email" });
  }
}
