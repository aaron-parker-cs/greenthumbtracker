import { Request, Response, NextFunction } from 'express';

export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
    const { username, email, password } = req.body;

    // Check if all fields are provided
    if (!username || !email || !password) {
        res.status(400).json({ message: "Please fill in all fields." });
        return; 
    }

    // Validate password
    if (password.length < 8) {
        res.status(400).json({ message: "Password must be at least 8 characters." });
        return;
    }
    if (password.length > 100) {
        res.status(400).json({ message: "Password is too long, limit of 100 characters." });
        return;
    }

    // Validate username
    if (username.length < 3) {
        res.status(400).json({ message: "Username must be at least 3 characters." });
        return;
    }
    if (username.length > 30) {
        res.status(400).json({ message: "Username is too long, limit of 30 characters." });
        return;
    }

    // Validate email
    if (email.length > 100) {
        res.status(400).json({ message: "Email address is too long, limit of 100 characters." });
        return;
    }

    // All validations passed, proceed to the next middleware or controller
    next();
};
