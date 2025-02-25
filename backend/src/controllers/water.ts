import { db } from "../db/db";
import { Request, Response } from "express";

export const getWaterRecords = (req: Request, res: Response) => {
  const { plantId } = req.body;
  const q = "SELECT * FROM WHERE plant_id = ?";
  db.query(q, plantId, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.send(data);
  });
};

export const createWaterRecord = (req: Request, res: Response) => {
  const { plantId, waterAmount, waterDate } = req.body;
  const userId = req.userId;
  const q =
    "INSERT INTO water (plant_id, user_id, water_amount, water_date) VALUES (?, ?, ?, ?)";
  const values = [plantId, userId, waterAmount, waterDate];
  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Water record created successfully!" });
  });
};

export const updateWaterRecord = (req: Request, res: Response) => {
  const id = req.params.id;
  const { plantId, waterAmount, waterDate } = req.body;
  const q =
    "UPDATE water SET plant_id = ?, water_amount = ?, water_date = ? WHERE id = ?";
  const values = [plantId, waterAmount, waterDate, id];
  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Water record updated successfully!" });
  });
};

export const deleteWaterRecord = (req: Request, res: Response) => {
  const id = req.params.id;
  const q = "DELETE FROM water WHERE id = ?";
  db.query(q, [id], (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Water record deleted successfully!" });
  });
};
