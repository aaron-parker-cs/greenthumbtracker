import { IdNameModel } from "./model";

export interface Role extends IdNameModel {
  users: number[];
}
