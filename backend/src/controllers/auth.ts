import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { userRepository } from "../db/repositories/user.repository";
import { AppDataSource } from "../db/db";
import { User } from "../db/entities/user";
import { sendEmail } from "../utils/awsMailer";

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
      res.status(409).json({message:"User already exists!"});
      return;
    }

    // Hash & salt the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create a new user
    const user = new User();
    user.username = username;
    user.email = email;
    user.password = hashedPassword;
    user.isVerified = false;

    // Generate a verification token
    const token = jwt.sign({ email }, process.env.JWT_SECRET || "jwtSecret", {
      expiresIn: "1d",
    });
    user.verifyToken = token;
    user.verifyTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Send verification email
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    // Send email with verification link
    const htmlContent = `<h5> Hello ${username},</h5>
      <p>Thank you for registering with GreenThumb Tracker. Please click the link below to verify your email address:</p> <a href="${verifyUrl}">Verify Email</a>`;

    await sendEmail(
      email,
      "GreenThumb Tracker - Verify your email",
      htmlContent
    );

    // Create and save the new user in DB
    await AppDataSource.getRepository(User).save(user);

    res
      .status(200)
      .json({message:"User has been created. Please check your email to verify."});
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
    console.error("Registration Error", err);
  }
};

/**
 * Login an existing user
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({message:"Username or password missing!"});
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
      res.status(404).json({message:"Username or password incorrect!"});
      return;
    }

    // Check if user's email is verified
    if (!user.isVerified) {
      res.status(403).json({message:"Please verify your email before logging in."});
      return;
    }

    // Compare stored password with provided password
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      console.log("Password incorrect");
      res.status(400).json({message:"Username or password incorrect!"});
      return;
    }

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET || "jwtSecret";
    const token = jwt.sign({ id: user.id }, jwtSecret);

    // Remove password from the response
    const { password: _, ...userData } = user;

    // Set the cookie and respond WITH JSON
    // Set the cookie and respond WITH JSON
    res
      .cookie("access_token", token, {
        httpOnly: true,
        // sameSite, secure, etc., as needed
      })
      .status(200)
      //include user id in the return 
      .json({
       id: user.id,
       username: user.username,
       email: user.email,
       token
    });
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
    .json({message:"User has been logged out."});
};

/**
 * Verify the user's email
 */
export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.query;
    if (!token) {
      res.status(400).json({message:"Token missing!"});
      return;
    }

    const user = await AppDataSource.getRepository(User).findOne({
      where: { verifyToken: token as string },
    });

    if (!user) {
      res.status(404).json({message:"Invalid token!"});
      return;
    }

    // Check if token has expired
    if (user.verifyTokenExpires && user.verifyTokenExpires < new Date()) {
      res.status(400).json({message:"Token has expired!"});
      return;
    }

    // Update user's isVerified status
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpires = undefined;
    await AppDataSource.getRepository(User).save(user);

    res.status(200).json({message:"Email has been verified!"});
    return;
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * Request a password reset
 */
export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({message:"Email missing!"});
      return;
    }

    const user = await AppDataSource.getRepository(User).findOne({
      where: { email },
    });

    if (!user) {
      res.status(404).json({message:"User not found!"});
      return;
    }

    // Generate a reset token
    const resetToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "jwtSecret",
      {
        expiresIn: "1d",
      }
    );
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await AppDataSource.getRepository(User).save(user);

    // Send email with reset link
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    // Send email with reset link
    const htmlContent = `<h5> Hello ${user.username},</h5>
      <p>You have requested to reset your password. Please click the link below to reset your password:</p> <a href="${resetUrl}">Reset Password</a>`;

    await sendEmail(
      email,
      "GreenThumb Tracker - Reset your password",
      htmlContent
    );

    res.status(200).json({message:"Password reset email has been sent."});
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * Reset the user's password
 */
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      res.status(400).json({message:"Reset Token or new password missing!"});
      return;
    }

    const user = await AppDataSource.getRepository(User).findOne({
      where: { resetPasswordToken: token as string },
    });

    if (!user) {
      res.status(404).json({message:"Invalid token!"});
      return;
    }

    // Check if token has expired
    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      res.status(400).json({message:"Token has expired!"});
      return;
    }

    // Hash & salt the new password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Update user's password
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await AppDataSource.getRepository(User).save(user);

    res.status(200).json({message:"Password has been reset!"});
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
