import { Repository, Equal } from "typeorm";
import { Plant } from "../entities/plant";
import { AppDataSource } from "../db";
import { User } from "../entities/user";

export class PlantRepository {
  private repo: Repository<Plant>;

  constructor() {
    this.repo = AppDataSource.getRepository(Plant);
  }

  /**
   * Find a plant by ID
   */
  async findPlantById(id: number): Promise<Plant | null> {
    const plant = await this.repo.findOneBy({ id });
    return plant ?? null;
  }

  /**
   * Find all plants by user ID
   */
  async findPlantsByUserId(userId: number): Promise<Plant[]> {
    return this.repo.find({ where: { user: Equal(userId) } });
  }

  /**
   * Create and save a new plant
   */
  async createPlant(
    userId: number,
    name: string,
    species: string
  ): Promise<Plant> {
    const newPlant = new Plant();
    newPlant.user = { id: userId } as User;
    newPlant.name = name;
    newPlant.species = species;
    return this.repo.save(newPlant);
  }

  /**
   * Update a plant
   */
  async updatePlant(
    id: number,
    userId: number,
    name: string,
    species: string
  ): Promise<Plant> {
    const plant = await this.findPlantById(id);
    if (!plant) throw new Error("Plant not found");

    plant.user = { id: userId } as User;
    plant.name = name;
    plant.species = species;
    return this.repo.save(plant);
  }

  /**
   * Delete a plant
   */
  async deletePlant(id: number): Promise<void> {
    const plant = await this.findPlantById(id);
    if (!plant) throw new Error("Plant not found");

    await this.repo.remove(plant);
  }
}

export const plantRepo = new PlantRepository();
