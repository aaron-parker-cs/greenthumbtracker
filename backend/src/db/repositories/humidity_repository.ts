import { Equal, Repository } from "typeorm";
import { HumidityRecord } from "../entities/humidity_record";
import { Plant } from "../entities/plant";
import { User } from "../entities/user";  
import { AppDataSource } from "../db";

export class HumidityRepository {
  private repo: Repository<HumidityRecord>;

  constructor() {
    this.repo = AppDataSource.getRepository(HumidityRecord);
  }

  /**
   * Find all humidity records for a particular plant.
   */
  async findHumidityRecordsByPlantId(plantId: number): Promise<HumidityRecord[]> {
    return this.repo.find({ where: { plant: Equal(plantId) } });
  }

  /**
   * Create and save a new humidity record.
   */
  async createHumidityRecord(
    plantId: number,
    userId: number,  
    date: Date,
    humidity: number
  ): Promise<HumidityRecord> {
    const newHumidityRecord = new HumidityRecord();
    
    const plant = await this.repo.manager.findOne(Plant, { where: { id: plantId } });
    if (!plant) {
      throw new Error(`Plant with id ${plantId} not found`);
    }

    const user = await this.repo.manager.findOne(User, { where: { id: userId } });
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    newHumidityRecord.plant = plant;
    newHumidityRecord.user = user;
    newHumidityRecord.date = date;
    newHumidityRecord.humidity = humidity;

    return this.repo.save(newHumidityRecord);
  }

  /**
   * Update a humidity record
   */
  async updateHumidityRecord(
    id: number,
    plantId: number,
    userId: number,
    date: Date,
    humidity: number
  ): Promise<HumidityRecord> {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new Error(`Humidity record with id ${id} not found`);

    const plant = await this.repo.manager.findOne(Plant, { where: { id: plantId } });
    const user = await this.repo.manager.findOne(User, { where: { id: userId } });

    if (!plant) throw new Error(`Plant with id ${plantId} not found`);
    if (!user) throw new Error(`User with id ${userId} not found`);

    record.plant = plant;
    record.user = user;
    record.date = date;
    record.humidity = humidity;

    return this.repo.save(humidityRecord);
  }

  /**
   * Delete a humidity record
   */
  async deleteHumidityRecord(id: number): Promise<void> {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new Error(`Humidity record with id ${id} not found`);
    await this.repo.remove(humidityRecord);
  }
}

export const humidityRepository = new HumidityRepository();
