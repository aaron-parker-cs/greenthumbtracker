import { IdModel } from "./model";

export interface GrowthRecord extends IdModel {
  plant: number;
  height: number;
  uom: number;
  date: Date;
  created_: Date;
  updated_: Date;
}
