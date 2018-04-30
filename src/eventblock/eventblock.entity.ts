import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { DtoInterface } from "../dto.interface";
import { Event } from "../event/event.entity";
import { Category } from "../category/category.entity";
import { Seat, AugmentedSeat } from "../seat/seat.entity";


@Entity()
export class Eventblock {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    event_id: number;

    @Column()
    block_id: number;

    @Column()
    category_id: number;

    updateFromDto(dto: EventblockDto): void {
        if (dto.event_id !== undefined) {
            this.event_id = dto.event_id;
        }
        if (dto.block_id !== undefined) {
            this.block_id = dto.block_id;
        }
        if (dto.category_id !== undefined) {
            this.category_id = dto.category_id;
        }
    }
}

export interface EventblockDto {
    event_id?: number;
    block_id?: number;
    category_id?: number;
}

export interface ThinMergedEventblockInterface {
    id: string;
    name: string;
    numbered: boolean;
}

export interface ComparableMergedEventblockInterface extends ThinMergedEventblockInterface {
    seatplan_image_data_url: string;
}

export class ThinMergedEventblock implements ComparableMergedEventblockInterface {
    constructor(id: string, name: string, numbered: boolean, seatplan_image_data_url: string) {
        this.id = id;
        this.name = name;
        this.numbered = numbered;
        this.seatplan_image_data_url = seatplan_image_data_url;
    }
    id: string;
    name: string;
    numbered: boolean;
    seatplan_image_data_url: string;
}

export class MergedEventblock implements ComparableMergedEventblockInterface {
    constructor(id: string, name: string, numbered: boolean, event: Event, seatplan_image_data_url: string, parts: MergedEventblockPart[] ){
        this.id = id;
        this.name = name;
        this.numbered = numbered;
        this.event = event;
        this.seatplan_image_data_url = seatplan_image_data_url;
        this.parts = parts;
    }
    id: string;
    name: string;
    numbered: boolean;
    event: Event;
    seatplan_image_data_url: string;
    parts: MergedEventblockPart[];
}

export class MergedEventblockPart {
    constructor(id: number, category: Category, seats: AugmentedSeat[]) {
        this.id = id;
        this.category = category;
        this.seats = seats;
    }
    id: number;
    category: Category;
    seats: AugmentedSeat[];
}