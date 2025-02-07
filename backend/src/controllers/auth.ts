import { db } from "../db/db";
import { Request, Response } from "express";
import bcrpt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req: Request, res: Response): void => {



    const q = "SELECT * FROM users WHERE email = ? OR username = ?";

    if(!req.body)
    {
        res.status(500).json({ message: "Empty request!" });
    }

    db.query(q, [req.body.email, req.body.username], (err, data) => {
        if (err) return res.json(err);
        if (Array.isArray(data) && data.length > 0) return res.status(409).json("User already exists!");

        // Hash + salt password, essential for security
        const salt = bcrpt.genSaltSync(10);
        const hashedPassword = bcrpt.hashSync(req.body.password, salt);

        const q = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        const values = [
            req.body.username,
            req.body.email,
            hashedPassword
        ];

        db.query(q, values, (err, data) => {
            if (err) return res.json(err);
            res.status(200).json("User has been created.");
        });
    });
}

export const login = (req: Request, res: Response) => {

    // Check if the user exists

    const q = "SELECT * FROM users WHERE username = ?";

    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.json(err);
        console.log(data);
        if (Array.isArray(data) && data.length === 0) return res.status(404).json("Username or password incorrect!");

        // Check if the password is correct
        const user = (data as any[])[0];
        const validPassword = bcrpt.compareSync(req.body.password, user.password);

        if (!validPassword) return res.status(400).json("Username or password incorrect!");

        const token = jwt.sign({ id: user.id }, "jwtSecret"); // TODO -- move secret to .env

        const { password, ...other } = user;

        res.cookie("access_token", token, {
            httpOnly: true, })
        .status(200)
        .json(user);
    });

}

export const logout = (req: Request, res: Response) => {
    res
        .clearCookie("access_token", {
            sameSite: "none",
            secure: true,
        })
        .status(200)
        .json("User has been logged out.");
}