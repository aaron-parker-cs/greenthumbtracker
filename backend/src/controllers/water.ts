import { Request, Response } from "express";
import { waterRepository } from "../db/repositories/water.repository";

export const getWaterRecords = async (req: Request, res: Response) => {
  const plantId = req.params.plantId;
  try {
    const userId = (req as any).userId;

    if (!userId) {
      res.status(400).json({ message: "No user ID provided." });
      return;
    }

    const records = await waterRepository.findWaterRecordsByPlantId(
      Number(plantId)
    );
    res.status(200).json(records);
    return;
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
    return;
  }
};

export const createWaterRecord = async (req: Request, res: Response) => {
  const plantId = Number(req.params.plantId);
  const { waterAmount, waterDate } = req.body;
  try {
    const userId = (req as any).userId;

    if (!userId) {
      res.status(400).json({ message: "No user ID provided." });
      return;
    }

    const record = await waterRepository.createWaterRecord(
      plantId,
      waterDate,
      waterAmount
    );
    res.status(200).json({ message: "Water Record created successfully" });
    return;
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
    return;
  }
};

export const updateWaterRecord = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const plantId = Number(req.params.plantId);
  const { waterAmount, waterDate } = req.body;
  try {
    const userId = (req as any).userId;

    if (!userId) {
      res.status(400).json({ message: "No user ID provided." });
      return;
    }

    const record = await waterRepository.updateWaterRecord(
      id,
      plantId,
      waterDate,
      waterAmount
    );
    res.status(200).json({ message: "Water Record updated successfully" });
    return;
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
    return;
  }
};

export const deleteWaterRecord = (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const userId = (req as any).userId;

    if (!userId) {
      res.status(400).json({ message: "No user ID provided." });
      return;
    }

    const record = waterRepository.deleteWaterRecord(Number(id));
    res.status(200).json({ message: "Water Record deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
    return;
  }
};
