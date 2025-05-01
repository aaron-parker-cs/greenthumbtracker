import { Request, Response, NextFunction } from "express";
import { plantRepository } from "../db/repositories/plant.repository";
import { uomRepository } from "../db/repositories/unit.repository";

export const validateLight = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { light, date, uomId } = req.body;
  const plantId = Number(req.params.plantId);

  if (!plantId || light === undefined) {
    res.status(400).json({
      message:
        "There was an error processing your request, please ensure you fill out all fields.",
    });
    return;
  }

  if (isNaN(light)) {
    res.status(400).json({ message: "Light value must be a number." });
    return;
  }

  if (uomId && isNaN(Number(uomId))) {
    res.status(400).json({ message: "Unit of measure ID must be a number." });
    return;
  }

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

  if (date) {
    const dateToCheck = new Date(date);
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    if (dateToCheck > now) {
      res.status(400).json({ message: "Light reading date cannot be in the future." });
      return;
    }
    if (dateToCheck < oneYearAgo) {
      res.status(400).json({
        message: "Light reading date cannot be more than 1 year in the past.",
      });
      return;
    }
  }

  try {
    const plant = await plantRepository.findPlantById(plantId);
    if (!plant) {
      res.status(400).json({ message: `Plant ${plantId} not found.` });
      return;
    }

    const userId = (req as any).userId;
    if (plant.user.id !== userId) {
      res.status(400).json({
        message: `Plant ${plantId} does not belong to user ${userId}.`,
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
    return;
  }
};
