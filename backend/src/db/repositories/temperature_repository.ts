import { Equal, Repository } from "typeorm";
import { TemperatureRecord } from "../entities/temperature_record";
import { Plant } from "../entities/plant";
import { User } from "../entities/user";
import { AppDataSource } from "../db";

export class TemperatureRepository {
  private repo: Repository<TemperatureRecord>;

  constructor() {
    this.repo = AppDataSource.getRepository(TemperatureRecord);
  }

  /**
   * Find all temperature records for a particular plant.
   */
  async findTemperatureRecordsByPlantId(
    plantId: number
  ): Promise<TemperatureRecord[]> {
    return this.repo.find({ where: { plant: Equal(plantId) } });
  }

  /**
   * Create and save a new temperature record.
   */
  async createTemperatureRecord(
    plantId: number,
    userId: number,
    date: Date,
    temperature: number
  ): Promise<TemperatureRecord> {
    const newTemperatureRecord = new TemperatureRecord();

    const plant = await this.repo.manager.findOne(Plant, {
      where: { id: plantId },
    });
    if (!plant) {
      throw new Error(`Plant with id ${plantId} not found`);
    }

    const user = await this.repo.manager.findOne(User, {
      where: { id: userId },
    });
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    newTemperatureRecord.plant = plant;
    newTemperatureRecord.user = user;
    newTemperatureRecord.date = date;
    newTemperatureRecord.temperature = temperature;

    return this.repo.save(newTemperatureRecord);
  }

  /**
   * Update a temperature record
   */
  async updateTemperatureRecord(
    id: number,
    plantId: number,
    userId: number,
    date: Date,
    temperature: number
  ): Promise<TemperatureRecord> {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new Error(`Temperature record with id ${id} not found`);

    const plant = await this.repo.manager.findOne(Plant, {
      where: { id: plantId },
    });
    const user = await this.repo.manager.findOne(User, {
      where: { id: userId },
    });

    if (!plant) throw new Error(`Plant with id ${plantId} not found`);
    if (!user) throw new Error(`User with id ${userId} not found`);

    record.plant = plant;
    record.user = user;
    record.date = date;
    record.temperature = temperature;

    return this.repo.save(record);
  }

  /**
   * Delete a temperature record
   */
  async deleteTemperatureRecord(id: number): Promise<void> {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new Error(`Temperature record with id ${id} not found`);
    await this.repo.remove(record);
  }
}

export const temperatureRepository = new TemperatureRepository();
