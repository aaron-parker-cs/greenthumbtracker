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

  async findTemperatureRecordsByPlantId(plantId: number): Promise<TemperatureRecord[]> {
    return this.repo.find({ where: { plant: Equal(plantId) } });
  }

  async createTemperatureRecord(
    plantId: number,
    userId: number,  
    date: Date,
    temperature: number
  ): Promise<TemperatureRecord> {
    const newTemperatureRecord = new TemperatureRecord();
    
    const plant = await this.repo.manager.findOne(Plant, { where: { id: plantId } });
    if (!plant) {
      throw new Error(`Plant with id ${plantId} not found`);
    }

    const user = await this.repo.manager.findOne(User, { where: { id: userId } });
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    newTemperatureRecord.plant = plant;
    newTemperatureRecord.user = user;
    newTemperatureRecord.date = date;
    newTemperatureRecord.temperature = temperature;

    return this.repo.save(newTemperatureRecord);
  }
}

export const temperatureRepository = new TemperatureRepository();
