import { IdModel } from "./model";

export interface WaterRecord extends IdModel {
  plant: number;
  amount: number;
  uom: number;
  date: Date;
  created_: Date;
  updated_: Date;
}
