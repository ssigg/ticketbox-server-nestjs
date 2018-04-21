import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { DtoInterface } from "../dto.interface";
import { Event } from "../event/event.entity"
import { Category } from "../category/category.entity";
import { Seat } from "../seat/seat.entity";

@Entity()
export class Block {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    numbered: boolean;

    @Column({nullable: true})
    seatplan_image_data_url: string;
}

export class BlockDto implements DtoInterface<Block> {
    name?: string;
    numbered?: boolean;
    seatplan_image_data_url?: string;
    
    updateModel(model: Block): void {
        if (this.name !== undefined) {
            model.name = this.name;
        }
        if (this.numbered !== undefined) {
            model.numbered = this.numbered;
        }
        if (this.seatplan_image_data_url !== undefined) {
            model.seatplan_image_data_url = this.seatplan_image_data_url;
        }
    }
}

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
}

export class EventblockDto implements DtoInterface<Eventblock> {
    event_id?: number;
    block_id?: number;
    category_id?: number;

    updateModel(model: Eventblock): void {
        if (this.event_id !== undefined) {
            model.event_id = this.event_id;
        }
        if (this.block_id !== undefined) {
            model.block_id = this.block_id;
        }
        if (this.category_id !== undefined) {
            model.category_id = this.category_id;
        }
    }
}

export interface ThinMergedEventblockInterface {
    id: string;
    name: string;
    numbered: boolean;
}

export class ThinMergedEventblock implements ThinMergedEventblockInterface {
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

export class MergedEventblock implements ThinMergedEventblockInterface {
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
    id: number;
    category: Category;
    seats: Seat[];
}