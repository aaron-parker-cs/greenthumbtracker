import { Repository } from "typeorm";
import { AppDataSource } from "../db";
import { Plant } from "../entities/Plant";

export class RecordRepository {
  private repo: Repository<any>;

  constructor(entity: any) {
    this.repo = AppDataSource.getRepository(entity);
  }

  /**
   * Save new record data
   */
  async saveSensorData(recordData: Partial<any>): Promise<any> {
    return await this.repo.save(recordData);
  }

  /**
   * Get the latest sensor data by plant ID
   */
  async getSensorDataByPlant(plantId: number): Promise<any[]> {
    return await this.repo.find({
      where: { plant: { id: plantId } },
      order: { timestamp: "DESC" }, 
    });
  }

  /**
   * Find record by ID
   */
  async findRecordById(id: number): Promise<any | null> {
    return await this.repo.findOne({ where: { id } });
  }

  /**
   * Update record
   */
  async updateRecord(
    id: number,
    updatedFields: Partial<any>
  ): Promise<any> {
    const existingRecord = await this.findRecordById(id);
    if (!existingRecord) {
      throw new Error(`Record with id ${id} not found`);
    }

    Object.assign(existingRecord, updatedFields);
    return await this.repo.save(existingRecord);
  }

  /**
   * Delete record
   */
  async deleteRecord(id: number): Promise<void> {
    const existingRecord = await this.findRecordById(id);
    if (!existingRecord) {
      throw new Error(`Record with id ${id} not found`);
    }

    await this.repo.remove(existingRecord);
  }
}

/**
 * Export specific repositories for different record types
 */

export const genericRecordRepository = new RecordRepository(require("../entities/Record"));
export const waterRecordRepository = new RecordRepository(require("../entities/WaterRecord"));
export const growthRecordRepository = new RecordRepository(require("../entities/GrowthRecord"));