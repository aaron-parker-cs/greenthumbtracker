import { Request, Response } from "express";
import { temperatureRepository } from "../db/repositories/temperature_repository";
import { uomRepository } from "../db/repositories/unit.repository";

export const fetchTemperatureRecords = async (req: Request, res: Response) => {
  try {
    const plantId = parseInt(req.params.plantId);
    const records = await temperatureRepository.findTemperatureRecordsByPlantId(plantId);
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const logTemperatureRecord = async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(400).json({ message: "User authentication required." });
    }

    const plantId = Number(req.params.plantId);
    const { date, temperature, uomId } = req.body;

    try{
      const uom = await uomRepository.findUomById(uomId);
    if (!uom) {
      return res.status(400).json({ message: "Unit of measure not found." });
    }

    await temperatureRepository.createTemperatureRecord(
      plantId,
      userId,
      new Date(date),
      temperature,
    );

    res.status(201).json({ message: "Temperature record successfully added." });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const modifyTemperatureRecord = async (req: Request, res: Response) => {
  try {
    const recordId = Number(req.params.id);
    const plantId = Number(req.params.plantId);
    const { date, temperature, uomId } = req.body;

    const userId = (req as any).userId;
    if (!userId) {
      return res.status(400).json({ message: "User authentication required." });
    }

    const uom = await uomRepository.findUomById(uomId);
    if (!uom) {
      return res.status(400).json({ message: "Unit of measure not found." });
    }

    await temperatureRepository.updateTemperatureRecord(
      recordId,
      plantId,
      userId,
      new Date(date),
      temperature,
    );

    res.status(200).json({ message: "Temperature record successfully updated." });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const removeTemperatureRecord = async (req: Request, res: Response) => {
  try {
    const recordId = Number(req.params.id);
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(400).json({ message: "User authentication required." });
    }

    await temperatureRepository.deleteTemperatureRecord(recordId);
    res.status(200).json({ message: "Temperature record successfully deleted." });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
