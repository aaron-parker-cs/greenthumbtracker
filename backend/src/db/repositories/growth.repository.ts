import { Repository, Equal } from "typeorm";
import { GrowthRecord } from "../entities/growth_record";
import { AppDataSource } from "../db";
import { Plant } from "../entities/plant";

export class GrowthRepository {
  private repo: Repository<GrowthRecord>;

  constructor() {
    this.repo = AppDataSource.getRepository(GrowthRecord);
  }

  /**
   * Find all growth records for a particular plant.
   */
  async findGrowthRecordsByPlantId(plantId: number): Promise<GrowthRecord[]> {
    const growthRecords = await this.repo.find({
      where: { plant: Equal(plantId) },
    });
    return growthRecords;
  }

  /**
   * Find a growth record by its ID
   */
  async findGrowthRecordById(id: number): Promise<GrowthRecord | null> {
    const growthRecord = await this.repo.findOne({ where: { id } });
    return growthRecord;
  }

  /**
   * Create and save a new growth record
   */
  async createGrowthRecord(
    plantId: number,
    date: Date,
    height: number
  ): Promise<GrowthRecord> {
    const newGrowthRecord = new GrowthRecord();
    const plant = await this.repo.manager.findOne(Plant, {
      where: { id: plantId },
    });
    if (!plant) {
      throw new Error(`Plant with id ${plantId} not found`);
    }
    newGrowthRecord.plant = plant;
    newGrowthRecord.date = date;
    newGrowthRecord.height = height;
    return this.repo.save(newGrowthRecord);
  }

  /**
   * Update a growth record
   */
  async updateGrowthRecord(
    id: number,
    plantId: number,
    date: Date,
    height: number
  ): Promise<GrowthRecord> {
    const growthRecord = await this.repo.findOne({ where: { id } });
    if (!growthRecord) {
      throw new Error(`Growth record with id ${id} not found`);
    }
    const plant = await this.repo.manager.findOne(Plant, {
      where: { id: plantId },
    });
    if (!plant) {
      throw new Error(`Plant with id ${plantId} not found`);
    }
    growthRecord.plant = plant;
    growthRecord.date = date;
    growthRecord.height = height;
    return this.repo.save(growthRecord);
  }

  /**
   * Delete a growth record
   */
  async deleteGrowthRecord(id: number): Promise<void> {
    const growthRecord = await this.repo.findOne({ where: { id } });
    if (!growthRecord) {
      throw new Error(`Growth record with id ${id} not found`);
    }
    await this.repo.remove(growthRecord);
  }
}

export const growthRepository = new GrowthRepository();
