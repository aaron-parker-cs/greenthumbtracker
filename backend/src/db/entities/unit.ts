import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user";
import { GrowthRecord } from "./growth_record";
import { WaterRecord } from "./water_record";

@Entity()
export class UnitOfMeasure {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  symbol!: string;

  @ManyToOne(() => User, (user) => user.unitsOfMeasure, { nullable: true })
  createdUser!: User | null;

  @ManyToOne(() => GrowthRecord, (growth) => growth.uom, { nullable: true })
  growths!: GrowthRecord | null;

  @ManyToOne(() => WaterRecord, (water) => water.uom, { nullable: true })
  waters!: WaterRecord | null;

  @Column({ nullable: true })
  defaultType!: string;

  @CreateDateColumn()
  created_!: Date;

  @UpdateDateColumn()
  updated_!: Date;
}
