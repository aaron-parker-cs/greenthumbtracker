import { IdModel } from "./model";

export interface HumidityRecord extends IdModel {
  plant: number;
  user: number;
  humidity: number;
  date: Date;
}
