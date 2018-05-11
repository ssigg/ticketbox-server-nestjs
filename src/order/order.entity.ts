import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { AugmentedReservation } from '../reservation/reservation.entity';

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    unique_id: string;

    @Column()
    title: string;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column()
    email: string;

    @Column()
    locale: string;

    @Column()
    timestamp: number;

    updateFromDto(dto: OrderDto): void {
        this.unique_id = dto.unique_id;
        this.title = dto.title;
        this.firstname = dto.firstname;
        this.lastname = dto.lastname;
        this.email = dto.email;
        this.locale = dto.locale;
        this.timestamp = dto.timestamp;
    }
}

export interface OrderDto {
    unique_id: string;
    title: string;
    firstname: string;
    lastname: string;
    email: string;
    locale: string;
    timestamp: number;
}

export class AugmentedOrder {
    constructor(id: number, unique_id: string, title: string, firstname: string, lastname: string, email: string, locale: string, timestamp: number, reservations: AugmentedReservation[]) {
        this.id = id;
        this.unique_id = unique_id;
        this.title = title;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.locale = locale;
        this.timestamp = timestamp;
        this.reservations = reservations;
    }
    id: number;
    unique_id: string;
    title: string;
    firstname: string;
    lastname: string;
    email: string;
    locale: string;
    timestamp: number;
    reservations: AugmentedReservation[];
}