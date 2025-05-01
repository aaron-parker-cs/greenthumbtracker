import { Request, Response, NextFunction } from "express";
import { plantRepository } from "../db/repositories/plant.repository";
import { growthRepository } from "../db/repositories/growth.repository";
import { uomRepository } from "../db/repositories/unit.repository";

export const validateGrowth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Check if all fields are provided
  const { height, date, uomId } = req.body;
  const plantId = req.params.plantId;

  if (!plantId || !height) {
    res.status(400).json({
      message:
        "There was an error processing your request, please ensure you fill out all fields.",
    });
    return;
  }

  // Check if growth amount is a number
  if (isNaN(height)) {
    res.status(400).json({ message: "Growth amount must be a number." });
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

  // Sanity check the date (can't be in the future, or more than 1 year in the past)
  if (date) {
    const dateToCheck = new Date(date);
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    if (dateToCheck > now) {
      res.status(400).json({ message: "Growth date cannot be in the future." });
      return;
    }
    if (dateToCheck < oneYearAgo) {
      res.status(400).json({
        message: "Growth date cannot be more than 1 year in the past.",
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
};

export const validateDeleteGrowth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Check if plant ID is provided
  const plantId = req.params.plantId;
  const growthId = req.params.id;

  if (!plantId || !growthId) {
    res.status(400).json({
      message:
        "There was an error processing your request, please ensure you fill out all fields.",
    });
    return;
  }

  // Check if plant ID is a number
  if (isNaN(Number(plantId))) {
    res.status(400).json({ message: "Plant ID must be a number." });
    return;
  }

  // Check if growth ID is a number
  if (isNaN(Number(growthId))) {
    res.status(400).json({ message: "Growth ID must be a number." });
    return;
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

    // Check if the growth record exists in the database and belongs to the plant
    const growth = await growthRepository.findGrowthRecordById(
      Number(growthId)
    );
    if (!growth) {
      res.status(400).json({ message: `Growth record ${growthId} not found.` });
      return;
    }

    if (growth.plant.id !== Number(plantId)) {
      res.status(400).json({
        message: `Growth record ${growthId} does not belong to plant ${plantId}.`,
      });
      return;
    }

    // Proceed to next function
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
    return;
  }
};
