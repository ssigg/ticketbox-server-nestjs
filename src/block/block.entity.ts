import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { DtoInterface } from "../dto.interface";
import { Event } from "../event/event.entity"
import { Category } from "../category/category.entity";
import { Seat } from "../seat/seat.entity";

@Entity()
export class Block implements ThinBlock {
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

export interface ThinBlock {
    id: number;
    name: string;
    numbered: boolean;
}