import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";
import { Event } from "../event/event.entity";
import { Seat } from "../seat/seat.entity";
import { Category } from "../category/category.entity";

@Entity()
@Index(["seat_id", "event_id"], { unique: true })
export class Reservation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    seat_id: number;

    @Column()
    event_id: number;

    @Column()
    category_id: number;

    @Column()
    unique_id: string;

    @Column()
    token: string;

    @Column()
    is_reduced: boolean;

    @Column({ nullable: true })
    order_id: number;

    @Column({ nullable: true })
    order_kind: OrderKind;

    @Column()
    is_scanned: boolean;

    @Column()
    timestamp: number;

    updateFromCreationDto(dto: CreateReservationDto): void {
        this.seat_id = dto.seat_id;
        this.event_id = dto.event_id;
        this.category_id = dto.category_id;
        this.unique_id = dto.unique_id;
        this.token = dto.token;
        this.is_reduced = dto.is_reduced;
        this.is_scanned = dto.is_scanned;
        this.timestamp = dto.timestamp;
    }

    updateFromUpdateReductionDto(dto: UpdateReductionReservationDto): void {
        this.is_reduced = dto.is_reduced;
    }

    updateFromAddToOrderDto(dto: AddToOrderReservationDto): void {
        this.order_id = dto.order_id;
        this.order_kind = dto.order_kind;
    }
}

export enum OrderKind {
    Reservation = 'reservation',
    BoxofficePurchase = 'boxoffice-purchase',
    CustomerPurchase = 'customer-purchase'
}

export interface CreateReservationDto {
    seat_id: number;
    event_id: number;
    category_id: number;
    unique_id: string;
    token: string;
    is_reduced: boolean;
    is_scanned: boolean;
    timestamp: number;
}

export interface UpdateReductionReservationDto {
    is_reduced: boolean;
}

export interface AddToOrderReservationDto {
    order_id: number;
    order_kind: OrderKind;
}

export class AugmentedReservation {
    constructor(id: number, unique_id: string, event: Event, seat: Seat, category: Category, isReduced: boolean, price: number, order_id: number, timestamp: number) {
        this.id = id;
        this.unique_id = unique_id;
        this.event = event;
        this.seat = seat;
        this.category = category;
        this.isReduced = isReduced;
        this.price = price;
        this.order_id = order_id;
        this.timestamp = timestamp;
    }
    id: number;
    unique_id: string;
    event: Event;
    seat: Seat;
    category: Category;
    isReduced: boolean;
    price: number;
    order_id: number;
    timestamp: number;
}