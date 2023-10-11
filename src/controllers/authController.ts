import { Request, Response } from "express";
import bcrypt from "@node-rs/bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "@/models/userModel";
import dotenv from "dotenv";
import { sendEmail } from "@/services/emailService";
dotenv.config();

export async function register(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // validate request body
    if (!(email && password)) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    // check if user already exists
    const userExists = await findUserByEmail(email);
    if (userExists) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await createUser(email, hashedPassword);

    if (!user) {
      res.status(500).json({ error: "Registration failed" });
      return;
    }

    // create token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    // send verification email
    const emailVerification = await sendEmail(
      email,
      "Email Verification",
      `Click the following link to verify your email: ${process.env.APP_URL}/api/verify-email/${token}}`
    );

    if (!emailVerification) {
      res.status(500).json({ error: "Registration failed" });
      return;
    }

    res.status(200).json({
      message: "User registered successfully, Kindly check your email.",
    });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  // validate request body
  if (!(email && password)) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  // check user
  const user = await findUserByEmail(email);

  if (!user) {
    res.status(400).json({ error: "Account not found" });
    return;
  }

  // check password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    res.status(401).json({ error: "Authentication failed" });
    return;
  }

  // create token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  res.status(200).json({ token });
}
