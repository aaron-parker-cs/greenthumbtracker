import { pool } from "../db/db";
import { Request, Response } from "express";

export const getPlants = (req: Request, res: Response) => {
    const q = "SELECT * FROM plants WHERE user_id = ?";
    db.query(q, req.userId, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        res.send(data);
    });
}

export const createPlant = (req: Request, res: Response) => {
    const { user_id, name, species } = req.body;

    const q = "INSERT INTO plants (user_id, name, species) VALUES (?, ?, ?)";
    const values = [user_id, name, species];
    pool.query(q, values, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Plant created successfully!" });
    });
}

export const updatePlant = (req: Request, res: Response) => {
    const { id } = req.params;
    const { user_id, name, species } = req.body;

    const q = "UPDATE plants SET user_id = ?, name = ?, species = ? WHERE id = ?";
    const values = [user_id, name, species, id];
    pool.query(q, values, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });

        res.status(200).json({ message: "Plant updated successfully!" });
    });
}

export const deletePlant = (req: Request, res: Response) => {
    const { id } = req.params;

    const q = "DELETE FROM plants WHERE id = ?";
    pool.query(q, [id], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Plant deleted successfully!" });
    });
}
