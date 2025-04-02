import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Plant } from "./Plant";

@Entity()
export class LightRecord {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Plant, (plant) => plant.id, { eager: true })
    plant!: Plant;

    @Column({ type: "float" })
    light_intensity!: number;

    @CreateDateColumn()
    recorded_at!: Date;
}
