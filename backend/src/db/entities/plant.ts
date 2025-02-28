import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Not,
  OneToMany,
} from "typeorm";
import { User } from "./user";
import { GrowthRecord } from "./growth_record";
import { WaterRecord } from "./water_record";

@Entity()
export class Plant {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.plants, { eager: true }) // eager: true means that when we fetch a plant, we also fetch the user that owns it
  user!: User;

  @OneToMany(() => GrowthRecord, (growth) => growth.plant)
  growths!: GrowthRecord[];

  @OneToMany(() => WaterRecord, (water) => water.plant)
  waters!: WaterRecord[];

  @Column()
  name!: string;

  @Column()
  species!: string;

  @CreateDateColumn()
  created_!: Date;

  @UpdateDateColumn()
  updated_!: Date;
}
