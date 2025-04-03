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

  async findHumidityRecordsByPlantId(plantId: number): Promise<HumidityRecord[]> {
    return this.repo.find({ where: { plant: Equal(plantId) } });
  }

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
}

export const humidityRepository = new HumidityRepository();
