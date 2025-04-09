import { Request, Response } from "express";
import { lightRepository } from "../db/repositories/light_repository";
import { uomRepository } from "../db/repositories/unit.repository";

export const getLightRecords = async (req: Request, res: Response) => {
  const plantId = Number(req.params.plantId);
  try {
    const data = await lightRepository.findLightRecordsByPlantId(plantId);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createLightRecord = async (req: Request, res: Response) => {
  const { light, date, uomId } = req.body;
  const plantId = Number(req.params.plantId);
  const userId = (req as any).userId;

  if (!userId) {
    res.status(400).json({ message: "User ID missing in request." });
    return;
  }

  try {
    const uom = await uomRepository.findUomById(uomId);
    if (!uom) {
      res.status(400).json({ message: "Unit of measure not found." });
      return;
    }

    await lightRepository.createLightRecord(plantId, userId, new Date(date), light, uom);
    res.status(201).json({ message: "Light record successfully created." });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateLightRecord = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const plantId = Number(req.params.plantId);
  const { date, light, uomId } = req.body;
  const userId = (req as any).userId;

  if (!userId) {
    res.status(400).json({ message: "User ID missing in request." });
    return;
  }

  try {
    const uom = await uomRepository.findUomById(uomId);
    if (!uom) {
      res.status(400).json({ message: "Unit of measure not found." });
      return;
    }

    await lightRepository.updateLightRecord(id, plantId, new Date(date), light, uom);
    res.status(200).json({ message: "Light record updated successfully." });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteLightRecord = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const userId = (req as any).userId;

  if (!userId) {
    res.status(400).json({ message: "User ID missing in request." });
    return;
  }

  try {
    await lightRepository.deleteLightRecord(id);
    res.status(200).json({ message: "Light record removed successfully." });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
