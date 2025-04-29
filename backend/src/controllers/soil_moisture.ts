import { Request, Response } from "express";
import { soilMoistureRepository } from "../db/repositories/soil_moisture_repository";
import { uomRepository } from "../db/repositories/unit.repository";

export const getSoilMoistureRecords = async (req: Request, res: Response) => {
  const plantId = Number(req.params.plantId);
  try {
    const records = await soilMoistureRepository.findSoilMoistureRecordsByPlantId(plantId);
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createSoilMoistureRecord = async (req: Request, res: Response) => {
  const { soilMoisture, date, uomId } = req.body;
  const plantId = Number(req.params.plantId);
  const userId = (req as any).userId;

  if (!userId) {
    res.status(400).json({ message: "User ID is required." });
    return;
  }

  try {
    const uom = await uomRepository.findUomById(uomId);
    if (!uom) {
      res.status(400).json({ message: "Unit of measure not found." });
      return;
    }

    await soilMoistureRepository.createSoilMoistureRecord(plantId, userId, new Date(date), soilMoisture);
    res.status(201).json({ message: "Soil moisture record created successfully." });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateSoilMoistureRecord = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const plantId = Number(req.params.plantId);
  const { date, soilMoisture, uomId } = req.body;
  const userId = (req as any).userId;

  if (!userId) {
    res.status(400).json({ message: "User ID is required." });
    return;
  }

  try {
    const uom = await uomRepository.findUomById(uomId);
    if (!uom) {
      res.status(400).json({ message: "Unit of measure not found." });
      return;
    }

    await soilMoistureRepository.updateSoilMoistureRecord(id, plantId, userId, new Date(date), soilMoisture);
    res.status(200).json({ message: "Soil moisture record updated successfully." });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteSoilMoistureRecord = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const userId = (req as any).userId;

  if (!userId) {
    res.status(400).json({ message: "User ID is required." });
    return;
  }

  try {
    await soilMoistureRepository.deleteSoilMoistureRecord(id);
    res.status(200).json({ message: "Soil moisture record deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
