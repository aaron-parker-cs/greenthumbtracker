import { IdModel } from "./model";

export interface SoilMoistureRecord extends IdModel {
  plant: number;
  user: number;
  soil_moisture: number;
  date: Date;
}
