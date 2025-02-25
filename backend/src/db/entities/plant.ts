import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user';

@Entity()
export class Plant {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Plant, plant => plant.user)
    user!: User;

    @Column()
    name!: string;

    @Column()
    species!: string;

    @CreateDateColumn()
    created_!: Date;
}