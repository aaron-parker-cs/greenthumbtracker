import { Request, Response, NextFunction } from "express";
import { uomRepository } from "../db/repositories/unit.repository";

export const validateUnitOfMeasure = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, symbol, uomId } = req.body;

  if (!name || !symbol) {
    res.status(400).json({ message: "Name and symbol are required." });
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

  next();
};
