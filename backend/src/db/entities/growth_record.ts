import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Plant } from "./plant";

@Entity()
export class GrowthRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Plant, (plant) => plant.id)
  plant!: Plant;

  @Column()
  height!: number;

  @Column()
  date!: Date;

  @CreateDateColumn()
  created_!: Date;

  @UpdateDateColumn()
  updated_!: Date;
}
