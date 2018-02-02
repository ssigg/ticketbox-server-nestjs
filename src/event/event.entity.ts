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
    locationAddress: string;

    @Column({nullable: true})
    locationDirectionsPublicTransport: string;

    @Column({nullable: true})
    locationDirectionsCar: string;

    @Column({nullable: true})
    dateAndTime: string;

    @Column()
    isVisible: boolean;
}