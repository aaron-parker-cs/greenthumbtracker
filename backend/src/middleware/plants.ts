import { Request, Response, NextFunction } from "express";
import { PlantRepository } from "../db/repositories/plant.repository";
import { UserRepository } from "../db/repositories/user.repository";

const plantRepo = new PlantRepository();
const userRepository = new UserRepository();

export const validatePlant = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const plant_id = req.params?.id;
    const { name, species } = req.body;
    const user_id = req.userId;

    if (!user_id) {
      res
        .status(400)
        .json({ message: "User ID is missing, token validation failed." });
      return;
    }

    // Check if all fields are provided
    if (!user_id || !name || !species) {
      res.status(400).json({
        message:
          "There was an error processing your request, please ensure you fill out all fields.",
      });
      return;
    }

    // Validate user_id, ensure it is a number.
    if (isNaN(user_id)) {
      res.status(400).json({ message: "User ID must be a number." });
      return;
    }

    // Validate plant_id, if it exists, ensure it is a number.
    if (plant_id && parseInt(plant_id) !== 0) {
      const plantNumber = parseInt(plant_id);
      if (isNaN(plantNumber)) {
        res.status(400).json({ message: "Plant ID must be a number." });
        return;
      }

      if (plantNumber < 0) {
        res
          .status(400)
          .json({ message: "Plant ID must be a positive number." });
        return;
      }

      // Ensure that the plant exists in the database and belongs to the user
      const plant = await plantRepo.findPlantById(plantNumber);
      if (!plant) {
        res.status(404).json({ message: "Plant not found." });
        return;
      }
      if (plant.user.id !== user_id) {
        res.status(403).json({
          message: "You do not have permission to update this plant."});
        return;
      }
    }

    // Ensure the user exists in the database
    const user = await userRepository.findUserById(user_id);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Validate name
    if (name.length < 3) {
      res.status(400).json({ message: "Name must be at least 3 characters." });
      return;
    }
    if (name.length > 100) {
      res
        .status(400)
        .json({ message: "Name is too long, limit of 100 characters." });
      return;
    }

    // Validate species
    if (species.length < 3) {
      res
        .status(400)
        .json({ message: "Species must be at least 3 characters." });
      return;
    }
    if (species.length > 100) {
      res
        .status(400)
        .json({ message: "Species is too long, limit of 100 characters." });
      return;
    }

    // All validations passed, proceed to the next middleware or controller
    next();
  } catch (err) {
    console.error("Validation error:", err);
    res.status(500).json({ message: "Internal server error." });
    return;
  }
};
