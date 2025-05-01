import { IdModel } from "./model";

export interface LightRecord extends IdModel {
  plant: number;
  user: number;
  light: number;
  date: Date;
}
