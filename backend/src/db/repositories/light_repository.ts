import { Equal, Repository } from "typeorm";
import { LightRecord } from "../entities/light_record";
import { Plant } from "../entities/plant";
import { User } from "../entities/user";  
import { AppDataSource } from "../db";

export class LightRepository {
  private repo: Repository<LightRecord>;

  constructor() {
    this.repo = AppDataSource.getRepository(LightRecord);
  }

  /**
   * Find all light records for a particular plant.
   */
  async findLightRecordsByPlantId(plantId: number): Promise<LightRecord[]> {
    return this.repo.find({ where: { plant: Equal(plantId) } });
  }

   /**
   * Create and save a new light record.
   */
  async createLightRecord(
    plantId: number,
    userId: number,  
    date: Date,
    light: number
  ): Promise<LightRecord> {
    const newLightRecord = new LightRecord();
    
    const plant = await this.repo.manager.findOne(Plant, { where: { id: plantId } });
    if (!plant) {
      throw new Error(`Plant with id ${plantId} not found`);
    }

    const user = await this.repo.manager.findOne(User, { where: { id: userId } });
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    newLightRecord.plant = plant;
    newLightRecord.user = user;
    newLightRecord.date = date;
    newLightRecord.light = light;

    return this.repo.save(newLightRecord);
  }

  /**
   * Update a light record
   */
  async updateLightRecord(
    id: number,
    plantId: number,
    userId: number,
    date: Date,
    light: number
  ): Promise<LightRecord> {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new Error(`Light record with id ${id} not found`);

    const plant = await this.repo.manager.findOne(Plant, { where: { id: plantId } });
    const user = await this.repo.manager.findOne(User, { where: { id: userId } });

    if (!plant) throw new Error(`Plant with id ${plantId} not found`);
    if (!user) throw new Error(`User with id ${userId} not found`);

    record.plant = plant;
    record.user = user;
    record.date = date;
    record.light = light;

    return this.repo.save(lightRecord);
  }

  /**
   * Delete a light record
   */
  async deleteLightRecord(id: number): Promise<void> {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new Error(`Light record with id ${id} not found`);
    await this.repo.remove(lightRecord);
  }
}

export const lightRepository = new LightRepository();
