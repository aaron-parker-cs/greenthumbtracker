import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { Plant } from "./plant";
import { UnitOfMeasure } from "./unit";

@Entity()
export class WaterRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Plant, (plant: Plant) => plant.id, { eager: true })
  plant!: Plant;

  @Column()
  amount!: number;

  @ManyToOne(() => UnitOfMeasure, (uom) => uom.id, { eager: true })
  uom!: UnitOfMeasure;

  @Column()
  date!: Date;

  @CreateDateColumn()
  created_!: Date;

  @UpdateDateColumn()
  updated_!: Date;
}
