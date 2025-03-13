import { IdNameModel } from "./model";

export interface Unit extends IdNameModel {
  symbol: string;
  createdUser: number | null;
  defaultType: string | null;
  created_: Date;
  updated_: Date;
}
