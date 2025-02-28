import { Equal, Repository } from "typeorm";
import { WaterRecord } from "../entities/water_record";
import { Plant } from "../entities/plant";
import { AppDataSource } from "../db";

export class WaterRepository {
  private repo: Repository<WaterRecord>;

  constructor() {
    this.repo = AppDataSource.getRepository(WaterRecord);
  }

  /**
   * Find all water records for a particular plant.
   */
  async findWaterRecordsByPlantId(plantId: number): Promise<WaterRecord[]> {
    const waterRecords = await this.repo.find({
      where: { plant: Equal(plantId) },
    });
    return waterRecords;
  }

  /**
   * Create and save a new water record
   */
  async createWaterRecord(
    plantId: number,
    date: Date,
    amount: number
  ): Promise<WaterRecord> {
    const newWaterRecord = new WaterRecord();
    const plant = await this.repo.manager.findOne(Plant, {
      where: { id: plantId },
    });
    if (!plant) {
      throw new Error(`Plant with id ${plantId} not found`);
    }
    newWaterRecord.plant = plant;
    newWaterRecord.date = date;
    newWaterRecord.amount = amount;
    return this.repo.save(newWaterRecord);
  }

  /**
   * Update a water record
   */
  async updateWaterRecord(
    id: number,
    plantId: number,
    date: Date,
    amount: number
  ): Promise<WaterRecord> {
    const waterRecord = await this.repo.findOne({ where: { id } });
    if (!waterRecord) {
      throw new Error(`Water record with id ${id} not found`);
    }
    const plant = await this.repo.manager.findOne(Plant, {
      where: { id: plantId },
    });
    if (!plant) {
      throw new Error(`Plant with id ${plantId} not found`);
    }
    waterRecord.plant = plant;
    waterRecord.date = date;
    waterRecord.amount = amount;
    return this.repo.save(waterRecord);
  }

  /**
   * Delete a water record
   */
  async deleteWaterRecord(id: number): Promise<void> {
    const waterRecord = await this.repo.findOne({ where: { id } });
    if (!waterRecord) {
      throw new Error(`Water record with id ${id} not found`);
    }
    await this.repo.remove(waterRecord);
  }
}

export const waterRepository = new WaterRepository();
