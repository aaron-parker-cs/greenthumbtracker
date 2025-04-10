import { Repository } from "typeorm";
import { SensorData } from "../entities/SensorData";
import { AppDataSource } from "../db";
import { Plant } from "../entities/Plant";

export class SensorDataRepository {
  private repo: Repository<SensorData>;

  constructor() {
    this.repo = AppDataSource.getRepository(SensorData);
  }

  /**
   * Save new sensor data
   */
  async saveSensorData(sensorData: Partial<SensorData>): Promise<SensorData> {
    return await this.repo.save(sensorData);
  }

  /**
   * Get the latest sensor data by plant ID
   */
  async getSensorDataByPlant(plantId: number): Promise<SensorData[]> {
    return await this.repo.find({
      where: { plant: { id: plantId } },
      order: { timestamp: "DESC" },
      take: 10, 
    });
  }

  /**
   * Find sensor data by ID
   */
  async findSensorDataById(id: number): Promise<SensorData | null> {
    return await this.repo.findOne({ where: { id } });
  }

  /**
   * Update sensor data record
   */
  async updateSensorData(
    id: number,
    updatedFields: Partial<SensorData>
  ): Promise<SensorData> {
    const existingRecord = await this.findSensorDataById(id);
    if (!existingRecord) {
      throw new Error(`Sensor data with id ${id} not found`);
    }

    Object.assign(existingRecord, updatedFields);
    return await this.repo.save(existingRecord);
  }

  /**
   * Delete sensor data record
   */
  async deleteSensorData(id: number): Promise<void> {
    const existingRecord = await this.findSensorDataById(id);
    if (!existingRecord) {
      throw new Error(`Sensor data with id ${id} not found`);
    }

    await this.repo.remove(existingRecord);
  }
}

export const sensorDataRepository = new SensorDataRepository();
