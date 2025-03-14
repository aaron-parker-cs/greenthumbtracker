import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class EmailTracking {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  count!: number;

  @Column()
  Date!: Date;
}
