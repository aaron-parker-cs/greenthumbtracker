import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Exclude } from "class-transformer";
import { Plant } from "./plant";
import { UnitOfMeasure } from "./unit";
import { UserRole } from "./user_role";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column({ select: false })
  password!: string;

  @Column({ default: "" })
  img?: string;

  @OneToMany(() => Plant, (plant) => plant.user)
  plants!: Plant[];

  @OneToMany(() => UnitOfMeasure, (uom) => uom.createdUser)
  @Exclude()
  unitsOfMeasure!: UnitOfMeasure[];

  @ManyToOne(() => UserRole, (role) => role.users)
  role!: UserRole;

  @Column({ default: false })
  isVerified!: boolean;

  @Column({ nullable: true, select: false, default: null })
  verifyToken?: string;

  @Column({ nullable: true, select: false, default: null })
  verifyTokenExpires?: Date;

  @Column({ nullable: true, select: false, default: null })
  resetPasswordToken?: string;

  @Column({ nullable: true, select: false, default: null })
  resetPasswordExpires?: Date;
}
