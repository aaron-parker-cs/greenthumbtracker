import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Plant } from "./plant";
import { User } from "./user";

@Entity()
export class LightRecord {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Plant, (plant) => plant.id, { eager: true })
    plant!: Plant;

    @ManyToOne(() => User, (user) => user.id, { eager: true })
    user!: User; 

    @Column({ type: "float" })
    light!: number;

    @CreateDateColumn()
    date!: Date;
}
