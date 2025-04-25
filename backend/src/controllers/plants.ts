import { Request, Response } from "express";
import { plantRepository } from "../db/repositories/plant.repository";

/**
 * GET /plants
 * Retrieve all plants belonging to a particular user.
 * (Assuming req.userId is set via middleware; adjust as needed.)
 */
export const getPlants = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      res.status(400).json({ message: "No user ID provided." });
      return;
    }

    const plants = await plantRepository.findPlantsByUserId(userId);
    res.status(200).json(plants);
    return;
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
    return;
  }
};

/**
 * POST /plants
 * Create a new plant for a user.
 * Expecting { user_id, name, species } in the request body.
 */
export const createPlant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, species } = req.body;
    const user_id = req.userId;
    if (!user_id || !name || !species) {
      res
        .status(400)
        .json({ message: "user_id, name, and species are required." });
      return;
    }

    await plantRepository.createPlant(user_id, name, species);
    res.status(201).json({ message: "Plant created successfully!" });
    return;
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
    return;
  }
};

/**
 * PUT /plants/:id
 * Update an existing plant. Expecting { user_id, name, species } in req.body.
 */
export const updatePlant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params?.id;
    const { name, species } = req.body;
    const user_id = req.userId;

    if (!id) {
      res.status(400).json({ message: "No plant ID provided." });
      return;
    }
    if (!user_id || !name || !species) {
      res
        .status(400)
        .json({ message: "user_id, name, and species are required." });
      return;
    }

    const plantId = parseInt(id, 10);
    await plantRepository.updatePlant(plantId, user_id, name, species);
    res.status(200).json({ message: "Plant updated successfully!" });
    return;
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
    return;
  }
};

/**
 * DELETE /plants/:id
 * Delete a plant by ID.
 */
export const deletePlant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "No plant ID provided." });
      return;
    }
    const plantId = parseInt(id, 10);

    await plantRepository.deletePlant(plantId);

    res.status(200).json({ message: "Plant deleted successfully!" });
    return;
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
    return;
  }
};
