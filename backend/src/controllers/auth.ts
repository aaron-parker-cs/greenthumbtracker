import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userRepository } from "../db/repositories/user.repository";
import { AppDataSource } from "../db/db";
import { User } from "../db/entities/user";

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({ message: "Missing username, email, or password" });
      return;
    }

    // Check if user already exists
    const existingUser = await userRepository.findOneByEmailOrUsername(
      email,
      username
    );
    if (existingUser) {
      res.status(409).json("User already exists!");
      return;
    }

    // Hash & salt the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create and save the new user in DB
    await userRepository.createUser(username, email, hashedPassword);

    res.status(200).json("User has been created.");
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * Login an existing user
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json("Username or password missing!");
      return;
    }

    // Find user by username
    // user.password is not selected by default, so we grab a repo from the datasource and build a query here
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.username = :username", { username })
      .getOne();
    if (!user) {
      res.status(404).json("Username or password incorrect!");
      return;
    }

    // Compare stored password with provided password
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      console.log("Password incorrect");
      res.status(400).json("Username or password incorrect!");
      return;
    }

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET || "jwtSecret";
    const token = jwt.sign({ id: user.id }, jwtSecret);

    // Remove password from the response
    const { password: _, ...userData } = user;

    // Set the cookie and respond
    res
      .cookie("access_token", token, {
        httpOnly: true,
        // sameSite, secure, etc., as needed
      })
      .status(200)
      .json(userData);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * Logout the user by clearing the cookie
 */
export const logout = (req: Request, res: Response): void => {
  res
    .clearCookie("access_token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json("User has been logged out.");
};
