import { IdNameModel } from "./model";

export interface Plant extends IdNameModel {
  user: number;
  species: string;
  created_: Date | undefined;
  updated_: Date | undefined;
}
