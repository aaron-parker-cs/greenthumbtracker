import { Equal, Repository } from "typeorm";
import { SoilMoistureRecord } from "../entities/soil_moisture_record";
import { Plant } from "../entities/plant";
import { User } from "../entities/user";  
import { AppDataSource } from "../db";

export class SoilMoistureRepository {
  private repo: Repository<SoilMoistureRecord>;

  constructor() {
    this.repo = AppDataSource.getRepository(SoilMoistureRecord);
  }

  async findSoilMoistureRecordsByPlantId(plantId: number): Promise<SoilMoistureRecord[]> {
    return this.repo.find({ where: { plant: Equal(plantId) } });
  }

  async createSoilMoistureRecord(
    plantId: number,
    userId: number,  
    date: Date,
    soilMoisture: number
  ): Promise<SoilMoistureRecord> {
    const newSoilMoistureRecord = new SoilMoistureRecord();
    
    const plant = await this.repo.manager.findOne(Plant, { where: { id: plantId } });
    if (!plant) {
      throw new Error(`Plant with id ${plantId} not found`);
    }

    const user = await this.repo.manager.findOne(User, { where: { id: userId } });
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    newSoilMoistureRecord.plant = plant;
    newSoilMoistureRecord.user = user;
    newSoilMoistureRecord.date = date;
    newSoilMoistureRecord.soilMoisture = soilMoisture;

    return this.repo.save(newSoilMoistureRecord);
  }
}

export const soilMoistureRepository = new SoilMoistureRepository();
