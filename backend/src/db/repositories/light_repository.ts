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

  async findLightRecordsByPlantId(plantId: number): Promise<LightRecord[]> {
    return this.repo.find({ where: { plant: Equal(plantId) } });
  }

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
}

export const lightRepository = new LightRepository();
