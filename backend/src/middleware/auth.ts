import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { userRepository } from "../db/repositories/user.repository";
import validator from "validator";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // 1. Get token from cookies
    //const token = req.cookies.access_token;
    //try getting token through cookies
    let token: string | undefined = req.cookies && req.cookies.access_token;

    if (!token) {
      //res.status(401).json({ message: "Unauthorized" });
      const authHeader = req.headers["authorization"];
      if(authHeader && authHeader.startsWith("Bearer ")){
        token = authHeader.split(" ")[1];
      }
    }
    //if token isn't found in either cookies or header return appropriate error message
    if(!token) {
      console.error("No token found in cookies or authorization header");
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // 2. Verify the token
    const jwtSecret = process.env.JWT_SECRET || "jwtSecret";
    const decoded = jwt.verify(token, jwtSecret as string) as jwt.JwtPayload;

    // 3. Attach the userId (or entire decoded payload) to req so other routes can access it
    req.userId = decoded.id;

    // 4. Continue to the next middleware or route
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(403).json({ message: "Forbidden - Invalid token" });
    return;
  }
};

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { username, email, password } = req.body;

  // Check if all fields are provided
  if (!username || !email || !password) {
    res.status(400).json({ message: "Please fill in all fields." });
    return;
  }

  // Validate password
  if (password.length < 8) {
    res
      .status(400)
      .json({ message: "Password must be at least 8 characters." });
    return;
  }
  if (password.length > 100) {
    res
      .status(400)
      .json({ message: "Password is too long, limit of 100 characters." });
    return;
  }

  // Validate username
  if (username.length < 3) {
    res
      .status(400)
      .json({ message: "Username must be at least 3 characters." });
    return;
  }
  if (username.length > 30) {
    res
      .status(400)
      .json({ message: "Username is too long, limit of 30 characters." });
    return;
  }

  // Validate email
  if (!validator.isEmail(email)) {
    res.status(400).json({ message: "Invalid email address." });
    return;
  }

  if (email.length > 100) {
    res
      .status(400)
      .json({ message: "Email address is too long, limit of 100 characters." });
    return;
  }

  // Check if email is already in use
  userRepository.findUserByEmail(email).then((user) => {
    if (user) {
      res.status(400).json({ message: "Email already in use." });
      return;
    }
  });

  // All validations passed, proceed to the next middleware or controller
  next();
};

export const authorizeAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId } = req.body.userId;

  if (!userId) {
    res.status(400).json({ message: "Unauthorized" });
    return;
  }

  const role = await userRepository.findUserRoleByUserId(userId);
  if (!role || role.name !== "admin") {
    res.status(400).json({ message: "Unauthorized" });
    return;
  }

  next();
};
