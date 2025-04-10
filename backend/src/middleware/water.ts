import { Request, Response, NextFunction } from "express";
import { plantRepository } from "../db/repositories/plant.repository";
import { uomRepository } from "../db/repositories/unit.repository";

export const validateWater = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Check if all fields are provided, water date may be null for current timestamp
  const { waterAmount, waterDate, uomId } = req.body;
  const plantId = Number(req.params.plantId);
  console.log(req.body);
  if (!plantId || !waterAmount) {
    res.status(400).json({
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

  // Check if uom ID is a number
  if (uomId && isNaN(Number(uomId))) {
    res.status(400).json({ message: "Unit of measure ID must be a number." });
    return;
  }

  // Check if uom exists in the database
  if (uomId) {
    try {
      const uom = await uomRepository.findUomById(Number(uomId));
      if (!uom) {
        res
          .status(400)
          .json({ message: `Unit of measure ${uomId} not found.` });
        return;
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error." });
      return;
    }
  }

  // Check if plant exists in the database
  const plant = plantRepository.findPlantById(plantId);
  if (!plant) {
    res.status(400).json({ message: `Plant ${plantId} not found.` });
    return;
  }

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
      res.status(400).json({
        message: "Water date cannot be more than 1 year in the past.",
      });
      return;
    }
  }

  // Check if plant exists in the database
  try {
    const plant = await plantRepository.findPlantById(Number(plantId));
    if (!plant) {
      res.status(400).json({ message: `Plant ${plantId} not found.` });
      return;
    }

    // Check if the plant belongs to the user
    const userId = (req as any).userId;
    if (plant.user.id !== userId) {
      res.status(400).json({
        message: `Plant ${plantId} does not belong to user ${userId}.`,
      });
      return;
    }

    // Proceed to next function
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
    return;
  }

  // Proceed to next function
  next();
};
