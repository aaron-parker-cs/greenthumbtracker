import { IdModel } from "./model";

export interface TemperatureRecord extends IdModel {
  plant: number;
  user: number;
  temperature: number;
  date: Date;
}
