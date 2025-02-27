import { Request, Response } from "express";
import { growthRepository } from "../db/repositories/growth.repository";

export const getGrowthRecords = async (req: Request, res: Response) => {
  const plantId = req.params.plantId;
  try {
    const userId = (req as any).userId;

    if (!userId) {
      res.status(400).json({ message: "No user ID provided." });
      return;
    }

    const records = await growthRepository.findGrowthRecordsByPlantId(
      Number(plantId)
    );
    res.status(200).json(records);
    return;
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
    return;
  }
};

export const createGrowthRecord = async (req: Request, res: Response) => {
  const { height, date } = req.body;
  const plantId = Number(req.params.plantId);
  try {
    const userId = (req as any).userId;

    if (!userId) {
      res.status(400).json({ message: "No user ID provided." });
      return;
    }

    const record = await growthRepository.createGrowthRecord(
      plantId,
      date,
      height
    );
    res.status(200).json({ message: "Growth Record created successfully" });
    return;
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
    return;
  }
};

export const updateGrowthRecord = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const plantId = Number(req.params.plantId);
  const { height, date } = req.body;
  try {
    const userId = (req as any).userId;

    if (!userId) {
      res.status(400).json({ message: "No user ID provided." });
      return;
    }

    const record = await growthRepository.updateGrowthRecord(
      id,
      plantId,
      date,
      height
    );
    res.status(200).json({ message: "Growth Record updated successfully" });
    return;
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
    return;
  }
};

export const deleteGrowthRecord = (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const userId = (req as any).userId;

    if (!userId) {
      res.status(400).json({ message: "No user ID provided." });
      return;
    }

    const record = growthRepository.deleteGrowthRecord(Number(id));
    res.status(200).json({ message: "Growth Record deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
    return;
  }
};
