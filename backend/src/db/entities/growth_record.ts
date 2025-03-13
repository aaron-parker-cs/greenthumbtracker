import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Plant } from "./plant";
import { UnitOfMeasure } from "./unit";

@Entity()
export class GrowthRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Plant, (plant) => plant.id, { eager: true })
  plant!: Plant;

  @Column()
  height!: number;

  @ManyToOne(() => UnitOfMeasure, (uom) => uom.id, { eager: true })
  uom!: UnitOfMeasure;

  @Column()
  date!: Date;

  @CreateDateColumn()
  created_!: Date;

  @UpdateDateColumn()
  updated_!: Date;
}
