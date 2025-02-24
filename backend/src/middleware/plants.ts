import { Request, Response, NextFunction } from 'express';
import { pool } from '../db/db'; 

export const validatePlant = (req: Request, res: Response, next: NextFunction): void => {
    const plant_id = parseInt(req.params.id, 10) || null;
    const { user_id, name, species } = req.body;

    // Check if all fields are provided
    if (!user_id || !name || !species) {
        res.status(400).json({ message: "There was an error processing your request, please ensure you fill out all fields." });
        return; 
    }

    // Validate user_id, ensure it is a number.
    if (isNaN(user_id)) {
        res.status(400).json({ message: "User ID must be a number." });
        return;
    }

     // Validate plant_id, if it exists, ensure it is a number.
     if (plant_id) {
        if (isNaN(plant_id)) {
            res.status(400).json({ message: "Plant ID must be a number." });
            return;
        }
        // Ensure that the plant exists in the database and belongs to the user
        const q = "SELECT * FROM plants WHERE id = ? AND user_id = ?";
        pool.query(q, [plant_id, user_id], (err: any, data: any) => {
            if (err) return res.json(err);
            if (Array.isArray(data) && data.length === 0) return res.status(404).json(`Plant with ID ${plant_id} not found or does not belong to you!`);
        });
    }

    // Ensure the user exists in the database
    const q = "SELECT * FROM users WHERE id = ?";
    pool.query(q, [user_id], (err: any, data: any) => {
        if (err) return res.json(err);
        if (Array.isArray(data) && data.length === 0) return res.status(404).json(`User with ID ${user_id} not found!`);
    });

    // Validate name
    if (name.length < 3) {
        res.status(400).json({ message: "Name must be at least 3 characters." });
        return;
    }
    if (name.length > 100) {
        res.status(400).json({ message: "Name is too long, limit of 100 characters." });
        return;
    }

    // Validate species
    if (species.length < 3) {
        res.status(400).json({ message: "Species must be at least 3 characters." });
        return;
    }
    if (species.length > 100) {
        res.status(400).json({ message: "Species is too long, limit of 100 characters." });
        return;
    }

    // All validations passed, proceed to the next middleware or controller
    next();
};