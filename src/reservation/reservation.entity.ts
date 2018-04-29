import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";
import { DtoInterface } from "../dto.interface";
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
}

export enum OrderKind {
    Reservation = 'reservation',
    BoxofficePurchase = 'boxoffice-purchase',
    CustomerPurchase = 'customer-purchase'
}

export class CreateReservationDto implements DtoInterface<Reservation> {
    seat_id: number;
    event_id: number;
    category_id: number;
    unique_id: string;
    token: string;
    is_reduced: boolean;
    is_scanned: boolean;
    timestamp: number;

    updateModel(model: Reservation): void {
        model.seat_id = this.seat_id;
        model.event_id = this.event_id;
        model.category_id = this.category_id;
        model.unique_id = this.unique_id;
        model.token = this.token;
        model.is_reduced = this.is_reduced;
        model.is_scanned = this.is_scanned;
        model.timestamp = this.timestamp;
    }
}

export class UpdateReductionReservationDto implements DtoInterface<Reservation> {
    is_reduced: boolean;

    updateModel(model: Reservation): void {
        model.is_reduced = this.is_reduced;
    }
}

export class AddToOrderReservationDto implements DtoInterface<Reservation> {
    order_id: number;
    order_kind: OrderKind;

    updateModel(model: Reservation): void {
        model.order_id = this.order_id;
        model.order_kind = this.order_kind;
    }
}

export class AugmentedReservation {
    constructor(id: number, unique_id: string, event: Event, seat: Seat, category: Category, isReduced: boolean, price: number, order_id: number) {
        this.id = id;
        this.unique_id = unique_id;
        this.event = event;
        this.seat = seat;
        this.category = category;
        this.isReduced = isReduced;
        this.price = price;
        this.order_id = order_id;
    }
    id: number;
    unique_id: string;
    event: Event;
    seat: Seat;
    category: Category;
    isReduced: boolean;
    price: number;
    order_id: number;
}