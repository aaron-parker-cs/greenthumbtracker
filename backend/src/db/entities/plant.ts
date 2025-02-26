import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Not,
} from "typeorm";
import { User } from "./user";

@Entity()
export class Plant {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.plants, { eager: true }) // eager: true means that when we fetch a plant, we also fetch the user that owns it
  user!: User;

  @Column()
  name!: string;

  @Column()
  species!: string;

  @CreateDateColumn()
  created_!: Date;

  @UpdateDateColumn()
  updated_!: Date;
}
