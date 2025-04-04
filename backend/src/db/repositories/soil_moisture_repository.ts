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

  /**
   * Find all soil moisture records for a particular plant.
   */
  async findSoilMoistureRecordsByPlantId(plantId: number): Promise<SoilMoistureRecord[]> {
    return this.repo.find({ where: { plant: Equal(plantId) } });
  }

  /**
   * Create and save a new soil moisture record.
   */
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

  /**
   * Update a soil moisture record
   */
  async updateSoilMoistureRecord(
    id: number,
    plantId: number,
    userId: number,
    date: Date,
    soilMoisture: number
  ): Promise<SoilMoistureRecord> {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new Error(`Soil moisture record with id ${id} not found`);

    const plant = await this.repo.manager.findOne(Plant, { where: { id: plantId } });
    const user = await this.repo.manager.findOne(User, { where: { id: userId } });

    if (!plant) throw new Error(`Plant with id ${plantId} not found`);
    if (!user) throw new Error(`User with id ${userId} not found`);

    record.plant = plant;
    record.user = user;
    record.date = date;
    record.soil_moisture = soilMoisture;

    return this.repo.save(soilMoistureRecord);
  }

  /**
   * Delete a soil moisture record
   */
  async deleteSoilMoistureRecord(id: number): Promise<void> {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new Error(`Soil moisture record with id ${id} not found`);
    await this.repo.remove(soilMoistureRecord);
  }
}

export const soilMoistureRepository = new SoilMoistureRepository();
