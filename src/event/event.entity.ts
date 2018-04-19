import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({nullable: true})
    location: string;

    @Column({nullable: true})
    location_address: string;

    @Column({nullable: true})
    location_directions_public_transport: string;

    @Column({nullable: true})
    location_directions_car: string;

    @Column({nullable: true})
    dateandtime: string;

    @Column()
    visible: boolean;
}