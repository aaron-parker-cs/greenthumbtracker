import { Request, Response, NextFunction } from "express";
// import { db } from "../db/db";

export const validateWater = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Check if all fields are provided, water date may be null for current timestamp
  const { plantId, waterAmount, waterDate } = req.body;
  if (!plantId || !waterAmount) {
    res
      .status(400)
      .json({
        message:
          "There was an error processing your request, please ensure you fill out all fields.",
      });
    return;
  }

  // Check if water amount is a number
  if (isNaN(waterAmount)) {
    res.status(400).json({ message: "Water amount must be a number." });
    return;
  }

  // Check if plant exists in the database
  /*
  const q = "SELECT * FROM plants WHERE id = ?";
  db.query(q, [plantId], (err: any, data: any) => {
    if (err) return res.json(err);
    if (Array.isArray(data) && data.length === 0)
      return res.status(404).json(`Plant with ID ${plantId} not found!`);
  });
*/
  // Sanity check the date (can't be in the future, or more than 1 year in the past)
  if (waterDate) {
    const date = new Date(waterDate);
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    if (date > now) {
      res.status(400).json({ message: "Water date cannot be in the future." });
      return;
    }
    if (date < oneYearAgo) {
      res
        .status(400)
        .json({
          message: "Water date cannot be more than 1 year in the past.",
        });
      return;
    }
  }

  // Proceed to next function
  next();
};
