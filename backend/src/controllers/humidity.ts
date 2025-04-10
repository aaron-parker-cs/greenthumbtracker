import { Request, Response } from "express";
import { humidityRepository } from "../db/repositories/humidity_repository";
import { uomRepository } from "../db/repositories/unit.repository";

export const getHumidityRecords = async (req: Request, res: Response): Promise<void> => {
  const plantId = Number(req.params.plantId);
  try {
    const results = await humidityRepository.findHumidityRecordsByPlantId(plantId);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createHumidityRecord = async (req: Request, res: Response): Promise<void> => {
  const plantId = Number(req.params.plantId);
  const { date, humidity, uomId } = req.body;
  const userId = (req as any).userId;

  if (!userId) {
    res.status(400).json({ message: "Missing user ID in request." });
    return;
  }

  try {
    const uom = await uomRepository.findUomById(uomId);
    if (!uom) {
      res.status(400).json({ message: "Unit of measure not found." });
      return;
    }

    await humidityRepository.createHumidityRecord(plantId, userId, new Date(date), humidity);// might add uom later
    res.status(201).json({ message: "New humidity record successfully added." });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateHumidityRecord = async (req: Request, res: Response): Promise<void> => {
  const recordId = Number(req.params.id);
  const plantId = Number(req.params.plantId);
  const { date, humidity, uomId } = req.body;
  const userId = (req as any).userId;

  if (!userId) {
    res.status(400).json({ message: "User authentication required." });
    return;
  }

  try {
    const uom = await uomRepository.findUomById(uomId);
    if (!uom) {
      res.status(400).json({ message: "Unit of measure not found." });
      return;
    }

    await humidityRepository.updateHumidityRecord(recordId, plantId, userId, new Date(date), humidity);
    res.status(200).json({ message: "Humidity record successfully updated." });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteHumidityRecord = async (req: Request, res: Response): Promise<void> => {
  const recordId = Number(req.params.id);
  const userId = (req as any).userId;

  if (!userId) {
    res.status(400).json({ message: "User ID is required to proceed." });
    return;
  }

  try {
    await humidityRepository.deleteHumidityRecord(recordId);
    res.status(200).json({ message: "Humidity record deleted." });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
